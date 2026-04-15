import { useState } from 'react';
import { ArrowRight, MapPin, Droplets, Clock, AlertTriangle, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import type { EmergencyCase } from '../App';

interface CreateEmergencyProps {
  onSubmit: (caseData: Omit<EmergencyCase, 'id' | 'status' | 'createdAt'>) => void;
  onBack: () => void;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function CreateEmergency({ onSubmit, onBack }: CreateEmergencyProps) {
  const [bloodType, setBloodType] = useState('');
  const [units, setUnits] = useState('2');
  const [severity, setSeverity] = useState<'critical-high' | 'critical' | 'moderate'>('critical-high');
  const [location, setLocation] = useState('مستشفى الملك فيصل التخصصي - الرياض');
  const [timeNeeded, setTimeNeeded] = useState<'now' | 'within-hour'>('now');
  const [nightMode, setNightMode] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloodType) {
      alert('الرجاء اختيار فصيلة الدم');
      return;
    }
    
    onSubmit({
      bloodType,
      units: parseInt(units),
      severity,
      location,
      timeNeeded,
      nightMode,
    });

    // إظهار رسالة النشر
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 3000);
  };

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'critical-high': return 'bg-red-100 border-red-500 text-red-900';
      case 'critical': return 'bg-orange-100 border-orange-500 text-orange-900';
      case 'moderate': return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للوحة التحكم
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 bg-red-100 text-red-600 px-6 py-3 rounded-full mb-4">
              <AlertTriangle className="w-6 h-6" />
              <span className="text-xl">إنشاء حالة طوارئ جديدة</span>
            </div>
            <p className="text-gray-600">املأ البيانات وسيبدأ النظام بالمطابقة التلقائية فوراً</p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-6 h-6 text-red-600" />
              بيانات الحالة العاجلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Blood Type Selection */}
              <div className="space-y-3">
                <Label className="text-lg">فصيلة الدم المطلوبة *</Label>
                <div className="grid grid-cols-4 gap-3">
                  {bloodTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBloodType(type)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        bloodType === type
                          ? 'bg-red-600 text-white border-red-600 shadow-lg'
                          : 'bg-white border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <Droplets className="w-5 h-5 mx-auto mb-1" />
                      <span className="font-bold">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Units Needed */}
              <div className="space-y-3">
                <Label htmlFor="units" className="text-lg">عدد الوحدات المطلوبة</Label>
                <div className="flex items-center gap-3">
                  <input
                    id="units"
                    type="number"
                    min="1"
                    max="10"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                  <span className="text-gray-600">وحدة</span>
                </div>
              </div>

              {/* Severity Level */}
              <div className="space-y-3">
                <Label className="text-lg">مستوى الخطورة</Label>
                <RadioGroup value={severity} onValueChange={(val) => setSeverity(val as any)}>
                  <div className={`flex items-center space-x-2 space-x-reverse p-4 rounded-lg border-2 ${getSeverityColor('critical-high')}`}>
                    <RadioGroupItem value="critical-high" id="critical-high" />
                    <Label htmlFor="critical-high" className="flex-1 cursor-pointer">
                      <span className="font-bold">حرجة جداً</span>
                      <span className="text-sm block opacity-90">تتطلب تدخل فوري (دقائق)</span>
                    </Label>
                  </div>
                  
                  <div className={`flex items-center space-x-2 space-x-reverse p-4 rounded-lg border-2 ${getSeverityColor('critical')}`}>
                    <RadioGroupItem value="critical" id="critical" />
                    <Label htmlFor="critical" className="flex-1 cursor-pointer">
                      <span className="font-bold">حرجة</span>
                      <span className="text-sm block opacity-90">مطلوب خلال 30 دقيقة</span>
                    </Label>
                  </div>
                  
                  <div className={`flex items-center space-x-2 space-x-reverse p-4 rounded-lg border-2 ${getSeverityColor('moderate')}`}>
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="flex-1 cursor-pointer">
                      <span className="font-bold">متوسطة</span>
                      <span className="text-sm block opacity-90">مطلوب خلال ساعة</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <Label htmlFor="location" className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  موقع المستشفى
                </Label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                />
                <p className="text-sm text-gray-500">📍 يتم اكتشاف الموقع تلقائياً</p>
              </div>

              {/* Time Needed */}
              <div className="space-y-3">
                <Label className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  وقت الحاجة
                </Label>
                <RadioGroup value={timeNeeded} onValueChange={(val) => setTimeNeeded(val as any)}>
                  <div className="flex items-center space-x-2 space-x-reverse p-3 bg-red-50 rounded-lg">
                    <RadioGroupItem value="now" id="now" />
                    <Label htmlFor="now" className="cursor-pointer">الآن (فوري)</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse p-3 bg-gray-50 rounded-lg">
                    <RadioGroupItem value="within-hour" id="within-hour" />
                    <Label htmlFor="within-hour" className="cursor-pointer">خلال ساعة</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Night Mode */}
              <div className="space-y-3">
                <Label className="text-lg flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  تفعيل وضع الطوارئ الليلي
                </Label>
                <div 
                  onClick={() => setNightMode(!nightMode)}
                  className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
                    nightMode 
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-500 shadow-lg' 
                      : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900">مناوبين الليل</p>
                      <p className="text-sm text-gray-600">خوارزمية محسّنة للطوارئ الليلية</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-all ${
                      nightMode ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                        nightMode ? 'right-1' : 'right-7'
                      }`} />
                    </div>
                  </div>
                  
                  {nightMode && (
                    <div className="text-sm text-indigo-800 space-y-1">
                      <p>✓ توسع نطاق أسرع (10→30 كم)</p>
                      <p>✓ أولوية لمتبرعي الطوارئ الليلية</p>
                      <p>✓ إشعارات معززة للمتبرعين</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6 text-lg shadow-xl"
                >
                  نشر الحالة
                </Button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  �� سيبدأ النظام الذكي بالبحث عن المتبرعين فوراً
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-900">
              💡 <strong>كيف يعمل النظام:</strong> بمجرد الضغط على "ابدأ المطابقة"، ستقوم الخوارزمية الذكية بالبحث ضمن دائرة 10 كم عن متبرعين متطابقين. 
              إذا لم يكفِ العدد، يتوسع النظام تلقائياً إلى 20 ثم 30 كم حتى إيجاد أفضل 5 متبرعين.
            </p>
          </CardContent>
        </Card>

        {/* Published Message */}
        {isPublished && (
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <p className="text-sm text-green-900">
                ✅ تم نشر حالة الطوارئ بنجاح. سيتم بدء البحث عن المتبرعين فوراً.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}