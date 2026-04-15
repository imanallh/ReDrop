import { useState, useEffect } from 'react';
import { 
  Heart, Droplets, Award, TrendingUp, Users, Star, LogOut, Bell, 
  MapPin, Clock, AlertCircle, Calendar, User, Phone, Weight, 
  Home, FileText, Activity, MessageCircle, Zap, ChevronDown,
  ChevronUp, Play, RotateCcw, Send, CheckCircle, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import logo from 'figma:asset/07b3c35aee0fd5e080b43ed08377751086215a52.png';
import { ImageWithFallback } from './figma/ImageWithFallback';
import universityLogo from '../../imports/image-1.png';
import type { NafathUserData } from './Login';
import PointsAchievements from './PointsAchievements';

interface DonorDashboardProps {
  onLogout: () => void;
  nafathData?: NafathUserData | null;
}

type PageType = 'home' | 'donate' | 'emergency' | 'campaigns' | 'analyzer' | 'assistant' | 'algorithm' | 'points';

export default function DonorDashboard({ onLogout, nafathData }: DonorDashboardProps) {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedBloodType, setSelectedBloodType] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isAlgorithmRunning, setIsAlgorithmRunning] = useState(false);
  const [showAlgorithmResults, setShowAlgorithmResults] = useState(false);
  const [searchStage, setSearchStage] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [eligibilityResult, setEligibilityResult] = useState<'qualified' | 'not-qualified' | null>(null);
  const [disqualificationReason, setDisqualificationReason] = useState('');
  const [lifesaverActivated, setLifesaverActivated] = useState(false);
  const [lastUpdateDate, setLastUpdateDate] = useState<Date | null>(null);
  const [showActivationSuccess, setShowActivationSuccess] = useState(false);
  const [copiedCaseId, setCopiedCaseId] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const [formData, setFormData] = useState({
    // Step 1: البيانات الأساسية
    name: '',
    age: '',
    gender: '',
    weight: '',
    bloodType: '',

    // Step 2: الحالة الصحية
    hasHeartDisease: false,
    hasDiabetes: false,
    hasBloodPressure: false,
    hasAnemia: false,
    hasOtherChronic: false,
    otherChronicDetails: '',
    takingMedication: '',
    medicationDetails: '',

    // Step 3: السجل الطبي
    previousDonation: '',
    lastDonationDate: '',
    hasHepatitis: false,
    hasHIV: false,
    hasOtherInfectious: false,
    recentSurgery: '',
    dentistVisit: '',

    // Step 4: الوقت والمكان
    center: '',
    date: '',
    agreed: false
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{text: string, from: 'user' | 'bot'}[]>([
    { text: 'مرحباً! أنا المساعد الذكي لمنصة التبرع بالدم. كيف يمكنني مساعدتك؟', from: 'bot' }
  ]);

  // ملء البيانات من نفاذ تلقائياً
  useEffect(() => {
    if (nafathData) {
      setFormData(prev => ({
        ...prev,
        name: nafathData.name,
        id: nafathData.nationalId,
        phone: nafathData.phone,
        age: nafathData.age.toString()
      }));
    }
  }, [nafathData]);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const bloodCompatibility: Record<string, { canDonateTo: string[], canReceiveFrom: string[] }> = {
    'A+': { canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['A+', 'A-', 'O+', 'O-'] },
    'A-': { canDonateTo: ['A+', 'A-', 'AB+', 'AB-'], canReceiveFrom: ['A-', 'O-'] },
    'B+': { canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['B+', 'B-', 'O+', 'O-'] },
    'B-': { canDonateTo: ['B+', 'B-', 'AB+', 'AB-'], canReceiveFrom: ['B-', 'O-'] },
    'AB+': { canDonateTo: ['AB+'], canReceiveFrom: ['الجميع'] },
    'AB-': { canDonateTo: ['AB+', 'AB-'], canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'] },
    'O+': { canDonateTo: ['A+', 'B+', 'AB+', 'O+'], canReceiveFrom: ['O+', 'O-'] },
    'O-': { canDonateTo: ['الجميع'], canReceiveFrom: ['O-'] },
  };

  const emergencyCases = [
    {
      id: 1,
      priority: 'critical-high',
      bloodType: 'O-',
      patient: 'محمد أحمد',
      age: 35,
      hospital: 'مستشفى الملك فيصل',
      city: 'حفر الباطن',
      reason: 'حادث سير - فقدان دم حاد',
      units: 4,
      timeLeft: '30 دقيقة',
      status: 'عالية جداً',
      distance: 2.5
    },
    {
      id: 2,
      priority: 'critical',
      bloodType: 'A+',
      patient: 'فاطمة علي',
      age: 28,
      hospital: 'مستشفى الجامعة',
      city: 'حفر الباطن',
      reason: 'عملية جراحية طارئة',
      units: 3,
      timeLeft: '1 ساعة',
      status: 'عالية',
      distance: 5.3
    },
    {
      id: 3,
      priority: 'moderate',
      bloodType: 'B+',
      patient: 'عبدالله محمود',
      age: 42,
      hospital: 'مستشفى المركز',
      city: 'الدمام',
      reason: 'علاج كيميائي',
      units: 2,
      timeLeft: '3 ساعات',
      status: 'متوسطة',
      distance: 180
    },
    {
      id: 4,
      priority: 'special',
      bloodType: 'AB-',
      patient: 'سارة خالد',
      age: 19,
      hospital: 'مستشفى الأطفال',
      city: 'الرياض',
      reason: 'اضطراب في الدم',
      units: 2,
      timeLeft: '5 ساعات',
      status: 'خاصة',
      distance: 420
    },
    {
      id: 5,
      priority: 'critical',
      bloodType: 'O+',
      patient: 'عمر سعد',
      age: 52,
      hospital: 'مستشفى القطيف المركزي',
      city: 'القطيف',
      reason: 'نزيف داخلي',
      units: 3,
      timeLeft: '2 ساعة',
      status: 'عالية',
      distance: 195
    },
    {
      id: 6,
      priority: 'moderate',
      bloodType: 'A-',
      patient: 'نورة محمد',
      age: 31,
      hospital: 'مستشفى الجبيل العام',
      city: 'الجبيل',
      reason: 'ولادة طارئة',
      units: 2,
      timeLeft: '4 ساعات',
      status: 'متوسطة',
      distance: 210
    }
  ];

  const campaigns = [
    {
      id: 1,
      name: 'حملة الجامعة الشتوية',
      status: 'active',
      date: '15 مارس 2025',
      location: 'جامعة حفر الباطن - القاعة الرئيسية',
      target: 200,
      registered: 127,
      progress: 63.5,
      statusText: 'نشطة'
    },
    {
      id: 2,
      name: 'يوم المتبرع العالمي',
      status: 'upcoming',
      date: '14 يونيو 2025',
      location: 'مركز المؤتمرات',
      target: 300,
      registered: 45,
      progress: 15,
      statusText: 'قريباً'
    },
    {
      id: 3,
      name: 'حملة رمضان الخيرية',
      status: 'planned',
      date: '5 أبريل 2025',
      location: 'مركز الأحياء السكنية',
      target: 150,
      registered: 0,
      progress: 0,
      statusText: 'مخطط لها'
    },
    {
      id: 4,
      name: 'حملة الخريف',
      status: 'completed',
      date: '20 ديسمبر 2024',
      location: 'جامعة حفر الباطن',
      target: 180,
      registered: 180,
      progress: 100,
      statusText: 'مكتملة'
    }
  ];

  const faqs = [
    { q: 'ما هي شروط التبرع بالدم؟', a: 'العمر بين 18-65 سنة، الوزن أكثر من 50 كجم، صحة جيدة، لم تتبرع خلال 3 أشهر الماضية.' },
    { q: 'كم مرة يمكنني التبرع بالدم في السنة؟', a: 'يمكنك التبرع كل 3 أشهر، أي 4 مرات في السنة كحد أقصى.' },
    { q: 'هل التبرع بالدم آمن؟', a: 'نعم، التبرع آمن تماماً. نستخدم أدوات معقمة ومعدات طبية حديثة.' },
    { q: 'ماذا يجب أن أفعل بعد التبرع بالدم؟', a: 'اشرب السوائل، تناول وجبة خفيفة، تجنب الرياضة لمدة 24 ساعة.' }
  ];

  const checkEligibility = () => {
    const age = parseInt(formData.age);
    const weight = parseInt(formData.weight);

    // فحص العمر
    if (age < 18 || age > 65) {
      setDisqualificationReason('العمر يجب أن يكون بين 18-65 سنة');
      return false;
    }

    // فحص الوزن
    if (weight < 50) {
      setDisqualificationReason('الوزن يجب أن يكون أكثر من 50 كجم');
      return false;
    }

    // فحص الأمراض المزمنة
    if (formData.hasHeartDisease) {
      setDisqualificationReason('لا يمكن التبرع لمن يعاني من أمراض القلب');
      return false;
    }

    if (formData.hasAnemia) {
      setDisqualificationReason('لا يمكن التبرع لمن يعاني من فقر الدم');
      return false;
    }

    // فحص الأمراض المعدية
    if (formData.hasHepatitis || formData.hasHIV) {
      setDisqualificationReason('لا يمكن التبرع لمن يعاني من أمراض معدية');
      return false;
    }

    // فحص العمليات الجراحية
    if (formData.recentSurgery === 'yes') {
      setDisqualificationReason('لا يمكن التبرع بعد عملية جراحية حديثة');
      return false;
    }

    // فحص زيارة طبيب الأسنان
    if (formData.dentistVisit === 'yes') {
      setDisqualificationReason('يجب الانتظار أسبوع بعد زيارة طبيب الأسنان');
      return false;
    }

    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isEligible = checkEligibility();

    if (isEligible) {
      setEligibilityResult('qualified');
      setLastUpdateDate(new Date());
    } else {
      setEligibilityResult('not-qualified');
    }
  };

  const isDataUpToDate = () => {
    if (!lastUpdateDate) return false;
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return lastUpdateDate > threeMonthsAgo;
  };

  const handleActivateLifesaver = () => {
    setLifesaverActivated(true);
    setShowActivationSuccess(true);
    setTimeout(() => {
      setShowActivationSuccess(false);
    }, 5000);
  };

  const handleShareCase = (caseItem: typeof emergencyCases[0]) => {
    const caseText = `
🚨 حالة طارئة - ${caseItem.status}

المريض: ${caseItem.patient} (${caseItem.age} سنة)
فصيلة الدم المطلوبة: ${caseItem.bloodType}
الكمية: ${caseItem.units} وحدات
المستشفى: ${caseItem.hospital}
السبب: ${caseItem.reason}
الوقت المتبقي: ${caseItem.timeLeft}

منصة التبرع بالدم - جامعة حفر الباطن
    `.trim();

    navigator.clipboard.writeText(caseText);
    setCopiedCaseId(caseItem.id);
    setTimeout(() => {
      setCopiedCaseId(null);
    }, 3000);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleResetForm = () => {
    setCurrentStep(1);
    setEligibilityResult(null);
    setDisqualificationReason('');
    setFormData({
      name: '',
      age: '',
      gender: '',
      weight: '',
      bloodType: '',
      hasHeartDisease: false,
      hasDiabetes: false,
      hasBloodPressure: false,
      hasAnemia: false,
      hasOtherChronic: false,
      otherChronicDetails: '',
      takingMedication: '',
      medicationDetails: '',
      previousDonation: '',
      lastDonationDate: '',
      hasHepatitis: false,
      hasHIV: false,
      hasOtherInfectious: false,
      recentSurgery: '',
      dentistVisit: '',
      center: '',
      date: '',
      agreed: false
    });
  };

  const handleRunAlgorithm = () => {
    setIsAlgorithmRunning(true);
    setSearchStage(0);

    // المرحلة 1: البحث في قاعدة البيانات
    setTimeout(() => setSearchStage(1), 800);

    // المرحلة 2: فلترة حسب فصيلة الدم
    setTimeout(() => setSearchStage(2), 1600);

    // المرحلة 3: حساب المسافات
    setTimeout(() => setSearchStage(3), 2400);

    // النتيجة النهائية
    setTimeout(() => {
      setIsAlgorithmRunning(false);
      setShowAlgorithmResults(true);
      setSearchStage(0);
    }, 3200);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    setChatMessages([...chatMessages, { text: chatMessage, from: 'user' }]);
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        text: 'شكراً لسؤالك! فريق الدعم سيتواصل معك قريباً للإجابة على استفساراتك.', 
        from: 'bot' 
      }]);
    }, 1000);
    
    setChatMessage('');
  };

  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderHeader = () => (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="RedDrop Logo" className="w-12 h-12 object-contain rounded-[15px]" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">منصة التبرع بالدم</h1>
              <p className="text-sm text-gray-600">جامعة حفر الباطن</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {currentPage !== 'home' && (
              <Button 
                variant="outline" 
                onClick={() => navigateToPage('home')}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                الرئيسية
              </Button>
            )}
            <div className="hidden md:flex items-center">
              <img src={universityLogo} alt="University Logo" className="h-12 object-contain rounded-[15px]" />
            </div>
            <Button variant="outline" onClick={onLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              خروج
            </Button>
          </div>
        </div>
      </div>
    </header>
  );

  const renderFooter = () => (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-right">
            <img src={logo} alt="RedDrop Logo" className="w-16 h-16 object-contain mx-auto md:mx-0 mb-4 rounded-[15px]" />
            <h3 className="text-xl font-bold mb-2">منصة التبرع بالدم</h3>
            <p className="text-gray-400 text-sm">جامعة حفر الباطن</p>
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold mb-3">Supporting Community Health</h4>
            <p className="text-gray-400 text-sm">University of Hafr Al-Batin</p>
          </div>
          
          <div className="text-center md:text-left">
            
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">
            © 2024 جامعة حفر الباطن - منصة التبرع بالدم
          </p>
          <p className="text-gray-500 text-sm">
            دعم صحة المجتمع وإنقاذ الأرواح معاً
          </p>
        </div>
      </div>
    </footer>
  );

  const renderHomePage = () => (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              كل قطرة دم تُحدث فرقاً حقيقياً!
            </h2>
            <p className="text-xl text-gray-600 mb-8">تبرعك اليوم قد ينقذ حياة</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-red-200">
              <CardContent className="p-6 text-center">
                <div className="text-5xl font-bold text-red-600 mb-2">3</div>
                <p className="text-gray-700">أرواح تُنقذ</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-red-200">
              <CardContent className="p-6 text-center">
                <div className="text-5xl font-bold text-red-600 mb-2">15</div>
                <p className="text-gray-700">دقيقة فقط</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-red-200">
              <CardContent className="p-6 text-center">
                <div className="text-5xl font-bold text-red-600 mb-2">100%</div>
                <p className="text-gray-700">آمن ومعقم</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6"
              onClick={() => {
                const servicesSection = document.getElementById('services-section');
                servicesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              ابدأ التبرع الآن ⬇️
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">استكشف خدماتنا</h2>
            <p className="text-lg text-gray-600">اختر الخدمة التي تناسبك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Droplets className="w-10 h-10" />, title: 'تبرع بالدم', desc: 'احجز موعدك للتبرع بالدم', page: 'donate' as PageType, color: 'red' },
              { icon: <AlertCircle className="w-10 h-10" />, title: 'حالات طارئة', desc: 'استجب لطلبات الطوارئ', page: 'emergency' as PageType, color: 'red' },
              { icon: <Users className="w-10 h-10" />, title: 'الحملات المجتمعية', desc: 'انضم للحملات القادمة', page: 'campaigns' as PageType, color: 'red' },
              { icon: <Activity className="w-10 h-10" />, title: 'تحليل فصائل الدم', desc: 'تعرف على توافق فصيلة دمك', page: 'analyzer' as PageType, color: 'red' },
              { icon: <MessageCircle className="w-10 h-10" />, title: 'المساعد الذكي', desc: 'اسأل واحصل على إجابات', page: 'assistant' as PageType, color: 'red' },
              { icon: <Award className="w-10 h-10" />, title: 'النقاط والإنجازات', desc: 'تابع نقاطك واحصل على الوسام', page: 'points' as PageType, color: 'red' }
            ].map((service, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-all cursor-pointer border-gray-200"
                onClick={() => navigateToPage(service.page)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    service.color === 'red' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.desc}</p>
                  <Button className={service.color === 'red' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}>
                    اضغط هنا
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const renderDonatePage = () => {
    // إذا تم الإرسال، اعرض شاشة النتيجة
    if (eligibilityResult) {
      return (
        <section className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-2xl mx-auto px-6">
            <Card className="border-2">
              <CardContent className="p-8 text-center">
                {eligibilityResult === 'qualified' ? (
                  <>
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold text-green-600 mb-4">أنت مؤهل للتبرع</h2>
                    <p className="text-gray-700 mb-6">
                      تهانينا! جميع معلوماتك تشير إلى أنك مؤهل للتبرع بالدم. سيتم التواصل معك قريباً لتأكيد موعد التبرع.
                    </p>

                    {/* قسم تفعيل المتبرع المنقذ */}
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-6 text-right">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">تفعيل المتبرع المنقذ</h3>
                      <p className="text-gray-700 mb-4">
                        فعّل هذا الخيار لتكون متاحًا للحالات الطارئة القريبة منك والمساهمة في إنقاذ الأرواح بشكل فوري.
                      </p>

                      {showActivationSuccess && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-green-900">تم تفعيل وضع المتبرع المنقذ بنجاح</p>
                              <p className="text-sm text-green-700">أنت الآن متاح للاستجابة للحالات الطارئة عند الحاجة.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                        <p className="font-semibold text-gray-900 mb-2">شرط التفعيل:</p>
                        <p className="text-sm text-gray-700 mb-3">
                          لا يمكن تفعيل وضع المتبرع المنقذ إلا بعد التأكد من تحديث بياناتك الصحية.
                        </p>
                        <p className="font-semibold text-gray-900 mb-2">شروط القبول:</p>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">•</span>
                            <span>أن تكون البيانات الصحية محدثة خلال آخر 3 أشهر</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">•</span>
                            <span>أن تكون الحالة الصحية الحالية سليمة</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">•</span>
                            <span>عدم وجود أعراض مرضية أو مانع مؤقت للتبرع</span>
                          </li>
                        </ul>
                      </div>

                      {!isDataUpToDate() && !lifesaverActivated && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-yellow-900">بياناتك الصحية غير محدثة</p>
                              <p className="text-sm text-yellow-700">يرجى تحديث الاستبيان أولًا لتتمكن من تفعيل وضع المتبرع المنقذ.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {isDataUpToDate() && !lifesaverActivated ? (
                        <Button
                          onClick={handleActivateLifesaver}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 mb-3"
                        >
                          <Heart className="w-5 h-5 ml-2" />
                          تفعيل المتبرع المنقذ
                        </Button>
                      ) : !lifesaverActivated ? (
                        <Button
                          onClick={handleResetForm}
                          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-4 mb-3"
                        >
                          تحديث البيانات
                        </Button>
                      ) : null}

                      <p className="text-xs text-gray-500 text-center">
                        قد يتم إشعارك في أي وقت عند وجود حالة طارئة قريبة تحتاج إلى تبرع عاجل.
                      </p>
                    </div>

                    <Button
                      onClick={() => navigateToPage('home')}
                      variant="outline"
                      className="w-full py-6"
                    >
                      العودة للرئيسية
                    </Button>

                    <Button
                      onClick={() => navigateToPage('medical-excuse')}
                      className="w-full py-6 bg-white text-red-600 hover:bg-red-50 border-2 border-red-600 mt-4"
                    >
                      إصدار عذر طبي
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold text-red-600 mb-4">غير مؤهل حالياً</h2>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <p className="text-gray-900 font-semibold mb-2">السبب:</p>
                      <p className="text-gray-700">{disqualificationReason}</p>
                    </div>
                    <p className="text-gray-600 mb-6">
                      نشكر لك اهتمامك بالتبرع بالدم. يمكنك التواصل مع المستشفى للمزيد من التفاصيل.
                    </p>
                    <div className="space-y-3">
                      <Button
                        onClick={handleResetForm}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-6"
                      >
                        إعادة المحاولة
                      </Button>
                      <Button
                        onClick={() => navigateToPage('home')}
                        variant="outline"
                        className="w-full py-6"
                      >
                        العودة للرئيسية
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      );
    }

    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">الخطوة {currentStep} من 4</span>
              <span className="text-sm text-gray-600">{currentStep * 25}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-red-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${currentStep * 25}%` }}
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              {/* Step 1: البيانات الأساسية */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">البيانات الأساسية</h2>
                    <p className="text-gray-600">أدخل معلوماتك الشخصية الأساسية</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم (اختياري)</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">العمر *</label>
                    <input
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">الجنس *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, gender: 'male'})}
                        className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                          formData.gender === 'male'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                      >
                        ذكر
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, gender: 'female'})}
                        className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                          formData.gender === 'female'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                      >
                        أنثى
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">الوزن (كجم) *</label>
                    <input
                      type="number"
                      required
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">فصيلة الدم *</label>
                    <select
                      required
                      value={formData.bloodType}
                      onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">اختر فصيلة الدم</option>
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <Button
                    onClick={handleNextStep}
                    disabled={!formData.age || !formData.gender || !formData.weight || !formData.bloodType}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
                  >
                    التالي
                  </Button>
                </div>
              )}

              {/* Step 2: الحالة الصحية */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">الحالة الصحية</h2>
                    <p className="text-gray-600">معلومات عن حالتك الصحية والأدوية</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">هل تعاني من أي من الأمراض التالية؟</label>

                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        hasHeartDisease: false,
                        hasDiabetes: false,
                        hasBloodPressure: false,
                        hasAnemia: false,
                        hasOtherChronic: false,
                        otherChronicDetails: ''
                      })}
                      className={`w-full p-4 border-2 rounded-lg font-semibold transition-all ${
                        !formData.hasHeartDisease && !formData.hasDiabetes && !formData.hasBloodPressure && !formData.hasAnemia && !formData.hasOtherChronic
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-green-400'
                      }`}
                    >
                      لا أعاني من أي من هذه الأمراض
                    </button>

                    <div className="text-center text-gray-500 text-sm">أو حدد من القائمة:</div>

                    {[
                      { key: 'hasHeartDisease', label: 'أمراض القلب' },
                      { key: 'hasDiabetes', label: 'السكري' },
                      { key: 'hasBloodPressure', label: 'ضغط الدم' },
                      { key: 'hasAnemia', label: 'فقر الدم (أنيميا)' },
                      { key: 'hasOtherChronic', label: 'أمراض مزمنة أخرى' }
                    ].map(disease => (
                      <label key={disease.key} className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[disease.key as keyof typeof formData] as boolean}
                          onChange={(e) => setFormData({...formData, [disease.key]: e.target.checked})}
                          className="w-5 h-5 text-red-600 rounded"
                        />
                        <span className="font-medium text-gray-700">{disease.label}</span>
                      </label>
                    ))}
                  </div>

                  {formData.hasOtherChronic && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">حدد الأمراض الأخرى</label>
                      <textarea
                        value={formData.otherChronicDetails}
                        onChange={(e) => setFormData({...formData, otherChronicDetails: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                        placeholder="اذكر الأمراض..."
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">هل تتناول أدوية حالياً؟</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, takingMedication: 'yes'})}
                        className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                          formData.takingMedication === 'yes'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                      >
                        نعم
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, takingMedication: 'no'})}
                        className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                          formData.takingMedication === 'no'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                      >
                        لا
                      </button>
                    </div>
                  </div>

                  {formData.takingMedication === 'yes' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">حدد الأدوية</label>
                      <textarea
                        value={formData.medicationDetails}
                        onChange={(e) => setFormData({...formData, medicationDetails: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                        placeholder="اذكر الأدوية التي تتناولها..."
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handlePreviousStep}
                      variant="outline"
                      className="flex-1 py-6 text-lg"
                    >
                      السابق
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={!formData.takingMedication}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: السجل الطبي */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">السجل الطبي</h2>
                    <p className="text-gray-600">معلومات عن تاريخك الطبي</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">هل تبرعت بالدم من قبل؟</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, previousDonation: 'yes'})}
                        className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                          formData.previousDonation === 'yes'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                      >
                        نعم
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, previousDonation: 'no'})}
                        className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                          formData.previousDonation === 'no'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                      >
                        لا
                      </button>
                    </div>
                  </div>

                  {formData.previousDonation === 'yes' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">متى آخر مرة تبرعت؟</label>
                      <input
                        type="date"
                        value={formData.lastDonationDate}
                        onChange={(e) => setFormData({...formData, lastDonationDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">هل تعاني من أي من الأمراض المعدية التالية؟</label>

                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        hasHepatitis: false,
                        hasHIV: false,
                        hasOtherInfectious: false
                      })}
                      className={`w-full p-4 border-2 rounded-lg font-semibold transition-all ${
                        !formData.hasHepatitis && !formData.hasHIV && !formData.hasOtherInfectious
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-green-400'
                      }`}
                    >
                      لا أعاني من أي من هذه الأمراض
                    </button>

                    <div className="text-center text-gray-500 text-sm">أو حدد من القائمة:</div>

                    {[
                      { key: 'hasHepatitis', label: 'التهاب الكبد B أو C' },
                      { key: 'hasHIV', label: 'HIV' },
                      { key: 'hasOtherInfectious', label: 'أخرى' }
                    ].map(disease => (
                      <label key={disease.key} className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[disease.key as keyof typeof formData] as boolean}
                          onChange={(e) => setFormData({...formData, [disease.key]: e.target.checked})}
                          className="w-5 h-5 text-red-600 rounded"
                        />
                        <span className="font-medium text-gray-700">{disease.label}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">عملية جراحية مؤخراً؟</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, recentSurgery: 'yes'})}
                        className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                          formData.recentSurgery === 'yes'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                      >
                        نعم
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, recentSurgery: 'no'})}
                        className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                          formData.recentSurgery === 'no'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                      >
                        لا
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">زيارة طبيب أسنان خلال آخر أسبوع؟</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, dentistVisit: 'yes'})}
                        className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                          formData.dentistVisit === 'yes'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                      >
                        نعم
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, dentistVisit: 'no'})}
                        className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                          formData.dentistVisit === 'no'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                      >
                        لا
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handlePreviousStep}
                      variant="outline"
                      className="flex-1 py-6 text-lg"
                    >
                      السابق
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={!formData.previousDonation || !formData.recentSurgery || !formData.dentistVisit}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: التأكيد والموافقة */}
              {currentStep === 4 && (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">الموافقة</h2>
                    <p className="text-gray-600">اختر الوقت والمكان وأكد موافقتك</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">المركز المفضل *</label>
                    <select
                      required
                      value={formData.center}
                      onChange={(e) => setFormData({...formData, center: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">اختر المركز</option>
                      <option value="center1">مستشفى الملك فيصل (متاح)</option>
                      <option value="center2">مستشفى الجامعة (انتظار 15 دقيقة)</option>
                      <option value="center3">مستشفى المركز (متاح)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">الموعد المفضل *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      أقر بأن جميع المعلومات المدخلة صحيحة وأوافق على التبرع بالدم وفق الشروط الصحية
                    </p>
                  </div>

                  <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreed}
                      onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                      className="mt-1 w-5 h-5 text-red-600 rounded"
                    />
                    <span className="font-medium text-gray-700">أوافق</span>
                  </label>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={handlePreviousStep}
                      variant="outline"
                      className="flex-1 py-6 text-lg"
                    >
                      السابق
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
                    >
                      إرسال
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  };

  const renderEmergencyPage = () => {
    const cities = ['all', ...Array.from(new Set(emergencyCases.map(c => c.city)))];

    const filteredCases = selectedCity === 'all'
      ? emergencyCases
      : emergencyCases.filter(c => c.city === selectedCity);

    const sortedCases = [...filteredCases].sort((a, b) => a.distance - b.distance);

    return (
      <section className="py-16 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => navigateToPage('home')}
              className="gap-2 mb-6"
            >
              <ArrowRight className="w-4 h-4" />
              رجوع للصفحة الرئيسية
            </Button>
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">الحالات الطارئة</h2>
              <p className="text-lg text-gray-600">استجب للحالات العاجلة وساهم في إنقاذ الأرواح</p>
            </div>

            {/* قسم الفلترة */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-gray-900">الفلترة:</span>
                  </div>

                  <div className="flex-1 flex flex-wrap gap-2">
                    {cities.map(city => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedCity === city
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {city === 'all' ? 'جميع المدن' : city}
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={handleGetLocation}
                    variant="outline"
                    className="gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    {userLocation ? 'تم تحديد الموقع' : 'تحديد الموقع'}
                  </Button>
                </div>

                {userLocation && (
                  <div className="mt-3 text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>يتم عرض الحالات مرتبة من الأقرب إليك</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedCases.map(caseItem => (
            <Card 
              key={caseItem.id} 
              className={`border-r-4 ${
                caseItem.priority === 'critical-high' ? 'border-red-600 bg-red-50' :
                caseItem.priority === 'critical' ? 'border-orange-500 bg-orange-50' :
                caseItem.priority === 'moderate' ? 'border-yellow-500 bg-yellow-50' :
                'border-purple-500 bg-purple-50'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge className={
                    caseItem.priority === 'critical-high' ? 'bg-red-600' :
                    caseItem.priority === 'critical' ? 'bg-orange-600' :
                    caseItem.priority === 'moderate' ? 'bg-yellow-600' :
                    'bg-purple-600'
                  }>
                    {caseItem.priority === 'critical-high' ? '🚨 عالية جداً' :
                     caseItem.priority === 'critical' ? '⚠️ عالية' :
                     caseItem.priority === 'moderate' ? '📌 متوسطة' :
                     '💜 خاصة'}
                  </Badge>
                  <div className="text-left">
                    <div className="text-4xl font-bold text-gray-900">{caseItem.bloodType}</div>
                    <div className="text-sm text-gray-600">مطلوب</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{caseItem.patient} ({caseItem.age} سنة)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{caseItem.hospital} - {caseItem.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      المسافة: {caseItem.distance < 10 ? `${caseItem.distance} كم` : `${caseItem.distance} كم`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">{caseItem.reason}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Droplets className="w-4 h-4" />
                    <span className="text-sm font-semibold">{caseItem.units} وحدات</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-semibold">الوقت المتبقي: {caseItem.timeLeft}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    استجب للحالة الآن
                  </Button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => handleShareCase(caseItem)}
                      className="w-full text-center text-blue-600 hover:text-blue-700 underline text-sm font-medium"
                    >
                      نشر الحالة
                    </button>
                    {copiedCaseId === caseItem.id && (
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap">
                        تم نسخ الحالة
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
    );
  };

  const renderCampaignsPage = () => {
    const cities = ['all', 'حفر الباطن', 'الدمام', 'الرياض', 'جدة'];

    return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigateToPage('home')}
            className="gap-2 mb-6"
          >
            <ArrowRight className="w-4 h-4" />
            رجوع للصفحة الرئيسية
          </Button>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">الحملات المجتمعية</h2>
            <p className="text-lg text-gray-600">انضم إلى الحملات وكن جزءاً من المجتمع</p>
          </div>
        </div>

        {/* Filter Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-gray-900">الفلترة:</span>
              </div>

              <div className="flex-1 flex flex-wrap gap-2">
                {cities.map(city => (
                  <button
                    key={city}
                    className="px-4 py-2 rounded-lg font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    {city === 'all' ? 'جميع المدن' : city}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                تحديد الموقع
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map(campaign => (
            <Card key={campaign.id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{campaign.name}</h3>
                  <Badge className={
                    campaign.status === 'active' ? 'bg-green-600' :
                    campaign.status === 'upcoming' ? 'bg-blue-600' :
                    campaign.status === 'planned' ? 'bg-yellow-600' :
                    'bg-gray-600'
                  }>
                    {campaign.statusText}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{campaign.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{campaign.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">الهدف: {campaign.target} متبرع</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">المسجلين: {campaign.registered}/{campaign.target}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">التقدم</span>
                    <span className="text-sm font-bold text-gray-900">{campaign.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-red-600 h-3 rounded-full transition-all"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                </div>

                <Button 
                  className={
                    campaign.status === 'active' ? 'w-full bg-red-600 hover:bg-red-700' :
                    campaign.status === 'upcoming' ? 'w-full bg-blue-600 hover:bg-blue-700' :
                    campaign.status === 'planned' ? 'w-full bg-yellow-600 hover:bg-yellow-700' :
                    'w-full bg-gray-400'
                  }
                  disabled={campaign.status === 'completed'}
                >
                  {campaign.status === 'active' ? 'انضم للحملة' :
                   campaign.status === 'upcoming' ? 'سجل اهتمامك' :
                   campaign.status === 'planned' ? 'احجز مكانك' :
                   'الحملة مكتملة'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
    );
  };

  const renderAnalyzerPage = () => (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigateToPage('home')}
            className="gap-2 mb-6"
          >
            <ArrowRight className="w-4 h-4" />
            رجوع للصفحة الرئيسية
          </Button>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">تحليل فصائل الدم</h2>
            <p className="text-lg text-gray-600">اكتشف توافق فصيلة دمك مع الآخرين</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">اختر فصيلة الدم</h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {bloodTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedBloodType(type)}
                      className={`p-4 rounded-lg border-2 font-bold text-lg transition-all ${
                        selectedBloodType === type
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {selectedBloodType && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-green-600" />
                        يمكنك التبرع لـ
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {bloodCompatibility[selectedBloodType].canDonateTo.map(type => (
                          <Badge key={type} className="bg-green-600">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-blue-600" />
                        يمكنك الاستقبال من
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {bloodCompatibility[selectedBloodType].canReceiveFrom.map(type => (
                          <Badge key={type} className="bg-blue-600">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <h4 className="font-semibold text-gray-900 mb-3">جدول التوافق الكامل</h4>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-3 text-right">فصيلة الدم</th>
                          <th className="border border-gray-300 p-3 text-right">يتبرع لـ</th>
                          <th className="border border-gray-300 p-3 text-right">يستقبل من</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bloodTypes.map(type => (
                          <tr 
                            key={type} 
                            className={selectedBloodType === type ? 'bg-red-50' : 'bg-white'}
                          >
                            <td className="border border-gray-300 p-3 font-bold">{type}</td>
                            <td className="border border-gray-300 p-3 text-sm">
                              {bloodCompatibility[type].canDonateTo.join(', ')}
                            </td>
                            <td className="border border-gray-300 p-3 text-sm">
                              {bloodCompatibility[type].canReceiveFrom.join(', ')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );

  const renderAssistantPage = () => (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigateToPage('home')}
            className="gap-2 mb-6"
          >
            <ArrowRight className="w-4 h-4" />
            رجوع للصفحة الرئيسية
          </Button>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">المساعد الذكي</h2>
            <p className="text-lg text-gray-600">اسأل واحصل على إجابات فورية</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6 h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md p-4 rounded-lg ${
                      msg.from === 'user' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">أسئلة شائعة</h4>
              <div className="flex flex-wrap gap-2">
                {faqs.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setChatMessages([...chatMessages, 
                        { text: faq.q, from: 'user' },
                        { text: faq.a, from: 'bot' }
                      ]);
                    }}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-all"
                  >
                    {faq.q}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <Button type="submit" className="bg-red-600 hover:bg-red-700 px-6">
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );

  const renderAlgorithmPage = () => (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigateToPage('home')}
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
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-900">
                      {searchStage === 0 && 'جاري الاتصال بقاعدة البيانات...'}
                      {searchStage === 1 && 'جاري البحث في قاعدة المتبرعين...'}
                      {searchStage === 2 && 'جاري الفلترة حسب فصيلة الدم...'}
                      {searchStage === 3 && 'جاري حساب المسافات والأولويات...'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {searchStage === 0 && 'الاتصال بالسيرفر'}
                      {searchStage === 1 && 'فحص المتبرعين النشطين'}
                      {searchStage === 2 && 'تطبيق معايير التوافق'}
                      {searchStage === 3 && 'ترتيب النتائج حسب القرب'}
                    </p>
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

                    <Button 
                      onClick={() => {
                        setShowAlgorithmResults(false);
                        setIsAlgorithmRunning(false);
                      }}
                      variant="outline"
                      className="w-full"
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

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {renderHeader()}
      
      {currentPage === 'home' && renderHomePage()}
      {currentPage === 'donate' && renderDonatePage()}
      {currentPage === 'emergency' && renderEmergencyPage()}
      {currentPage === 'campaigns' && renderCampaignsPage()}
      {currentPage === 'analyzer' && renderAnalyzerPage()}
      {currentPage === 'assistant' && renderAssistantPage()}
      {currentPage === 'algorithm' && renderAlgorithmPage()}
      {currentPage === 'points' && <PointsAchievements onBack={() => setCurrentPage('home')} />}

      {renderFooter()}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">تم تأكيد الحجز بنجاح!</h3>
              <p className="text-gray-600 mb-6">
                شكراً لك على تبرعك النبيل. سيتم التواصل معك قريباً لتأكيد موعد التبرع.
              </p>
              <Button 
                onClick={() => setShowSuccessModal(false)}
                className="bg-red-600 hover:bg-red-700 w-full"
              >
                إغلاق
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
