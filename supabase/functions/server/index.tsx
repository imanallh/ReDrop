import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============= HELPER FUNCTIONS =============

// حساب المسافة بين نقطتين جغرافيتين (بالكيلومتر)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// خوارزمية المطابقة الذكية - البحث عن أفضل 5 متبرعين
async function findBestDonors(
  bloodType: string, 
  latitude: number, 
  longitude: number
): Promise<any[]> {
  // الحصول على جميع المتبرعين
  const allDonors = await kv.getByPrefix("donor:");
  
  const radii = [10, 20, 30]; // التوسع التلقائي
  let matchedDonors: any[] = [];
  
  for (const radius of radii) {
    // فلترة المتبرعين حسب فصيلة الدم والمسافة والتوفر
    const candidateDonors = allDonors
      .map(item => item.value)
      .filter((donor: any) => {
        // التحقق من فصيلة الدم المتوافقة
        const isBloodCompatible = isCompatibleBloodType(donor.bloodType, bloodType);
        
        // التحقق من التوفر
        const isAvailable = donor.isAvailable === true;
        
        // حساب المسافة
        const distance = calculateDistance(
          latitude, 
          longitude, 
          donor.latitude, 
          donor.longitude
        );
        
        return isBloodCompatible && isAvailable && distance <= radius;
      })
      .map((donor: any) => ({
        ...donor,
        distance: calculateDistance(
          latitude, 
          longitude, 
          donor.latitude, 
          donor.longitude
        )
      }))
      .sort((a, b) => {
        // ترتيب حسب الأولوية: النقاط أولاً ثم المسافة
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        return a.distance - b.distance;
      });
    
    matchedDonors = candidateDonors.slice(0, 5);
    
    // إذا وجدنا 5 متبرعين، نتوقف
    if (matchedDonors.length >= 5) {
      break;
    }
  }
  
  return matchedDonors;
}

// التحقق من توافق فصائل الدم
function isCompatibleBloodType(donorType: string, recipientType: string): boolean {
  const compatibility: { [key: string]: string[] } = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+']
  };
  
  return compatibility[donorType]?.includes(recipientType) || false;
}

// توليد ID فريد
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============= API ENDPOINTS =============

// Health check
app.get("/make-server-16ad7ffa/health", (c) => {
  return c.json({ status: "ok" });
});

// ------------- حالات الطوارئ -------------

// إنشاء حالة طوارئ جديدة
app.post("/make-server-16ad7ffa/emergency", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      patientName, 
      bloodType, 
      unitsNeeded, 
      urgencyLevel, 
      hospitalName,
      hospitalLocation,
      latitude,
      longitude,
      contactNumber,
      notes 
    } = body;

    // التحقق من البيانات المطلوبة
    if (!patientName || !bloodType || !unitsNeeded || !hospitalName || !latitude || !longitude) {
      return c.json({ error: 'بيانات ناقصة: يجب توفير اسم المريض، فصيلة الدم، عدد الوحدات، اسم المستشفى، والموقع' }, 400);
    }

    const emergencyId = generateId();
    
    // خوارزمية المطابقة الذكية
    const matchedDonors = await findBestDonors(bloodType, latitude, longitude);
    
    const emergency = {
      id: emergencyId,
      patientName,
      bloodType,
      unitsNeeded,
      urgencyLevel: urgencyLevel || 'high',
      hospitalName,
      hospitalLocation,
      latitude,
      longitude,
      contactNumber,
      notes,
      matchedDonors,
      status: 'active',
      responses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`emergency:${emergencyId}`, emergency);

    console.log(`✅ حالة طوارئ جديدة: ${emergencyId} - ${patientName} - ${bloodType} - تم مطابقة ${matchedDonors.length} متبرعين`);

    return c.json({ 
      success: true, 
      emergency,
      message: `تم إنشاء الحالة وإيجاد ${matchedDonors.length} متبرعين مطابقين`
    }, 201);
  } catch (error) {
    console.error('❌ خطأ في إنشاء حالة طوارئ:', error);
    return c.json({ error: `فشل إنشاء حالة الطوارئ: ${error.message}` }, 500);
  }
});

