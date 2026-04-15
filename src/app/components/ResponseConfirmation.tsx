import { ArrowRight, MapPin, Navigation, Car, FileText, CheckCircle, Phone, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Donor, EmergencyCase } from '../App';

interface ResponseConfirmationProps {
  donors: Donor[];
  emergencyCase: EmergencyCase;
  onConfirm: () => void;
  onBack: () => void;
}

export default function ResponseConfirmation({ donors, emergencyCase, onConfirm, onBack }: ResponseConfirmationProps) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للمطابقة
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 bg-green-100 text-green-600 px-6 py-3 rounded-full mb-4">
              <CheckCircle className="w-6 h-6" />
              <span className="text-xl">تأكيد الاستجابة</span>
            </div>
            <p className="text-gray-600">جاري إرسال الطلبات للمتبرعين المحددين</p>
          </div>
        </div>

        {/* Success Message */}
        <Card className="mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl mb-2">تم إرسال الطلبات بنجاح!</h2>
              <p className="text-green-100">
                تم إرسال إشعارات فورية لـ {donors.length} متبرع • متوقع الاستجابة خلال 3-5 دقائق
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Selected Donors */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>المتبرعون المختارون ({donors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {donors.map((donor, index) => (
                <div key={donor.id} className="p-4 bg-gray-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold">{donor.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge className="bg-red-100 text-red-700">{donor.bloodType}</Badge>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {donor.distance.toFixed(1)} كم
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700">
                      ⏳ بانتظار الرد
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="text-sm">
                      <Phone className="w-4 h-4 ml-1" />
                      اتصال
                    </Button>
                    <Button variant="outline" size="sm" className="text-sm">
                      <Navigation className="w-4 h-4 ml-1" />
                      الموقع
                    </Button>
                    <Button variant="outline" size="sm" className="text-sm">
                      <Clock className="w-4 h-4 ml-1" />
                      {Math.floor(donor.distance * 3)} دقيقة
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map Visualization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              خريطة المواقع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg p-8 h-80 flex items-center justify-center relative overflow-hidden">
              {/* Mock map visualization */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>
              
              {/* Hospital */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-bold">{emergencyCase.location}</span>
                </div>
              </div>

              {/* Donors */}
              {donors.map((donor, index) => {
                const angle = (index / donors.length) * 2 * Math.PI;
                const radius = 100;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <div 
                    key={donor.id}
                    className="absolute bg-green-500 text-white px-3 py-1 rounded-full shadow-md text-sm z-10"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {donor.name.split(' ')[0]}
                  </div>
                );
              })}

              {/* Radius circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-64 h-64 border-4 border-dashed border-green-400 rounded-full opacity-50"></div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                <span>المستشفى</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>المتبرعون</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Navigation className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-bold mb-1">اتجه إلى المستشفى</h3>
              <p className="text-sm text-gray-600">إرسال الاتجاهات للمتبرعين</p>
              <Button className="mt-3 w-full bg-blue-600 hover:bg-blue-700">
                🧭 فتح الخرائط
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-bold mb-1">إصدار تصريح طوارئ</h3>
              <p className="text-sm text-gray-600">تصريح رقمي للمهمة الإنسانية</p>
              <Button className="mt-3 w-full bg-orange-600 hover:bg-orange-700">
                🪪 إصدار
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Pass Info */}
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-yellow-900">
                <strong>تصريح الطوارئ الرقمي:</strong> وثيقة رقمية تثبت أن المتبرع في مهمة إنسانية عاجلة. 
                يمكن استخدامه لاحقاً في حال وجود أي مخالفة مرورية أثناء التوجه للمستشفى.
                يشمل: بيانات الحالة، وقت الإصدار، ومعلومات المستشفى.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button
          onClick={onConfirm}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 text-lg"
        >
          ✅ متابعة للتتبع المباشر
        </Button>
      </div>
    </div>
  );
}
