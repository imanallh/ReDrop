import { useState, useEffect } from 'react';
import { ArrowRight, Droplets, TrendingDown, AlertTriangle, Radio, Users, Clock, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface InventoryMonitoringProps {
  onBack: () => void;
  onGeoEmergency: (bloodType: string) => void;
  onCreateCampaign: (bloodType: string) => void;
}

type BloodInventory = {
  bloodType: string;
  currentUnits: number;
  safeThreshold: number;
  warningThreshold: number;
  criticalThreshold: number;
  consumptionRate: number; // units per hour
  lastUpdated: Date;
};

export default function InventoryMonitoring({ onBack, onGeoEmergency, onCreateCampaign }: InventoryMonitoringProps) {
  const [inventory, setInventory] = useState<BloodInventory[]>([
    { bloodType: 'A+', currentUnits: 2, safeThreshold: 20, warningThreshold: 10, criticalThreshold: 3, consumptionRate: 4, lastUpdated: new Date() },
    { bloodType: 'A-', currentUnits: 15, safeThreshold: 20, warningThreshold: 10, criticalThreshold: 3, consumptionRate: 1.5, lastUpdated: new Date() },
    { bloodType: 'B+', currentUnits: 8, safeThreshold: 20, warningThreshold: 10, criticalThreshold: 3, consumptionRate: 2, lastUpdated: new Date() },
    { bloodType: 'B-', currentUnits: 12, safeThreshold: 20, warningThreshold: 10, criticalThreshold: 3, consumptionRate: 0.8, lastUpdated: new Date() },
    { bloodType: 'AB+', currentUnits: 18, safeThreshold: 20, warningThreshold: 10, criticalThreshold: 3, consumptionRate: 1, lastUpdated: new Date() },
    { bloodType: 'AB-', currentUnits: 22, safeThreshold: 20, warningThreshold: 10, criticalThreshold: 3, consumptionRate: 0.5, lastUpdated: new Date() },
    { bloodType: 'O+', currentUnits: 1, safeThreshold: 20, warningThreshold: 10, criticalThreshold: 3, consumptionRate: 5, lastUpdated: new Date() },
    { bloodType: 'O-', currentUnits: 25, safeThreshold: 20, warningThreshold: 10, criticalThreshold: 3, consumptionRate: 2.5, lastUpdated: new Date() },
  ]);

  const [criticalAlert, setCriticalAlert] = useState<BloodInventory | null>(null);
  const [autoAlertSent, setAutoAlertSent] = useState<string[]>([]);

  // Check for critical levels on mount and when inventory changes
  useEffect(() => {
    const criticalItems = inventory.filter(
      item => item.currentUnits <= item.criticalThreshold && !autoAlertSent.includes(item.bloodType)
    );
    
    if (criticalItems.length > 0) {
      setCriticalAlert(criticalItems[0]); // Show first critical alert
    }
  }, [inventory, autoAlertSent]);

  const getInventoryLevel = (item: BloodInventory): 'safe' | 'warning' | 'critical' => {
    if (item.currentUnits <= item.criticalThreshold) return 'critical';
    if (item.currentUnits <= item.warningThreshold) return 'warning';
    return 'safe';
  };

  const getLevelColor = (level: 'safe' | 'warning' | 'critical') => {
    switch (level) {
      case 'safe': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-600';
    }
  };

  const getLevelBadgeColor = (level: 'safe' | 'warning' | 'critical') => {
    switch (level) {
      case 'safe': return 'bg-green-100 text-green-700 border-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
    }
  };

  const getLevelText = (level: 'safe' | 'warning' | 'critical') => {
    switch (level) {
      case 'safe': return 'مخزون كافٍ';
      case 'warning': return 'بداية الخطر';
      case 'critical': return 'خطر نفاذ المخزون';
    }
  };

  const calculateTimeToEmpty = (item: BloodInventory): number => {
    if (item.consumptionRate === 0) return Infinity;
    return item.currentUnits / item.consumptionRate;
  };

  const handleQuickAction = (item: BloodInventory) => {
    // This would trigger finding 5 nearest donors within 5km
    setCriticalAlert(item);
  };

  const handleAutoGeoAlert = (item: BloodInventory) => {
    // Trigger automatic geo-emergency
    setAutoAlertSent([...autoAlertSent, item.bloodType]);
    setCriticalAlert(null);
    onGeoEmergency(item.bloodType);
  };

  const criticalCount = inventory.filter(item => getInventoryLevel(item) === 'critical').length;
  const warningCount = inventory.filter(item => getInventoryLevel(item) === 'warning').length;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
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
            <div className="inline-flex items-center justify-center gap-2 bg-blue-100 text-blue-600 px-6 py-3 rounded-full mb-4">
              <Activity className="w-6 h-6" />
              <span className="text-xl font-bold">مراقبة مخزون بنك الدم</span>
            </div>
            <p className="text-gray-600">نظام استباقي لمنع نفاذ المخزون</p>
          </div>
        </div>

        {/* AI Prediction Alert */}
        <div className="mb-6 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-gray-900 font-semibold mb-1">⚠️ تنبؤ ذكي</p>
              <p className="text-gray-700 text-sm">
                بناءً على معدل الاستهلاك الحالي، من المتوقع نفاذ فصيلة <span className="font-bold text-orange-700">O+</span> خلال <span className="font-bold">3 أيام</span>
              </p>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {inventory.map((item) => {
            const level = getInventoryLevel(item);
            const progressValue = (item.currentUnits / item.safeThreshold) * 100;

            return (
              <Card 
                key={item.bloodType} 
                className={`border-2 ${
                  level === 'critical' ? 'border-red-500 shadow-lg shadow-red-200' : 'border-gray-200'
                }`}
              >
                <CardContent className="p-6">
                  {/* Blood Type & Count */}
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                      level === 'critical' ? 'bg-red-600' : 'bg-gray-700'
                    }`}>
                      <span className="text-2xl font-bold text-white">{item.bloodType}</span>
                    </div>
                    <p className={`text-4xl font-bold ${level === 'critical' ? 'text-red-600' : 'text-gray-900'}`}>
                      {item.currentUnits}
                    </p>
                    <p className="text-sm text-gray-600">وحدة</p>
                  </div>

                  {/* Progress Bar */}
                  <Progress 
                    value={progressValue} 
                    className={`h-2 mb-4 ${
                      level === 'critical' ? '[&>div]:bg-red-600' : '[&>div]:bg-gray-700'
                    }`}
                  />

                  {/* Status Badge */}
                  <Badge className={`${getLevelBadgeColor(level)} border text-xs w-full justify-center`}>
                    {getLevelText(level)}
                  </Badge>

                  {/* Action Button */}
                  {level === 'critical' && (
                    <div className="mt-4">
                      <Button
                        onClick={() => onCreateCampaign(item.bloodType)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <Users className="w-4 h-4 ml-2" />
                        إنشاء حملة تبرع
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Critical Alert Popup */}
        {criticalAlert && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="max-w-lg w-full border-4 border-red-600 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="flex items-center justify-center gap-3">
                  <AlertTriangle className="w-8 h-8" />
                  <CardTitle className="text-2xl">🚨 تنبيه عجز حرج</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Alert Message */}
                <div className="text-center space-y-2">
                  <p className="text-xl font-bold text-red-600">
                    فصيلة {criticalAlert.bloodType}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{criticalAlert.currentUnits}</p>
                  <p className="text-sm text-gray-600">وحدة متبقية فقط</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleAutoGeoAlert(criticalAlert)}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 py-6 text-lg"
                  >
                    <Radio className="w-6 h-6 ml-2" />
                    طلب متبرعين
                  </Button>

                  <Button
                    onClick={() => {
                      setCriticalAlert(null);
                      onCreateCampaign(criticalAlert.bloodType);
                    }}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 py-6 text-lg"
                  >
                    <Users className="w-6 h-6 ml-2" />
                    إنشاء حملة تبرع
                  </Button>

                  <Button
                    onClick={() => {
                      setCriticalAlert(null);
                      alert(`تم إرسال طلب ${criticalAlert.bloodType} إلى بنوك الدم المجاورة`);
                    }}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 py-6 text-lg"
                  >
                    <Droplets className="w-6 h-6 ml-2" />
                    طلب من بنك دم آخر
                  </Button>

                  <Button
                    onClick={() => setCriticalAlert(null)}
                    variant="outline"
                    className="w-full"
                  >
                    تجاهل
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}