// الحصول على جميع حالات الطوارئ النشطة
app.get("/make-server-16ad7ffa/emergencies", async (c) => {
  try {
    const emergencies = await kv.getByPrefix("emergency:");
    const activeEmergencies = emergencies
      .map(item => item.value)
      .filter((e: any) => e.status === 'active')
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ success: true, emergencies: activeEmergencies });
  } catch (error) {
    console.error('❌ خطأ في جلب حالات الطوارئ:', error);
    return c.json({ error: `فشل جلب حالات الطوارئ: ${error.message}` }, 500);
  }
});

// الحصول على حالة طوارئ محددة
app.get("/make-server-16ad7ffa/emergency/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const emergency = await kv.get(`emergency:${id}`);
    
    if (!emergency) {
      return c.json({ error: 'حالة الطوارئ غير موجودة' }, 404);
    }
    
    return c.json({ success: true, emergency });
  } catch (error) {
    console.error('❌ خطأ في جلب حالة الطوارئ:', error);
    return c.json({ error: `فشل جلب حالة الطوارئ: ${error.message}` }, 500);
  }
});

// تحديث حالة طوارئ
app.put("/make-server-16ad7ffa/emergency/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const emergency = await kv.get(`emergency:${id}`);
    if (!emergency) {
      return c.json({ error: 'حالة الطوارئ غير موجودة' }, 404);
    }
    
    const updatedEmergency = {
      ...emergency,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`emergency:${id}`, updatedEmergency);
    
    console.log(`✅ تم تحديث حالة الطوارئ: ${id}`);
    
    return c.json({ success: true, emergency: updatedEmergency });
  } catch (error) {
    console.error('❌ خطأ في تحديث حالة الطوارئ:', error);
    return c.json({ error: `فشل تحديث حالة الطوارئ: ${error.message}` }, 500);
  }
});

// إضافة استجابة متبرع لحالة طوارئ
app.post("/make-server-16ad7ffa/emergency/:id/response", async (c) => {
  try {
    const emergencyId = c.req.param('id');
    const body = await c.req.json();
    const { donorId, status, responseTime } = body;
    
    const emergency = await kv.get(`emergency:${emergencyId}`);
    if (!emergency) {
      return c.json({ error: 'حالة الطوارئ غير موجودة' }, 404);
    }
    
    const response = {
      donorId,
      status, // 'accepted', 'rejected', 'arrived'
      responseTime: responseTime || new Date().toISOString(),
      timestamp: new Date().toISOString()
    };
    
    emergency.responses = emergency.responses || [];
    emergency.responses.push(response);
    emergency.updatedAt = new Date().toISOString();
    
    await kv.set(`emergency:${emergencyId}`, emergency);
    
    // تحديث نقاط المتبرع
    if (status === 'accepted') {
      const donor = await kv.get(`donor:${donorId}`);
      if (donor) {
        donor.points = (donor.points || 0) + 10;
        donor.totalDonations = (donor.totalDonations || 0) + 1;
        await kv.set(`donor:${donorId}`, donor);
      }
    }
    
    console.log(`✅ استجابة متبرع: ${donorId} للحالة ${emergencyId} - ${status}`);
    
    return c.json({ success: true, emergency });
  } catch (error) {
    console.error('❌ خطأ في إضافة استجابة:', error);
    return c.json({ error: `فشل إضافة الاستجابة: ${error.message}` }, 500);
  }
});

// ------------- المتبرعين -------------

