import { useState } from 'react';
import { ArrowRight, Radio, MapPin, Users, Send, CheckCircle2, Activity, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';

interface GeoEmergencyProps {
  onBack: () => void;
  autoTrigger?: {
    bloodType: string;
    fromInventory: boolean;
  };
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function GeoEmergency({ onBack, autoTrigger }: GeoEmergencyProps) {
  const [stage, setStage] = useState<'setup' | 'sending' | 'tracking'>('setup');
  const [radius, setRadius] = useState([30]);
  const [filterMode, setFilterMode] = useState<'all' | 'specific'>('all');
  const [selectedBloodTypes, setSelectedBloodTypes] = useState<string[]>([]);
  const [hospitalName, setHospitalName] = useState('مستشفى الملك فيصل التخصصي');
  const [incidentType, setIncidentType] = useState('حادث سير كبير');
  
  // Tracking stats
  const [sentCount, setSentCount] = useState(0);
  const [openedCount, setOpenedCount] = useState(0);
  const [respondingCount, setRespondingCount] = useState(0);
  const [incomingDonors, setIncomingDonors] = useState<Array<{id: number, distance: number, eta: number}>>([]);

  // Calculate estimated targets based on radius
  const estimatedTargets = Math.floor(radius[0] * 15); // ~15 people per km

  const toggleBloodType = (type: string) => {
    if (selectedBloodTypes.includes(type)) {
      setSelectedBloodTypes(selectedBloodTypes.filter(t => t !== type));
    } else {
      setSelectedBloodTypes([...selectedBloodTypes, type]);
    }
  };

  const handleSendAlert = () => {
    setStage('sending');
    
    // Simulate sending animation
    setTimeout(() => {
      setStage('tracking');
      simulateResponses();
    }, 2000);
  };

  const simulateResponses = () => {
    const total = estimatedTargets;
    setSentCount(total);

    // Simulate opening messages
    setTimeout(() => {
      const opened = Math.floor(total * 0.15); // 15% open rate
      setOpenedCount(opened);
    }, 1000);

    // Simulate responding
    setTimeout(() => {
      const responding = Math.floor(total * 0.05); // 5% response rate
      setRespondingCount(responding);
      
      // Generate incoming donors
      const donors = Array.from({ length: responding }, (_, i) => ({
        id: i + 1,
        distance: Math.random() * radius[0],
        eta: Math.floor(Math.random() * 30) + 10, // 10-40 minutes
      })).sort((a, b) => a.eta - b.eta);
      
      setIncomingDonors(donors);
    }, 2500);
  };

  const getSMSPreview = () => {
    const bloodTypeText = filterMode === 'specific' && selectedBloodTypes.length > 0
      ? `فصيلة (${selectedBloodTypes.join(', ')})`
      : 'جميع الفصائل';
    
    return `🚨 نداء استغاثة عاجل من ${hospitalName}: ${incidentType} يتطلب متبرعين ${bloodTypeText} فوراً. نرجو التوجه لأقرب مركز تبرع. موقعنا: [خرائط جوجل]. ساهم في إنقاذ حياة.`;
  };

  if (stage === 'sending') {
    return (
      <div className="min-h-screen p-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة للرئيسية
        </Button>

        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
          <Card className="max-w-md w-full">
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <div className="relative">
                  <Radio className="w-24 h-24 text-orange-600 mx-auto animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-orange-200 rounded-full animate-ping opacity-20"></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">جاري الإرسال...</h2>
                  <p className="text-gray-600">يتم إرسال النداء إلى {estimatedTargets} متبرع</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span>تقدير وقت الإرسال: 2-3 ثواني</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (stage === 'tracking') {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mb-4"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center gap-2 bg-green-100 text-green-600 px-6 py-3 rounded-full mb-4">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-xl font-bold">تم الإرسال بنجاح</span>
              </div>
              <p className="text-gray-600">متابعة لحظية للاستجابات والمتبرعين القادمين</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
              <CardContent className="p-6 text-center">
                <Send className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">تم الإرسال</p>
                <p className="text-4xl font-bold text-blue-600">{sentCount}</p>
                <p className="text-xs text-gray-500 mt-2">متبرع مسجل</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
              <CardContent className="p-6 text-center">
                <Activity className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">فتحوا الرسالة</p>
                <p className="text-4xl font-bold text-purple-600">{openedCount}</p>
                <p className="text-xs text-gray-500 mt-2">نسبة الفتح {sentCount > 0 ? Math.round((openedCount/sentCount)*100) : 0}%</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-300">
              <CardContent className="p-6 text-center">
                <Navigation className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">في الطريق</p>
                <p className="text-4xl font-bold text-green-600">{respondingCount}</p>
                <p className="text-xs text-gray-500 mt-2">ضغطوا "أنا قادم"</p>
              </CardContent>
            </Card>
          </div>

          {/* Live Map Simulation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                الخريطة الحية - المتبرعين القادمين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 relative overflow-hidden" style={{ height: '400px' }}>
                {/* Hospital Center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 w-16 h-16 bg-red-400 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <p className="text-center mt-2 text-xs font-bold text-gray-700">{hospitalName}</p>
                </div>

                {/* Incoming Donors - Moving dots */}
                {incomingDonors.slice(0, 8).map((donor, index) => {
                  const angle = (index / 8) * 2 * Math.PI;
                  const distance = 120 + (donor.distance / radius[0]) * 80;
                  const x = 50 + Math.cos(angle) * distance;
                  const y = 50 + Math.sin(angle) * distance;
                  
                  return (
                    <div
                      key={donor.id}
                      className="absolute transition-all duration-1000 ease-linear"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        animation: `moveToCenter ${donor.eta}s linear infinite`,
                      }}
                    >
                      <div className="relative">
                        <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                        <div className="absolute -top-8 -right-8 bg-white/90 px-2 py-1 rounded text-xs whitespace-nowrap shadow">
                          <span className="font-bold">{donor.eta} دقيقة</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Radius circles */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-orange-300 rounded-full opacity-30"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-orange-200 rounded-full opacity-20"></div>
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="text-gray-600">المستشفى</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">متبرع قادم</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">نطاق {radius[0]} كم</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incoming Donors List */}
          <Card>
            <CardHeader>
              <CardTitle>قائمة المتبرعين القادمين ({respondingCount})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incomingDonors.slice(0, 10).map((donor) => (
                  <div key={donor.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {donor.id}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">متبرع #{donor.id}</p>
                        <p className="text-sm text-gray-600">{donor.distance.toFixed(1)} كم من المستشفى</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <Badge className="bg-green-600 text-white">
                        <Navigation className="w-3 h-3 ml-1" />
                        {donor.eta} دقيقة
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {incomingDonors.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 animate-pulse" />
                    <p>في انتظار الاستجابات...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Setup Stage
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 bg-orange-100 text-orange-600 px-6 py-3 rounded-full mb-4">
              <Radio className="w-6 h-6" />
              <span className="text-xl font-bold">نداء جغرافي</span>
            </div>
            <p className="text-gray-600">إرسال SMS جماعي لجميع المتبرعين المسجلين في النطاق المحدد</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Incident Info */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الحادث</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>اسم المستشفى</Label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <Label>نوع الحادث</Label>
                <input
                  type="text"
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                  placeholder="مثال: حادث سير كبير، حريق، كارثة طبيعية"
                />
              </div>
            </CardContent>
          </Card>

          {/* Targeting Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                إعدادات الاستهداف الجغرافي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Radius Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label>النطاق الجغرافي (نصف القطر)</Label>
                  <Badge className="bg-orange-600 text-white text-lg px-4">
                    {radius[0]} كم
                  </Badge>
                </div>
                <Slider
                  value={radius}
                  onValueChange={setRadius}
                  min={5}
                  max={50}
                  step={5}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5 كم</span>
                  <span>25 كم</span>
                  <span>50 كم</span>
                </div>
              </div>

              {/* Filter Mode */}
              <div>
                <Label className="mb-3 block">خوارزمية الفرز</Label>
                <RadioGroup value={filterMode} onValueChange={(v) => setFilterMode(v as 'all' | 'specific')}>
                  <div className="flex items-center space-x-2 space-x-reverse p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="flex-1 cursor-pointer">
                      <span className="font-bold">إرسال للجميع</span>
                      <p className="text-sm text-gray-600">جميع المتبرعين بكل الفصائل</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="specific" id="specific" />
                    <Label htmlFor="specific" className="flex-1 cursor-pointer">
                      <span className="font-bold">إرسال حسب الفصيلة</span>
                      <p className="text-sm text-gray-600">فقط المتبرعين بفصائل محددة (أقل إزعاج)</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Blood Type Selection */}
              {filterMode === 'specific' && (
                <div>
                  <Label className="mb-3 block">اختر الفصائل المطلوبة</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {bloodTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleBloodType(type)}
                        className={`p-3 rounded-lg border-2 font-bold transition-all ${
                          selectedBloodTypes.includes(type)
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Estimated Targets */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">عدد المستهدفين</p>
                      <p className="text-3xl font-bold text-orange-600">{estimatedTargets}</p>
                    </div>
                  </div>
                  <div className="text-left text-sm text-gray-600">
                    <p>📱 سيتم تنبيه {estimatedTargets} متبرع</p>
                    <p>📍 ضمن نطاق {radius[0]} كم</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SMS Preview */}
          <Card>
            <CardHeader>
              <CardTitle>معاينة الرسالة النصية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm border-2 border-gray-300">
                {getSMSPreview()}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                ✓ الرسالة تحتوي على: اسم المستشفى، نوع الحادث، الفصائل المطلوبة، رابط خرائط
              </p>
            </CardContent>
          </Card>

          {/* Send Button */}
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">جاهز للإرسال؟</h3>
                <p className="text-orange-100">
                  سيتم إرسال النداء إلى {estimatedTargets} متبرع خلال ثواني
                </p>
                <Button
                  onClick={handleSendAlert}
                  disabled={filterMode === 'specific' && selectedBloodTypes.length === 0}
                  className="bg-white text-orange-600 hover:bg-orange-50 w-full max-w-md mx-auto py-6 text-xl font-bold"
                  size="lg"
                >
                  <Send className="w-6 h-6 ml-2" />
                  إرسال نداء الاستغاثة الآن
                </Button>
                {filterMode === 'specific' && selectedBloodTypes.length === 0 && (
                  <p className="text-sm text-orange-200">⚠️ الرجاء اختيار فصيلة واحدة على الأقل</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes moveToCenter {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(calc(50vw - 50%), calc(50vh - 50%));
          }
        }
      `}</style>
    </div>
  );
}