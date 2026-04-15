# 📚 توثيق Backend API - منصة RedDrop

## نظرة عامة

تم بناء backend متكامل لمنصة RedDrop يعمل على **Supabase Edge Functions** مع خادم **Hono**. النظام يدعم جميع العمليات الأساسية للمنصة مع خوارزمية مطابقة ذكية مدمجة.

---

## 🔗 الاتصال بالـ API

### Base URL
```
https://{projectId}.supabase.co/functions/v1/make-server-16ad7ffa
```

### Authentication
جميع الطلبات تتطلب Authorization header:
```
Authorization: Bearer {publicAnonKey}
```

### مثال على الاستخدام في الكود
```typescript
import { emergencyAPI } from '/src/utils/api';

// إنشاء حالة طوارئ
const result = await emergencyAPI.create({
  patientName: 'محمد أحمد',
  bloodType: 'O+',
  unitsNeeded: 2,
  urgencyLevel: 'high',
  hospitalName: 'مستشفى الملك فيصل',
  hospitalLocation: 'حفر الباطن',
  latitude: 28.4327,
  longitude: 45.9731,
  contactNumber: '+966501234567'
});
```

---

## 📍 API Endpoints

### 1️⃣ حالات الطوارئ

#### إنشاء حالة طوارئ جديدة
```
POST /emergency
```

**Request Body:**
```json
{
  "patientName": "محمد أحمد",
  "bloodType": "O+",
  "unitsNeeded": 2,
  "urgencyLevel": "high",
  "hospitalName": "مستشفى الملك فيصل",
  "hospitalLocation": "حفر الباطن",
  "latitude": 28.4327,
  "longitude": 45.9731,
  "contactNumber": "+966501234567",
  "notes": "ملاحظات إضافية"
}
```

**Response:**
```json
{
  "success": true,
  "emergency": {
    "id": "1234567890-abc",
    "patientName": "محمد أحمد",
    "bloodType": "O+",
    "matchedDonors": [...], // أفضل 5 متبرعين
    "status": "active",
    "createdAt": "2026-02-25T10:30:00Z"
  },
  "message": "تم إنشاء الحالة وإيجاد 5 متبرعين مطابقين"
}
```

**الخوارزمية الذكية:**
- البحث يبدأ في دائرة 10 كم
- التوسع التلقائي إلى 20 كم ثم 30 كم
- فلترة حسب فصيلة الدم والتوافق
- ترتيب حسب النقاط والمسافة
- اختيار أفضل 5 متبرعين

---

#### الحصول على جميع حالات الطوارئ النشطة
```
GET /emergencies
```

**Response:**
```json
{
  "success": true,
  "emergencies": [
    {
      "id": "1234567890-abc",
      "patientName": "محمد أحمد",
      "bloodType": "O+",
      "status": "active",
      ...
    }
  ]
}
```

---

#### الحصول على حالة طوارئ محددة
```
GET /emergency/:id
```

---

#### تحديث حالة طوارئ
```
PUT /emergency/:id
```

**Request Body:**
```json
{
  "status": "completed",
  "notes": "تم استلام التبرع بنجاح"
}
```

---

#### إضافة استجابة متبرع لحالة طوارئ
```
POST /emergency/:id/response
```

**Request Body:**
```json
{
  "donorId": "donor-123",
  "status": "accepted",
  "responseTime": "2026-02-25T10:35:00Z"
}
```

**تحديث تلقائي:**
- عند القبول: المتبرع يحصل على +10 نقاط
- زيادة عداد التبرعات الكلية

---

### 2️⃣ المتبرعين

#### تسجيل متبرع جديد
```
POST /donor
```

**Request Body:**
```json
{
  "name": "أحمد محمد",
  "bloodType": "O+",
  "phoneNumber": "+966501234567",
  "email": "ahmed@example.com",
  "latitude": 28.4327,
  "longitude": 45.9731,
  "city": "حفر الباطن",
  "age": 28,
  "weight": 75
}
```

**Response:**
```json
{
  "success": true,
  "donor": {
    "id": "donor-123",
    "name": "أحمد محمد",
    "bloodType": "O+",
    "isAvailable": true,
    "points": 0,
    "level": "متبرع جديد",
    "totalDonations": 0
  }
}
```

---

#### الحصول على جميع المتبرعين
```
GET /donors
```

**الترتيب:** حسب النقاط (الأعلى أولاً)

---

#### الحصول على متبرع محدد
```
GET /donor/:id
```

