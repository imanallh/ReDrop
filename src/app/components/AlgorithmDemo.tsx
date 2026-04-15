import { useState } from 'react';
import { ArrowRight, Zap, Activity, TrendingUp, Heart, Play, RotateCcw, CheckCircle, FileText, Navigation, FileCheck, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface AlgorithmDemoProps {
  onBack: () => void;
}

export default function AlgorithmDemo({ onBack }: AlgorithmDemoProps) {
  const [isAlgorithmRunning, setIsAlgorithmRunning] = useState(false);
  const [showAlgorithmResults, setShowAlgorithmResults] = useState(false);
  const [searchStage, setSearchStage] = useState(0);
  const [donorsFound, setDonorsFound] = useState(0);
  const [currentRadius, setCurrentRadius] = useState(0);

  const handleRunAlgorithm = () => {
    setIsAlgorithmRunning(true);
    setSearchStage(0);
    setDonorsFound(0);
    setCurrentRadius(0);

    // المرحلة 1: البحث في قاعدة البيانات
    setTimeout(() => {
      setSearchStage(1);
      setDonorsFound(1247);
    }, 1500);

    // المرحلة 2: فلترة حسب فصيلة الدم
    setTimeout(() => {
      setSearchStage(2);
      setDonorsFound(89);
    }, 3500);

    // المرحلة 3: فلترة حسب آخر تبرع
    setTimeout(() => {
      setSearchStage(3);
      setDonorsFound(42);
    }, 5500);

    // المرحلة 4: حساب المسافات في دائرة 10 كم
    setTimeout(() => {
      setSearchStage(4);
      setCurrentRadius(10);
      setDonorsFound(3);
    }, 7000);

    // المرحلة 5: التوسع إلى 20 كم
    setTimeout(() => {
      setSearchStage(5);
      setCurrentRadius(20);
      setDonorsFound(8);
    }, 8500);

    // المرحلة 6: اختيار أفضل 5 متبرعين
    setTimeout(() => {
      setSearchStage(6);
      setDonorsFound(5);
    }, 9500);

    // النتيجة النهائية
    setTimeout(() => {
      setIsAlgorithmRunning(false);
      setShowAlgorithmResults(true);
      setSearchStage(0);
      setDonorsFound(0);
      setCurrentRadius(0);
    }, 10000);
  };

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2 mb-6"
          >
            <ArrowRight className="w-4 h-4" />
            رجوع للصفحة الرئيسية
          </Button>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">خوارزمية مطابقة المتبرعين</h2>
            <p className="text-lg text-gray-600">كيف نجد أفضل المتبرعين للحالات العاجلة</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Explanation */}
          <Card>
            <CardHeader>
              <CardTitle>ما هي خوارزمية مطابقة المتبرعين؟</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                نظام ذكي متطور يقوم بالبحث والترشيح التلقائي لأفضل المتبرعين المتاحين لحظة بلحظة،
                مع نظام توسع ديناميكي يبدأ بنطاق 10 كم ثم يتوسع تلقائياً إلى 20 كم ثم 30 كم حتى
                العثور على أفضل 5 متبرعين مؤهلين.
              </p>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card>
            <CardHeader>
              <CardTitle>كيف تشتغل الخوارزمية؟</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  'سحب معلومات الحالة الطارئة (فصيلة الدم، الكمية، الموقع)',
                  'البحث في قاعدة بيانات المتبرعين النشطين',
                  'تطبيق شروط التوافق (فصيلة الدم، آخر تبرع)',
                  'حساب المسافة الجغرافية من موقع المستشفى',
                  'الترتيب حسب الأولوية (المسافة + سرعة الاستجابة)',
                  'إرسال إشعارات فورية لأفضل 5 متبرعين'
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">فوائد الخوارزمية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <Zap className="w-6 h-6" />, title: 'سرعة فائقة', desc: 'نتائج خلال ثوانٍ' },
                { icon: <Activity className="w-6 h-6" />, title: 'دقة عالية', desc: 'مطابقة 100%' },
                { icon: <TrendingUp className="w-6 h-6" />, title: 'توفير الوقت', desc: 'تقليل وقت الانتظار' },
                { icon: <Heart className="w-6 h-6" />, title: 'إنقاذ الأرواح', desc: 'استجابة فورية' }
              ].map((benefit, idx) => (
                <Card key={idx} className="text-center hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      {benefit.icon}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Interactive Simulator */}
          <Card className="border-2 border-red-200">
            <CardHeader className="bg-red-50">
              <div className="flex items-center justify-between">
                <CardTitle>محاكي الخوارزمية التفاعلي</CardTitle>
                <Badge className="bg-green-600">الخوارزمية جاهزة للتشغيل</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Case Card */}
                <div className="p-6 bg-red-50 border-2 border-red-600 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-red-600 text-lg px-4 py-2">حالة حرجة جداً</Badge>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-gray-900">O-</div>
                      <div className="text-sm text-gray-600">فصيلة نادرة</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-red-600">4</div>
                      <div className="text-sm text-gray-600">وحدات مطلوبة</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">45</div>
                      <div className="text-sm text-gray-600">دقيقة متبقية</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">🏥</div>
                      <div className="text-sm text-gray-600">مستشفى الملك فيصل</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">🚨</div>
                      <div className="text-sm text-gray-600">أولوية قصوى</div>
                    </div>
                  </div>
                </div>

                {!isAlgorithmRunning && !showAlgorithmResults && (
                  <Button
                    onClick={handleRunAlgorithm}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6"
                  >
                    <Play className="w-6 h-6 ml-2" />
                    تشغيل الخوارزمية الآن
                  </Button>
                )}

                {isAlgorithmRunning && (
                  <div className="space-y-6">
                    {/* شريط التقدم */}
                    <div className="relative">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                          style={{ width: `${(searchStage / 6) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* عداد المتبرعين */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">المتبرعين المتاحين</p>
                        <p className="text-3xl font-bold text-blue-600">{donorsFound.toLocaleString('ar-SA')}</p>
                      </div>
                      <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">نطاق البحث</p>
                        <p className="text-3xl font-bold text-orange-600">
                          {currentRadius > 0 ? `${currentRadius} كم` : '---'}
                        </p>
                      </div>
                    </div>

                    {/* حالة البحث الحالية */}
                    <div className="text-center py-4">
                      <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        {searchStage === 0 && 'جاري الاتصال بقاعدة البيانات...'}
                        {searchStage === 1 && 'جاري البحث في قاعدة المتبرعين...'}
                        {searchStage === 2 && 'جاري فلترة حسب فصيلة الدم (O-)...'}
                        {searchStage === 3 && 'جاري فلترة حسب آخر تبرع (60 يوم)...'}
                        {searchStage === 4 && '📍 جاري حساب المسافات في دائرة 10 كم...'}
                        {searchStage === 5 && '📍 جاري التوسع إلى 20 كم...'}
                        {searchStage === 6 && '⚡ جاري اختيار أفضل 5 متبرعين...'}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        <p className="text-sm text-gray-600">
                          {searchStage === 0 && 'الاتصال بالسيرفر'}
                          {searchStage === 1 && 'فحص المتبرعين النشطين'}
                          {searchStage === 2 && 'تطبيق الفلتر الأول'}
                          {searchStage === 3 && 'تطبيق الفلتر الثاني'}
                          {searchStage === 4 && 'فحص النطاق الجغرافي'}
                          {searchStage === 5 && 'توسيع نطاق البحث'}
                          {searchStage === 6 && 'إعداد النتائج النهائية'}
                        </p>
                      </div>
                    </div>

                    {/* مراحل الفلترة */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className={`flex items-center gap-3 p-2 rounded ${searchStage >= 2 ? 'bg-green-100' : 'bg-white'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${searchStage >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}>
                          {searchStage >= 2 ? <span className="text-white text-sm">✓</span> : <span className="text-white text-xs">1</span>}
                        </div>
                        <span className="text-sm text-gray-700">فلترة فصيلة الدم</span>
                        {searchStage === 2 && <span className="text-xs text-green-600 font-semibold mr-auto">جاري العمل...</span>}
                      </div>
                      
                      <div className={`flex items-center gap-3 p-2 rounded ${searchStage >= 3 ? 'bg-green-100' : 'bg-white'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${searchStage >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}>
                          {searchStage >= 3 ? <span className="text-white text-sm">✓</span> : <span className="text-white text-xs">2</span>}
                        </div>
                        <span className="text-sm text-gray-700">فلترة آخر تبرع</span>
                        {searchStage === 3 && <span className="text-xs text-green-600 font-semibold mr-auto">جاري العمل...</span>}
                      </div>

                      <div className={`flex items-center gap-3 p-2 rounded ${searchStage >= 4 ? 'bg-green-100' : 'bg-white'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${searchStage >= 4 ? 'bg-green-600' : 'bg-gray-300'}`}>
                          {searchStage >= 4 ? <span className="text-white text-sm">✓</span> : <span className="text-white text-xs">3</span>}
                        </div>
                        <span className="text-sm text-gray-700">حساب المسافات في دائرة 10 كم</span>
                        {searchStage === 4 && <span className="text-xs text-green-600 font-semibold mr-auto">جاري العمل...</span>}
                      </div>

                      <div className={`flex items-center gap-3 p-2 rounded ${searchStage >= 5 ? 'bg-green-100' : 'bg-white'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${searchStage >= 5 ? 'bg-green-600' : 'bg-gray-300'}`}>
                          {searchStage >= 5 ? <span className="text-white text-sm">✓</span> : <span className="text-white text-xs">4</span>}
                        </div>
                        <span className="text-sm text-gray-700">التوسع إلى 20 كم</span>
                        {searchStage === 5 && <span className="text-xs text-green-600 font-semibold mr-auto">جاري العمل...</span>}
                      </div>

                      <div className={`flex items-center gap-3 p-2 rounded ${searchStage >= 6 ? 'bg-green-100' : 'bg-white'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${searchStage >= 6 ? 'bg-green-600' : 'bg-gray-300'}`}>
                          {searchStage >= 6 ? <span className="text-white text-sm">✓</span> : <span className="text-white text-xs">5</span>}
                        </div>
                        <span className="text-sm text-gray-700">اختيار أفضل 5 متبرعين</span>
                        {searchStage === 6 && <span className="text-xs text-green-600 font-semibold mr-auto">جاري العمل...</span>}
                      </div>
                    </div>
                  </div>
                )}

                {showAlgorithmResults && (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                      <h4 className="font-bold text-gray-900 mb-1">تم العثور على 5 متبرعين مؤهلين!</h4>
                      <p className="text-sm text-gray-600">مدة البحث: 2.3 ثانية</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { name: 'أحمد محمد العلي', match: 98, bloodType: 'O-', distance: 3.2, lastDonation: '4 أشهر', status: 'متاح الآن' },
                        { name: 'خالد عبدالله', match: 95, bloodType: 'O-', distance: 5.8, lastDonation: '5 أشهر', status: 'متاح الآن' },
                        { name: 'محمد سعيد', match: 92, bloodType: 'O-', distance: 7.1, lastDonation: '6 أشهر', status: 'متاح الآن' },
                        { name: 'عبدالرحمن أحمد', match: 88, bloodType: 'O-', distance: 9.4, lastDonation: '7 أشهر', status: 'متاح خلال ساعة' },
                        { name: 'فهد محمود', match: 85, bloodType: 'O-', distance: 11.2, lastDonation: '8 أشهر', status: 'متاح خلال ساعتين' }
                      ].map((donor, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
                                  #{idx + 1}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-bold text-gray-900">{donor.name}</h5>
                                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                                    <span>نسبة التطابق: {donor.match}%</span>
                                    <span>• {donor.bloodType}</span>
                                    <span>• {donor.distance} كم</span>
                                    <span>• آخر تبرع: {donor.lastDonation}</span>
                                  </div>
                                  <Badge className="bg-green-600 mt-2">{donor.status}</Badge>
                                </div>
                              </div>
                              <Button className="bg-red-600 hover:bg-red-700">
                                تواصل مع المتبرع
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* البطاقات الجديدة - تظهر بعد المحاكاة */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      {/* بطاقة إصدار تصريح طوارئ */}
                      <Card className="border-2 border-orange-200">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <FileText className="w-5 h-5 text-orange-600" />
                            </div>
                            <h4 className="font-bold text-gray-900">إصدار تصريح طوارئ</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            تصريح يستخدم كإعتراض في حال وجود مخالفة مرورية أثناء التوجه إلى المستشفى
                          </p>
                          <Button className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 mb-2">
                            إصدار التصريح
                          </Button>
                          
                        </CardContent>
                      </Card>

                      {/* بطاقة الاتجاه للمستشفى */}
                      <Card className="border-2 border-blue-200">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Navigation className="w-5 h-5 text-blue-600" />
                            </div>
                            <h4 className="font-bold text-gray-900">التوجه للمستشفى</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">ارسال الموقع والمسار الأقصر للوصول بسرعة للمتبرع                          </p>
                          <Button className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300">
                            فتح الخرائط
                          </Button>
                        </CardContent>
                      </Card>

                      {/* بطاقة إصدار عذر طبي */}
                      <Card className="border-2 border-green-200">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <FileCheck className="w-5 h-5 text-green-600" />
                            </div>
                            <h4 className="font-bold text-gray-900">إصدار عذر طبي</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">وثيقة رسمية تثبت مشاركتك في حالة طارئة                          يتم إصداره تلقائياً بعد إتمام التبرع</p>
                          <Button className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 mb-2">
                            إصدار العذر
                          </Button>
                          <p className="text-xs text-gray-500 text-center"></p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* قسم التتبع المباشر */}
                    <Card className="border-2 border-purple-200 mt-6">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">متابعة التتبع المباشر</h4>
                              <p className="text-sm text-gray-600">عرض حالة المتبرعين أثناء التوجه</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-green-700 font-semibold">✔️ مفعّل</span>
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      onClick={() => {
                        setShowAlgorithmResults(false);
                        setIsAlgorithmRunning(false);
                      }}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      <RotateCcw className="w-5 h-5 ml-2" />
                      إعادة المحاكاة
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}