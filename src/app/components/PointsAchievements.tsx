import { useState } from 'react';
import { Star, Trophy, ArrowRight, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface PointsAchievementsProps {
  onBack: () => void;
}

export default function PointsAchievements({ onBack }: PointsAchievementsProps) {
  const [currentPoints] = useState(12500);
  const [totalDonations] = useState(7);
  
  // شرط الحصول على وسام الملك عبدالعزيز
  const requiredDonations = 10;
  const remainingDonations = requiredDonations - totalDonations;
  const donationProgress = (totalDonations / requiredDonations) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
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
            <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-600 px-6 py-3 rounded-full mb-4">
              <Trophy className="w-6 h-6" />
              <span className="text-2xl font-bold">النقاط والإنجازات</span>
            </div>
          </div>
        </div>

        {/* قسم النقاط */}
        <Card className="border-2 border-orange-200 shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              نقاطي
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600 mb-6">
              رصيدك الحالي من النقاط التي حصلت عليها مقابل تبرعاتك ومساهماتك الإنسانية
            </p>
            
            <div className="text-center bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl p-8 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-10 h-10 text-orange-600" />
                <span className="text-6xl font-bold text-orange-600">
                  {currentPoints.toLocaleString('ar-SA')}
                </span>
              </div>
              <p className="text-orange-700 text-xl font-semibold">نقطة</p>
            </div>

            {/* ماذا تستفيد من النقاط */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5 mb-4">
              <h4 className="text-lg font-bold text-blue-900 mb-3">
                ماذا تستفيد من النقاط؟
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-700 flex-1">
                    كل عملية تبرع ناجحة تمنحك نقاطًا إضافية
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-700 flex-1">
                    المشاركة في حالات الطوارئ تمنحك نقاطًا أعلى
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-700 flex-1">
                    تقدير مساهماتك الإنسانية في إنقاذ الأرواح
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* قسم وسام الملك عبدالعزيز */}
        <Card className="border-4 border-yellow-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
            <CardTitle className="flex items-center gap-4 text-2xl">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900">وسام الملك عبدالعزيز</h2>
                <p className="text-gray-600 text-base font-normal mt-1">
                  وسام وطني يُمنح للمتبرعين المنتظمين بالدم تقديرًا لعطائهم الإنساني ومساهمتهم في إنقاذ الأرواح
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* التقدم نحو الوسام */}
            <div className="space-y-6">
              {/* شريط التقدم */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-gray-800">التقدم نحو الوسام</span>
                  <span className="text-2xl font-bold text-yellow-600">
                    {totalDonations} / {requiredDonations}
                  </span>
                </div>
                <Progress 
                  value={donationProgress} 
                  className="h-4 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-yellow-600" 
                />
                <p className="text-center mt-2 text-gray-600">
                  أتممت {totalDonations} تبرعات من أصل {requiredDonations} تبرعات مطلوبة
                </p>
              </div>

              {/* كم متبقي */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
                {remainingDonations > 0 ? (
                  <>
                    <p className="text-gray-600 mb-2">المتبقي للحصول على الوسام:</p>
                    <p className="text-5xl font-bold text-yellow-600 mb-1">
                      {remainingDonations}
                    </p>
                    <p className="text-yellow-700 text-xl font-semibold mb-4">
                      {remainingDonations === 1 ? 'تبرع واحد' : `تبرعات`}
                    </p>
                    <p className="text-gray-600">
                      استمر في التبرع للوصول إلى هذا الإنجاز العظيم
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl">
                      <Crown className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-yellow-600 mb-2">
                      تهانينا! لقد حصلت على وسام الملك عبدالعزيز
                    </h3>
                    <p className="text-gray-700 text-lg">
                      شكرًا لعطائك المستمر ومساهمتك في خدمة المجتمع
                    </p>
                  </>
                )}
              </div>

              {/* شرط الحصول على الوسام */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                <h4 className="text-lg font-bold text-blue-900 mb-3 text-center">
                  شرط الحصول على الوسام:
                </h4>
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    totalDonations >= requiredDonations ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {totalDonations >= requiredDonations ? (
                      <span className="text-white text-lg">✓</span>
                    ) : (
                      <span className="text-white text-lg">•</span>
                    )}
                  </div>
                  <span className="text-gray-700 text-lg">
                    إتمام <strong className="text-yellow-600 text-2xl">{requiredDonations}</strong> عمليات تبرع
                  </span>
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 text-center">
                  <span className="font-semibold">ملاحظة:</span> يمكنك متابعة تقدمك نحو الحصول على الوسام من خلال عدد التبرعات المسجلة في حسابك
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