// تسجيل متبرع جديد
app.post("/make-server-16ad7ffa/donor", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      name, 
      bloodType, 
      phoneNumber, 
      email,
      latitude, 
      longitude,
      city,
      age,
      weight
    } = body;

    if (!name || !bloodType || !phoneNumber || !latitude || !longitude) {
      return c.json({ error: 'بيانات ناقصة: يجب توفير الاسم، فصيلة الدم، رقم الهاتف، والموقع' }, 400);
    }

    const donorId = generateId();
    
    const donor = {
      id: donorId,
      name,
      bloodType,
      phoneNumber,
      email,
      latitude,
      longitude,
      city,
      age,
      weight,
      isAvailable: true,
      points: 0,
      level: 'متبرع جديد',
      totalDonations: 0,
      lastDonationDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`donor:${donorId}`, donor);

    console.log(`✅ متبرع جديد: ${donorId} - ${name} - ${bloodType}`);

    return c.json({ success: true, donor }, 201);
  } catch (error) {
    console.error('❌ خطأ في تسجيل متبرع:', error);
    return c.json({ error: `فشل تسجيل المتبرع: ${error.message}` }, 500);
  }
});

// الحصول على جميع المتبرعين
app.get("/make-server-16ad7ffa/donors", async (c) => {
  try {
    const donors = await kv.getByPrefix("donor:");
    const donorsList = donors
      .map(item => item.value)
      .sort((a: any, b: any) => b.points - a.points);
    
    return c.json({ success: true, donors: donorsList });
  } catch (error) {
    console.error('❌ خطأ في جلب المتبرعين:', error);
    return c.json({ error: `فشل جلب المتبرعين: ${error.message}` }, 500);
  }
});

// الحصول على متبرع محدد
app.get("/make-server-16ad7ffa/donor/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const donor = await kv.get(`donor:${id}`);
    
    if (!donor) {
      return c.json({ error: 'المتبرع غير موجود' }, 404);
    }
    
    return c.json({ success: true, donor });
  } catch (error) {
    console.error('❌ خطأ في جلب المتبرع:', error);
    return c.json({ error: `فشل جلب المتبرع: ${error.message}` }, 500);
  }
});

// تحديث بيانات متبرع
app.put("/make-server-16ad7ffa/donor/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const donor = await kv.get(`donor:${id}`);
    if (!donor) {
      return c.json({ error: 'المتبرع غير موجود' }, 404);
    }
    
    const updatedDonor = {
      ...donor,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`donor:${id}`, updatedDonor);
    
    console.log(`✅ تم تحديث بيانات المتبرع: ${id}`);
    
    return c.json({ success: true, donor: updatedDonor });
  } catch (error) {
    console.error('❌ خطأ في تحديث المتبرع:', error);
    return c.json({ error: `فشل تحديث المتبرع: ${error.message}` }, 500);
  }
});

// ------------- مخزون الدم -------------

// الحصول على المخزون الكامل
app.get("/make-server-16ad7ffa/inventory", async (c) => {
  try {
    const inventory = await kv.getByPrefix("inventory:");
    const inventoryMap = inventory.reduce((acc: any, item) => {
      acc[item.value.bloodType] = item.value;
      return acc;
    }, {});
    
    // التأكد من وجود جميع فصائل الدم
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    bloodTypes.forEach(type => {
      if (!inventoryMap[type]) {
        inventoryMap[type] = {
          bloodType: type,
          currentUnits: 0,
          minimumRequired: 50,
          status: 'critical'
        };
      }
    });
    
    return c.json({ success: true, inventory: Object.values(inventoryMap) });
  } catch (error) {
    console.error('❌ خطأ في جلب المخزون:', error);
    return c.json({ error: `فشل جلب المخزون: ${error.message}` }, 500);
  }
});

