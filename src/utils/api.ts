import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-16ad7ffa`;

// دالة مساعدة للاتصال بالـ API
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ خطأ في API: ${endpoint}`, data);
      throw new Error(data.error || 'حدث خطأ في الاتصال بالخادم');
    }

    return data;
  } catch (error) {
    console.error(`❌ خطأ في الاتصال بـ ${endpoint}:`, error);
    throw error;
  }
}

// ============= حالات الطوارئ =============

export interface Emergency {
  id?: string;
  patientName: string;
  bloodType: string;
  unitsNeeded: number;
  urgencyLevel: 'critical' | 'high' | 'medium';
  hospitalName: string;
  hospitalLocation: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  notes?: string;
  matchedDonors?: any[];
  status?: string;
  responses?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export const emergencyAPI = {
  // إنشاء حالة طوارئ جديدة
  create: async (emergency: Emergency) => {
    return apiCall('/emergency', {
      method: 'POST',
      body: JSON.stringify(emergency),
    });
  },

  // الحصول على جميع حالات الطوارئ النشطة
  getAll: async () => {
    return apiCall('/emergencies', {
      method: 'GET',
    });
  },

  // الحصول على حالة طوارئ محددة
  getById: async (id: string) => {
    return apiCall(`/emergency/${id}`, {
      method: 'GET',
    });
  },

  // تحديث حالة طوارئ
  update: async (id: string, updates: Partial<Emergency>) => {
    return apiCall(`/emergency/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // إضافة استجابة متبرع
  addResponse: async (emergencyId: string, response: { donorId: string; status: string; responseTime?: string }) => {
    return apiCall(`/emergency/${emergencyId}/response`, {
      method: 'POST',
      body: JSON.stringify(response),
    });
  },
};

// ============= المتبرعين =============

export interface Donor {
  id?: string;
  name: string;
  bloodType: string;
  phoneNumber: string;
  email?: string;
  latitude: number;
  longitude: number;
  city?: string;
  age?: number;
  weight?: number;
  isAvailable?: boolean;
  points?: number;
  level?: string;
  totalDonations?: number;
  lastDonationDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const donorAPI = {
  // تسجيل متبرع جديد
  register: async (donor: Donor) => {
    return apiCall('/donor', {
      method: 'POST',
      body: JSON.stringify(donor),
    });
  },

  // الحصول على جميع المتبرعين
  getAll: async () => {
    return apiCall('/donors', {
      method: 'GET',
    });
  },

  // الحصول على متبرع محدد
  getById: async (id: string) => {
    return apiCall(`/donor/${id}`, {
      method: 'GET',
    });
  },

  // تحديث بيانات متبرع
  update: async (id: string, updates: Partial<Donor>) => {
    return apiCall(`/donor/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// ============= مخزون الدم =============

export interface InventoryItem {
  bloodType: string;
  currentUnits: number;
  minimumRequired: number;
  status?: 'good' | 'low' | 'critical';
  updatedAt?: string;
}

export const inventoryAPI = {
  // الحصول على المخزون الكامل
  getAll: async () => {
    return apiCall('/inventory', {
      method: 'GET',
    });
  },

  // تحديث مخزون فصيلة دم
  update: async (bloodType: string, data: { currentUnits: number; minimumRequired?: number }) => {
    return apiCall(`/inventory/${bloodType}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ============= الحملات =============

export interface Campaign {
  id?: string;
  title: string;
  description?: string;
  bloodTypes: string[];
  targetUnits: number;
  collectedUnits?: number;
  location?: string;
  startDate?: string;
  endDate?: string;
  hospitalName?: string;
  status?: string;
  participants?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export const campaignAPI = {
  // إنشاء حملة تبرع
  create: async (campaign: Campaign) => {
    return apiCall('/campaign', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  },

  // الحصول على جميع الحملات النشطة
  getAll: async () => {
    return apiCall('/campaigns', {
      method: 'GET',
    });
  },

  // الحصول على حملة محددة
  getById: async (id: string) => {
    return apiCall(`/campaign/${id}`, {
      method: 'GET',
    });
  },

  // تسجيل مشاركة في حملة
  participate: async (campaignId: string, participation: { donorId: string; donorName: string; unitsContributed: number }) => {
    return apiCall(`/campaign/${campaignId}/participate`, {
      method: 'POST',
      body: JSON.stringify(participation),
    });
  },
};

// ============= نداء استغاثة جغرافي =============

export interface GeoEmergency {
  bloodType: string;
  unitsNeeded: number;
  hospitalName: string;
  latitude: number;
  longitude: number;
  radius?: number;
  message?: string;
}

export const geoEmergencyAPI = {
  // إرسال نداء جغرافي
  send: async (geoEmergency: GeoEmergency) => {
    return apiCall('/geo-emergency', {
      method: 'POST',
      body: JSON.stringify(geoEmergency),
    });
  },
};

// ============= الإحصائيات =============

export const statsAPI = {
  // الحصول على إحصائيات عامة
  get: async () => {
    return apiCall('/stats', {
      method: 'GET',
    });
  },
};