---

#### تحديث بيانات متبرع
```
PUT /donor/:id
```

**Request Body:**
```json
{
  "isAvailable": false,
  "lastDonationDate": "2026-02-25"
}
```

---

### 3️⃣ مخزون الدم

#### الحصول على المخزون الكامل
```
GET /inventory
```

**Response:**
```json
{
  "success": true,
  "inventory": [
    {
      "bloodType": "A+",
      "currentUnits": 45,
      "minimumRequired": 50,
      "status": "low",
      "updatedAt": "2026-02-25T10:00:00Z"
    },
    {
      "bloodType": "O-",
      "currentUnits": 15,
      "minimumRequired": 50,
      "status": "critical"
    }
  ]
}
```

**حالات المخزون:**
- `critical`: <= 30% من الحد الأدنى
- `low`: <= 60% من الحد الأدنى
- `good`: > 60% من الحد الأدنى

---

#### تحديث مخزون فصيلة دم
```
PUT /inventory/:bloodType
```

**Request Body:**
```json
{
  "currentUnits": 45,
  "minimumRequired": 50
}
```

---

### 4️⃣ الحملات

#### إنشاء حملة تبرع
```
POST /campaign
```

**Request Body:**
```json
{
  "title": "حملة تبرع طارئة - فصيلة O-",
  "description": "نحتاج 100 وحدة من فصيلة O-",
  "bloodTypes": ["O-"],
  "targetUnits": 100,
  "location": "مستشفى الملك فيصل",
  "startDate": "2026-03-01",
  "endDate": "2026-03-07",
  "hospitalName": "مستشفى الملك فيصل"
}
```

---

#### الحصول على جميع الحملات النشطة
```
GET /campaigns
```

---

#### الحصول على حملة محددة
```
GET /campaign/:id
```

---

#### تسجيل مشاركة في حملة
```
POST /campaign/:id/participate
```

**Request Body:**
```json
{
  "donorId": "donor-123",
  "donorName": "أحمد محمد",
  "unitsContributed": 2
}
```

**تحديث تلقائي:**
- المتبرع يحصل على +5 نقاط لكل وحدة
- تحديث عداد الوحدات المجمّعة في الحملة

---

### 5️⃣ نداء استغاثة جغرافي

#### إرسال نداء جغرافي واسع النطاق
```
POST /geo-emergency
```

**Request Body:**
```json
{
  "bloodType": "O+",
  "unitsNeeded": 10,
  "hospitalName": "مستشفى الملك فيصل",
  "latitude": 28.4327,
  "longitude": 45.9731,
  "radius": 30,
  "message": "حالة طوارئ: نحتاج متبرعين بفصيلة O+"
}
```

**Response:**
```json
{
  "success": true,
  "geoEmergency": {
    "id": "geo-123",
    "notifiedDonors": [...],
    "totalNotified": 25
  },
  "message": "تم إرسال نداء استغاثة لـ 25 متبرع في نطاق 30 كم"
}
```

---

### 6️⃣ الإحصائيات

#### الحصول على إحصائيات عامة
```
GET /stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "emergencies": {
      "active": 5,
      "total": 120
    },
    "donors": {
      "total": 350,
      "available": 280
    },
    "campaigns": {
      "active": 3,
      "total": 45
    }
  }
}
```

---

## 🎯 الخوارزمية الذكية للمطابقة

### كيف تعمل؟

1. **التوسع الديناميكي:**
   - نطاق 10 كم → 20 كم → 30 كم
   - التوقف عند إيجاد 5 متبرعين مؤهلين

2. **معايير الفلترة:**
   - توافق فصيلة الدم
   - حالة التوفر (isAvailable = true)
   - المسافة من المستشفى

3. **الترتيب والأولوية:**
   - النقاط (الأعلى أولاً)
   - المسافة (الأقرب أولاً)

4. **جدول التوافق:**
```
O- → يتبرع لـ: جميع الفصائل
O+ → يتبرع لـ: O+, A+, B+, AB+
A- → يتبرع لـ: A-, A+, AB-, AB+
A+ → يتبرع لـ: A+, AB+
B- → يتبرع لـ: B-, B+, AB-, AB+
B+ → يتبرع لـ: B+, AB+
AB- → يتبرع لـ: AB-, AB+
AB+ → يتبرع لـ: AB+ فقط
```

---

## 💾 نظام التخزين

### KV Store Structure

