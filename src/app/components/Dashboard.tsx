import { Droplets, Radio, Activity, Users, Zap } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface DashboardProps {
  onCreateNew: () => void;
  onViewActive: () => void;
  onGeoEmergency?: () => void;
  onInventoryMonitoring?: () => void;
  onCreateCampaign?: () => void;
  onAlgorithm?: () => void;
}

export default function Dashboard({ onCreateNew, onGeoEmergency, onInventoryMonitoring, onCreateCampaign, onAlgorithm }: DashboardProps) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <Droplets className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="text-xl text-gray-600 mb-2">نظام ذكي لإدارة حالات التبرع بالدم العاجلة</p>
          <p className="text-lg text-gray-500">مطابقة تلقائية فورية مع أفضل المتبرعين المتاحين</p>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {/* Create Emergency */}
          <Card 
            className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
            onClick={onCreateNew}
          >
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-5 bg-red-100 rounded-full">
                  <Droplets className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">إنشاء حالة عاجلة</h2>
                <p className="text-gray-600">نشر الحالات العاجلة </p>
                <Button 
                  className="bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 w-full mt-4 py-5 font-bold shadow-md border border-gray-300"
                  size="lg"
                >
                  🔴 حالة طوارئ جديدة
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Geo Emergency */}
          <Card 
            className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
            onClick={onGeoEmergency}
          >
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-5 bg-orange-100 rounded-full">
                  <Radio className="w-12 h-12 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">طلب متبرعين</h2>
                <p className="text-gray-600">إرسال SMS جماعي لجميع المتبرعين بالمنطقة</p>
                <Button 
                  className="bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 w-full mt-4 py-5 font-bold shadow-md border border-gray-300"
                  size="lg"
                >📡 إرسال نداء واسع النطاق</Button>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Monitoring */}
          <Card 
            className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
            onClick={onInventoryMonitoring}
          >
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-5 bg-blue-100 rounded-full">
                  <Activity className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">مراقبة المخزون</h2>
                <p className="text-gray-600">مراقبة مستويات المخزون وتحديثات فورية</p>
                <Button 
                  className="bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 w-full mt-4 py-5 font-bold shadow-md border border-gray-300"
                  size="lg"
                >
                  📊 مراجعة المخزون
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Create Campaign */}
          <Card
            className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
            onClick={onCreateCampaign}
          >
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-5 bg-green-100 rounded-full">
                  <Users className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">إنشاء حملة تبرع</h2>
                <p className="text-gray-600">حملات منظمة لتلبية النقص في المخزون</p>
                <Button
                  onClick={onCreateCampaign}
                  className="bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 w-full mt-4 py-5 font-bold shadow-md border border-gray-300"
                  size="lg"
                >
                  📢 حملة جديدة
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Algorithm Demo */}
          <Card
            className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
            onClick={onAlgorithm}
          >
            <CardContent className="p-8 bg-[#00000000]">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-5 bg-purple-100 rounded-full">
                  <Zap className="w-12 h-12 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">خوارزمية المطابقة</h2>
                <p className="text-gray-600">تجربة تفاعلية لآلية البحث عن المتبرعين</p>
                <Button
                  className="bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 w-full mt-4 py-5 font-bold shadow-md border border-gray-300"
                  size="lg"
                >
                  ⚡ تجربة الخوارزمية
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Info */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2">مطابقة ذكية</h3>
              <p className="text-sm text-gray-600">خوارزمية تلقائية تبحث عن أفضل 5 متبرعين</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-gray-900 mb-2">استجابة فورية</h3>
              <p className="text-sm text-gray-600">توسع تلقائي من 10→20→30 كم</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold text-gray-900 mb-2">متابعة لحظية</h3>
              <p className="text-sm text-gray-600">تصريح طوارئ رقمي وخريطة مباشرة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}