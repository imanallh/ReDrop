import { useState } from 'react';
import { ArrowRight, Calendar, MapPin, Users, Target, FileText, CheckCircle, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface CreateCampaignProps {
  onBack: () => void;
  suggestedBloodType?: string;
}

export default function CreateCampaign({ onBack, suggestedBloodType }: CreateCampaignProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    targetDonors: '',
    bloodTypes: suggestedBloodType ? [suggestedBloodType] : [] as string[],
    description: '',
    contactPerson: '',
    contactPhone: '',
    facilities: [] as string[],
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const availableFacilities = [
    'غرف راحة مكيفة',
    'وجبات خفيفة ومشروبات',
    'فريق طبي متكامل',
    'فحوصات مجانية',
    'شهادات تقدير',
    'مواقف سيارات'
  ];

  const handleBloodTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      bloodTypes: prev.bloodTypes.includes(type)
        ? prev.bloodTypes.filter(t => t !== type)
        : [...prev.bloodTypes, type]
    }));
  };

  const handleFacilityToggle = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onBack();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2 mb-6 bg-white"
          >
            <ArrowRight className="w-4 h-4" />
            رجوع
          </Button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-4 shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">إنشاء حملة تبرع بالدم</h1>
            <p className="text-lg text-gray-600">املأ التفاصيل لإنشاء حملة تبرع جديدة</p>
            {suggestedBloodType && (
              <Badge className="mt-3 bg-red-600 text-lg px-4 py-2">
                مقترحة لفصيلة الدم: {suggestedBloodType}
              </Badge>
            )}
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <FileText className="w-4 h-4 inline ml-2" />
                  اسم الحملة *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="مثال: حملة التبرع الشتوية 2025"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    <Calendar className="w-4 h-4 inline ml-2" />
                    تاريخ الحملة *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    وقت البدء *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <MapPin className="w-4 h-4 inline ml-2" />
                  موقع الحملة *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="مثال: جامعة حفر الباطن - القاعة الرئيسية"
                />
              </div>

              {/* Target Donors */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <Target className="w-4 h-4 inline ml-2" />
                  عدد المتبرعين المستهدف *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.targetDonors}
                  onChange={(e) => setFormData({ ...formData, targetDonors: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="مثال: 200"
                />
              </div>

              {/* Blood Types Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  <Droplets className="w-4 h-4 inline ml-2" />
                  فصائل الدم المطلوبة *
                </label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {bloodTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleBloodTypeToggle(type)}
                      className={`p-3 rounded-lg border-2 font-bold text-lg transition-all ${
                        formData.bloodTypes.includes(type)
                          ? 'bg-red-600 text-white border-red-600 shadow-lg'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  اختر فصيلة واحدة أو أكثر (الفصائل المحددة: {formData.bloodTypes.length})
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  وصف الحملة
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={4}
                  placeholder="أضف وصفاً للحملة والأهداف المرجوة..."
                />
              </div>

              {/* Facilities */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  المرافق والخدمات المتوفرة
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableFacilities.map(facility => (
                    <label
                      key={facility}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.facilities.includes(facility)
                          ? 'bg-green-50 border-green-500'
                          : 'bg-white border-gray-300 hover:border-green-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(facility)}
                        onChange={() => handleFacilityToggle(facility)}
                        className="w-5 h-5 text-green-600 rounded"
                      />
                      <span className="text-gray-900">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">معلومات الاتصال</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      اسم المسؤول *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="اسم منسق الحملة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      رقم الجوال *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="05xxxxxxxx"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-lg py-6 shadow-lg"
                  disabled={formData.bloodTypes.length === 0}
                >
                  <CheckCircle className="w-6 h-6 ml-2" />
                  إنشاء الحملة
                </Button>
                {formData.bloodTypes.length === 0 && (
                  <p className="text-center text-sm text-red-600 mt-2">
                    يرجى اختيار فصيلة دم واحدة على الأقل
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>


      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <Card className="max-w-md w-full animate-bounce-in">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">تم إنشاء الحملة بنجاح! 🎉</h3>
              <p className="text-gray-600 mb-4">
                تم إنشاء حملة "{formData.name}" بنجاح
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  سيتم إشعار {formData.targetDonors} متبرع محتمل عبر:
                </p>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <Badge className="bg-blue-600">إشعارات تطبيق</Badge>
                  <Badge className="bg-green-600">رسائل SMS</Badge>
                  <Badge className="bg-purple-600">بريد إلكتروني</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                جاري تحويلك للوحة التحكم...
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