```
emergency:{id}        → بيانات حالة طوارئ
donor:{id}           → بيانات متبرع
inventory:{bloodType} → مخزون فصيلة دم
campaign:{id}        → بيانات حملة
geo-emergency:{id}   → نداء جغرافي
```

---

## 🌱 البيانات التجريبية

### تحميل البيانات
```typescript
import { seedDatabase } from '/src/utils/seedData';

await seedDatabase();
```

**يتم إضافة:**
- 10 متبرعين في منطقة حفر الباطن
- 8 فصائل دم في المخزون
- بيانات جغرافية حقيقية لحفر الباطن

---

## 🔐 الأمان

- جميع الطلبات تتطلب Authorization header
- CORS مفعّل لجميع المصادر
- معالجة الأخطاء شاملة مع سجلات مفصلة
- التحقق من البيانات المطلوبة

---

## 📝 أمثلة عملية

### مثال 1: إنشاء حالة طوارئ كاملة
```typescript
import { emergencyAPI } from '/src/utils/api';

const createEmergency = async () => {
  try {
    const result = await emergencyAPI.create({
      patientName: 'سارة أحمد',
      bloodType: 'A+',
      unitsNeeded: 3,
      urgencyLevel: 'critical',
      hospitalName: 'مستشفى جامعة حفر الباطن',
      hospitalLocation: 'حفر الباطن - طريق الملك فهد',
      latitude: 28.4327,
      longitude: 45.9731,
      contactNumber: '+966501234567',
      notes: 'عملية جراحية طارئة'
    });
    
    console.log(`تم إيجاد ${result.emergency.matchedDonors.length} متبرعين`);
    console.log(result.emergency.matchedDonors);
  } catch (error) {
    console.error('خطأ:', error);
  }
};
```

### مثال 2: تحديث المخزون
```typescript
import { inventoryAPI } from '/src/utils/api';

const updateInventory = async () => {
  await inventoryAPI.update('O+', {
    currentUnits: 25,
    minimumRequired: 50
  });
  
  // الحصول على المخزون الكامل
  const inventory = await inventoryAPI.getAll();
  const criticalItems = inventory.inventory.filter(
    item => item.status === 'critical'
  );
  
  console.log('فصائل في حالة حرجة:', criticalItems);
};
```

### مثال 3: نداء استغاثة
```typescript
import { geoEmergencyAPI } from '/src/utils/api';

const sendGeoEmergency = async () => {
  const result = await geoEmergencyAPI.send({
    bloodType: 'O-',
    unitsNeeded: 5,
    hospitalName: 'مستشفى الملك فيصل',
    latitude: 28.4327,
    longitude: 45.9731,
    radius: 30,
    message: 'حالة طوارئ قصوى - نحتاج متبرعين فصيلة O- فوراً'
  });
  
  console.log(`تم إشعار ${result.geoEmergency.totalNotified} متبرع`);
};
```

---

## 🚀 الخطوات التالية

1. **ربط الواجهات بالـ API:**
   - تحديث CreateEmergency لاستخدام emergencyAPI.create()
   - تحديث InventoryMonitoring لاستخدام inventoryAPI
   - تحديث GeoEmergency لاستخدام geoEmergencyAPI

2. **إضافة Real-time Updates:**
   - استخدام Supabase Realtime للتحديثات اللحظية

3. **نظام المصادقة:**
   - تسجيل دخول للمستشفيات
   - تسجيل دخول للمتبرعين

4. **إشعارات SMS:**
   - دمج مع خدمة SMS (مثل Twilio)
   - إرسال إشعارات للمتبرعين المطابقين

---

## ⚠️ ملاحظات مهمة

1. **البيئة الحالية:** هذا نظام للنماذج الأولية. للاستخدام الإنتاجي:
   - إضافة مصادقة قوية
   - تشفير البيانات الحساسة
   - الامتثال لقوانين حماية البيانات الصحية

2. **حدود KV Store:**
   - مناسب للنماذج الأولية
   - للإنتاج: استخدام PostgreSQL مباشرة

3. **SMS Integration:**
   - يتطلب خدمة خارجية (Twilio/AWS SNS)
   - يحتاج API key إضافية

---

## 📞 الدعم

للأسئلة أو المساعدة، راجع:
- `/src/utils/api.ts` - واجهة API الكاملة
- `/supabase/functions/server/index.tsx` - كود الـ Backend
- `/src/utils/seedData.ts` - البيانات التجريبية