// تحديث مخزون فصيلة دم
app.put("/make-server-16ad7ffa/inventory/:bloodType", async (c) => {
  try {
    const bloodType = c.req.param('bloodType');
    const body = await c.req.json();
    const { currentUnits, minimumRequired } = body;
    
    let status = 'good';
    if (currentUnits <= minimumRequired * 0.3) {
      status = 'critical';
    } else if (currentUnits <= minimumRequired * 0.6) {
      status = 'low';
    }
    
    const inventoryItem = {
      bloodType,
      currentUnits,
      minimumRequired: minimumRequired || 50,
      status,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`inventory:${bloodType}`, inventoryItem);
    
    console.log(`✅ تم تحديث مخزون ${bloodType}: ${currentUnits} وحدة - ${status}`);
    
    return c.json({ success: true, inventory: inventoryItem });
  } catch (error) {
    console.error('❌ خطأ في تحديث المخزون:', error);
    return c.json({ error: `فشل تحديث المخزون: ${error.message}` }, 500);
  }
});

// ------------- الحملات -------------

// إنشاء حملة تبرع
app.post("/make-server-16ad7ffa/campaign", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      title, 
      description, 
      bloodTypes, 
      targetUnits,
      location,
      startDate,
      endDate,
      hospitalName
    } = body;

    if (!title || !bloodTypes || !targetUnits) {
      return c.json({ error: 'بيانات ناقصة: يجب توفير العنوان، فصائل الدم، والهدف' }, 400);
    }

    const campaignId = generateId();
    
    const campaign = {
      id: campaignId,
      title,
      description,
      bloodTypes,
      targetUnits,
      collectedUnits: 0,
      location,
      startDate,
      endDate,
      hospitalName,
      status: 'active',
      participants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`campaign:${campaignId}`, campaign);

    console.log(`✅ حملة جديدة: ${campaignId} - ${title}`);

    return c.json({ success: true, campaign }, 201);
  } catch (error) {
    console.error('❌ خطأ في إنشاء حملة:', error);
    return c.json({ error: `فشل إنشاء الحملة: ${error.message}` }, 500);
  }
});

// الحصول على جميع الحملات النشطة
app.get("/make-server-16ad7ffa/campaigns", async (c) => {
  try {
    const campaigns = await kv.getByPrefix("campaign:");
    const activeCampaigns = campaigns
      .map(item => item.value)
      .filter((c: any) => c.status === 'active')
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ success: true, campaigns: activeCampaigns });
  } catch (error) {
    console.error('❌ خطأ في جلب الحملات:', error);
    return c.json({ error: `فشل جلب الحملات: ${error.message}` }, 500);
  }
});

// الحصول على حملة محددة
app.get("/make-server-16ad7ffa/campaign/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const campaign = await kv.get(`campaign:${id}`);
    
    if (!campaign) {
      return c.json({ error: 'الحملة غير موجودة' }, 404);
    }
    
    return c.json({ success: true, campaign });
  } catch (error) {
    console.error('❌ خطأ في جلب الحملة:', error);
    return c.json({ error: `فشل جلب الحملة: ${error.message}` }, 500);
  }
});

// تسجيل مشاركة في حملة
app.post("/make-server-16ad7ffa/campaign/:id/participate", async (c) => {
  try {
    const campaignId = c.req.param('id');
    const body = await c.req.json();
    const { donorId, donorName, unitsContributed } = body;
    
    const campaign = await kv.get(`campaign:${campaignId}`);
    if (!campaign) {
      return c.json({ error: 'الحملة غير موجودة' }, 404);
    }
    
    const participation = {
      donorId,
      donorName,
      unitsContributed,
      timestamp: new Date().toISOString()
    };
    
    campaign.participants = campaign.participants || [];
    campaign.participants.push(participation);
    campaign.collectedUnits = (campaign.collectedUnits || 0) + unitsContributed;
    campaign.updatedAt = new Date().toISOString();
    
    await kv.set(`campaign:${campaignId}`, campaign);
    
    // تحديث نقاط المتبرع
    const donor = await kv.get(`donor:${donorId}`);
    if (donor) {
      donor.points = (donor.points || 0) + (unitsContributed * 5);
      await kv.set(`donor:${donorId}`, donor);
    }
    
    console.log(`✅ مشاركة في حملة: ${donorId} في ${campaignId} - ${unitsContributed} وحدات`);
    
    return c.json({ success: true, campaign });
  } catch (error) {
    console.error('❌ خطأ في تسجيل المشاركة:', error);
    return c.json({ error: `فشل تسجيل المشاركة: ${error.message}` }, 500);
  }
});

