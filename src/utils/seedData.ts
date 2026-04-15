import { donorAPI, inventoryAPI } from './api';

// بيانات متبرعين تجريبية لمنطقة حفر الباطن
const sampleDonors = [
  {
    name: 'أحمد محمد العتيبي',
    bloodType: 'O+',
    phoneNumber: '+966501234567',
    email: 'ahmed@example.com',
    latitude: 28.4327,
    longitude: 45.9731,
    city: 'حفر الباطن',
    age: 28,
    weight: 75,
    isAvailable: true,
  },
  {
    name: 'فاطمة سعد المطيري',
    bloodType: 'A+',
    phoneNumber: '+966502345678',
    email: 'fatima@example.com',
    latitude: 28.4389,
    longitude: 45.9812,
    city: 'حفر الباطن',
    age: 25,
    weight: 62,
    isAvailable: true,
  },
  {
    name: 'خالد عبدالله الدوسري',
    bloodType: 'B+',
    phoneNumber: '+966503456789',
    email: 'khaled@example.com',
    latitude: 28.4276,
    longitude: 45.9689,
    city: 'حفر الباطن',
    age: 32,
    weight: 82,
    isAvailable: true,
  },
  {
    name: 'نورة إبراهيم الشمري',
    bloodType: 'AB+',
    phoneNumber: '+966504567890',
    email: 'noura@example.com',
    latitude: 28.4412,
    longitude: 45.9765,
    city: 'حفر الباطن',
    age: 29,
    weight: 58,
    isAvailable: true,
  },
  {
    name: 'سلطان صالح القحطاني',
    bloodType: 'O-',
    phoneNumber: '+966505678901',
    email: 'sultan@example.com',
    latitude: 28.4198,
    longitude: 45.9823,
    city: 'حفر الباطن',
    age: 35,
    weight: 88,
    isAvailable: true,
  },
  {
    name: 'مريم أحمد الحربي',
    bloodType: 'A-',
    phoneNumber: '+966506789012',
    email: 'mariam@example.com',
    latitude: 28.4356,
    longitude: 45.9701,
    city: 'حفر الباطن',
    age: 27,
    weight: 65,
    isAvailable: true,
  },
  {
    name: 'عبدالرحمن فهد العنزي',
    bloodType: 'B-',
    phoneNumber: '+966507890123',
    email: 'abdulrahman@example.com',
    latitude: 28.4289,
    longitude: 45.9778,
    city: 'حفر الباطن',
    age: 30,
    weight: 79,
    isAvailable: true,
  },
  {
    name: 'هند محمد المري',
    bloodType: 'AB-',
    phoneNumber: '+966508901234',
    email: 'hind@example.com',
    latitude: 28.4401,
    longitude: 45.9834,
    city: 'حفر الباطن',
    age: 26,
    weight: 60,
    isAvailable: true,
  },
  {
    name: 'يوسف عبدالعزيز الجهني',
    bloodType: 'O+',
    phoneNumber: '+966509012345',
    email: 'yousef@example.com',
    latitude: 28.4234,
    longitude: 45.9656,
    city: 'حفر الباطن',
    age: 33,
    weight: 85,
    isAvailable: true,
  },
  {
    name: 'سارة خالد الرشيدي',
    bloodType: 'A+',
    phoneNumber: '+966500123456',
    email: 'sara@example.com',
    latitude: 28.4378,
    longitude: 45.9789,
    city: 'حفر الباطن',
    age: 24,
    weight: 57,
    isAvailable: true,
  },
];

// بيانات مخزون تجريبية
const sampleInventory = [
  { bloodType: 'A+', currentUnits: 45, minimumRequired: 50 },
  { bloodType: 'A-', currentUnits: 28, minimumRequired: 50 },
  { bloodType: 'B+', currentUnits: 35, minimumRequired: 50 },
  { bloodType: 'B-', currentUnits: 12, minimumRequired: 50 },
  { bloodType: 'AB+', currentUnits: 18, minimumRequired: 50 },
  { bloodType: 'AB-', currentUnits: 8, minimumRequired: 50 },
  { bloodType: 'O+', currentUnits: 52, minimumRequired: 50 },
  { bloodType: 'O-', currentUnits: 15, minimumRequired: 50 },
];

// دالة لإضافة البيانات التجريبية
export async function seedDatabase() {
  try {
    console.log('🌱 بدء إضافة البيانات التجريبية...');

    // إضافة المتبرعين
    console.log('👥 إضافة المتبرعين...');
    for (const donor of sampleDonors) {
      try {
        await donorAPI.register(donor);
        console.log(`✅ تم إضافة المتبرع: ${donor.name}`);
      } catch (error) {
        console.error(`❌ فشل إضافة المتبرع ${donor.name}:`, error);
      }
    }

    // إضافة المخزون
    console.log('📊 إضافة بيانات المخزون...');
    for (const item of sampleInventory) {
      try {
        await inventoryAPI.update(item.bloodType, {
          currentUnits: item.currentUnits,
          minimumRequired: item.minimumRequired,
        });
        console.log(`✅ تم تحديث مخزون ${item.bloodType}`);
      } catch (error) {
        console.error(`❌ فشل تحديث مخزون ${item.bloodType}:`, error);
      }
    }

    console.log('✅ تم إضافة جميع البيانات التجريبية بنجاح!');
    return { success: true, message: 'تم إضافة البيانات التجريبية بنجاح' };
  } catch (error) {
    console.error('❌ خطأ في إضافة البيانات التجريبية:', error);
    throw error;
  }
}