// ------------- نداء استغاثة جغرافي -------------

// إرسال نداء جغرافي واسع النطاق
app.post("/make-server-16ad7ffa/geo-emergency", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      bloodType, 
      unitsNeeded, 
      hospitalName,
      latitude,
      longitude,
      radius, // نطاق البحث بالكيلومتر
      message
    } = body;

    if (!bloodType || !hospitalName || !latitude || !longitude) {
      return c.json({ error: 'بيانات ناقصة: يجب توفير فصيلة الدم، اسم المستشفى، والموقع' }, 400);
    }

    const searchRadius = radius || 30; // افتراضي 30 كم
    
    // الحصول على جميع المتبرعين في النطاق
    const allDonors = await kv.getByPrefix("donor:");
    const notifiedDonors = allDonors
      .map(item => item.value)
      .filter((donor: any) => {
        const distance = calculateDistance(latitude, longitude, donor.latitude, donor.longitude);
        const isBloodCompatible = isCompatibleBloodType(donor.bloodType, bloodType);
        return isBloodCompatible && donor.isAvailable && distance <= searchRadius;
      });
    
    const geoEmergencyId = generateId();
    const geoEmergency = {
      id: geoEmergencyId,
      type: 'geo-broadcast',
      bloodType,
      unitsNeeded,
      hospitalName,
      latitude,
      longitude,
      radius: searchRadius,
      message: message || `حالة طوارئ: نحتاج متبرعين بفصيلة ${bloodType} في ${hospitalName}`,
      notifiedDonors: notifiedDonors.map(d => ({ id: d.id, name: d.name, phoneNumber: d.phoneNumber })),
      totalNotified: notifiedDonors.length,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`geo-emergency:${geoEmergencyId}`, geoEmergency);
    
    console.log(`📡 نداء جغرافي: ${geoEmergencyId} - تم إرسال إشعار لـ ${notifiedDonors.length} متبرع`);
    
    return c.json({ 
      success: true, 
      geoEmergency,
      message: `تم إرسال نداء استغاثة لـ ${notifiedDonors.length} متبرع في نطاق ${searchRadius} كم`
    }, 201);
  } catch (error) {
    console.error('❌ خطأ في إرسال النداء الجغرافي:', error);
    return c.json({ error: `فشل إرسال النداء: ${error.message}` }, 500);
  }
});

// ------------- إحصائيات -------------

// الحصول على إحصائيات عامة
app.get("/make-server-16ad7ffa/stats", async (c) => {
  try {
    const emergencies = await kv.getByPrefix("emergency:");
    const donors = await kv.getByPrefix("donor:");
    const campaigns = await kv.getByPrefix("campaign:");
    
    const activeEmergencies = emergencies.filter((e: any) => e.value.status === 'active').length;
    const totalDonors = donors.length;
    const availableDonors = donors.filter((d: any) => d.value.isAvailable).length;
    const activeCampaigns = campaigns.filter((c: any) => c.value.status === 'active').length;
    
    const stats = {
      emergencies: {
        active: activeEmergencies,
        total: emergencies.length
      },
      donors: {
        total: totalDonors,
        available: availableDonors
      },
      campaigns: {
        active: activeCampaigns,
        total: campaigns.length
      }
    };
    
    return c.json({ success: true, stats });
  } catch (error) {
    console.error('❌ خطأ في جلب الإحصائيات:', error);
    return c.json({ error: `فشل جلب الإحصائيات: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);
