import { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Clock, CheckCircle2, Navigation, AlertCircle, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import type { Donor, EmergencyCase } from '../App';

interface LiveTrackingProps {
  emergencyCase: EmergencyCase;
  donors: Donor[];
  onBack: () => void;
}

type DonorStatus = 'pending' | 'accepted' | 'on-way' | 'arrived';

interface DonorWithStatus extends Donor {
  status: DonorStatus;
  eta?: number; // minutes
}

export default function LiveTracking({ emergencyCase, donors, onBack }: LiveTrackingProps) {
  const [donorsStatus, setDonorsStatus] = useState<DonorWithStatus[]>(
    donors.map(d => ({
      ...d,
      status: 'pending' as DonorStatus,
      eta: Math.floor(d.distance * 3),
    }))
  );

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDonorsStatus(prev => prev.map(donor => {
        if (donor.status === 'pending' && Math.random() > 0.7) {
          return { ...donor, status: 'accepted' };
        }
        if (donor.status === 'accepted' && Math.random() > 0.6) {
          return { ...donor, status: 'on-way' };
        }
        if (donor.status === 'on-way' && donor.eta && donor.eta > 0) {
          const newEta = donor.eta - 1;
          if (newEta <= 0) {
            return { ...donor, status: 'arrived' as DonorStatus, eta: 0 };
          }
          return { ...donor, eta: newEta };
        }
        return donor;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const acceptedCount = donorsStatus.filter(d => d.status === 'accepted' || d.status === 'on-way' || d.status === 'arrived').length;
  const onWayCount = donorsStatus.filter(d => d.status === 'on-way').length;
  const arrivedCount = donorsStatus.filter(d => d.status === 'arrived').length;
  const nextEta = Math.min(...donorsStatus.filter(d => d.eta).map(d => d.eta!));

  const getStatusBadge = (status: DonorStatus) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">⏳ بانتظار الرد</Badge>;
      case 'accepted':
        return <Badge className="bg-blue-100 text-blue-700">✓ قبل الطلب</Badge>;
      case 'on-way':
        return <Badge className="bg-purple-100 text-purple-700 animate-pulse">🚗 في الطريق</Badge>;
      case 'arrived':
        return <Badge className="bg-green-500 text-white">✅ وصل</Badge>;
    }
  };

  const getProgressValue = () => {
    const total = donorsStatus.length;
    const progress = (acceptedCount / total) * 50 + (onWayCount / total) * 30 + (arrivedCount / total) * 20;
    return progress;
  };

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
            العودة للوحة التحكم
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 bg-blue-100 text-blue-600 px-6 py-3 rounded-full mb-4">
              <MapPin className="w-6 h-6 animate-pulse" />
              <span className="text-xl">متابعة حية للحالة العاجلة</span>
            </div>
            <p className="text-gray-600">تتبع مباشر لموقع وحالة المتبرعين</p>
          </div>
        </div>

        {/* Case Status Overview */}
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <p className="text-3xl">{acceptedCount}</p>
                <p className="text-sm text-blue-100">استجابوا</p>
              </div>
              <div className="text-center">
                <Navigation className="w-8 h-8 mx-auto mb-2" />
                <p className="text-3xl">{onWayCount}</p>
                <p className="text-sm text-blue-100">في الطريق</p>
              </div>
              <div className="text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                <p className="text-3xl">{arrivedCount}</p>
                <p className="text-sm text-blue-100">وصلوا</p>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p className="text-3xl">{isFinite(nextEta) ? nextEta : '--'}</p>
                <p className="text-sm text-blue-100">دقيقة متبقية</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-bold">تقدم الحالة</span>
                <span className="text-gray-600">{Math.round(getProgressValue())}% مكتمل</span>
              </div>
              <Progress value={getProgressValue()} className="h-4" />
              <div className="grid grid-cols-4 gap-2 text-xs text-center mt-4">
                <div className={acceptedCount > 0 ? 'text-blue-600 font-bold' : 'text-gray-400'}>
                  ✓ استجابة
                </div>
                <div className={onWayCount > 0 ? 'text-purple-600 font-bold' : 'text-gray-400'}>
                  🚗 قيد النقل
                </div>
                <div className={arrivedCount > 0 ? 'text-green-600 font-bold' : 'text-gray-400'}>
                  ✅ الوصول
                </div>
                <div className={arrivedCount === donorsStatus.length ? 'text-green-600 font-bold' : 'text-gray-400'}>
                  🎯 اكتمل
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donors List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>حالة المتبرعين ({donorsStatus.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {donorsStatus.map((donor) => (
                    <div 
                      key={donor.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        donor.status === 'arrived' ? 'bg-green-50 border-green-500' :
                        donor.status === 'on-way' ? 'bg-purple-50 border-purple-300' :
                        donor.status === 'accepted' ? 'bg-blue-50 border-blue-300' :
                        'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                            donor.status === 'arrived' ? 'bg-green-600' :
                            donor.status === 'on-way' ? 'bg-purple-600' :
                            donor.status === 'accepted' ? 'bg-blue-600' :
                            'bg-gray-400'
                          }`}>
                            {donor.status === 'arrived' && <CheckCircle2 className="w-6 h-6" />}
                            {donor.status === 'on-way' && <Navigation className="w-6 h-6" />}
                            {donor.status === 'accepted' && <Clock className="w-6 h-6" />}
                            {donor.status === 'pending' && <AlertCircle className="w-6 h-6" />}
                          </div>
                          
                          <div className="flex-1">
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

                        <div className="text-left">
                          {getStatusBadge(donor.status)}
                          {donor.status === 'on-way' && donor.eta !== undefined && (
                            <p className="text-xs text-gray-500 mt-1">
                              متبقي: {donor.eta} دقيقة
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Timeline */}
                      {donor.status !== 'pending' && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`w-16 h-1 rounded ${donor.status === 'accepted' || donor.status === 'on-way' || donor.status === 'arrived' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          <div className={`w-16 h-1 rounded ${donor.status === 'on-way' || donor.status === 'arrived' ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                          <div className={`w-16 h-1 rounded ${donor.status === 'arrived' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Case Info */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg">معلومات الحالة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">فصيلة الدم:</span>
                  <Badge className="bg-red-600 text-white">{emergencyCase.bloodType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">الوحدات:</span>
                  <span className="font-bold">{emergencyCase.units}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">الخطورة:</span>
                  <Badge className="bg-red-600 text-white">
                    {emergencyCase.severity === 'critical-high' ? 'حرجة جداً' : 
                     emergencyCase.severity === 'critical' ? 'حرجة' : 'متوسطة'}
                  </Badge>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600 mb-1">الموقع:</p>
                  <p className="text-sm font-bold">{emergencyCase.location}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  إحصائيات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">معدل الاستجابة</p>
                  <p className="text-2xl text-green-600">{Math.round((acceptedCount / donorsStatus.length) * 100)}%</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">متوسط وقت الوصول</p>
                  <p className="text-2xl text-blue-600">
                    {isFinite(nextEta) ? `${nextEta} دقيقة` : '--'}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">حالة النظام</p>
                  <p className="text-lg text-purple-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    نشط ومتصل
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
              <CardContent className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  إجراءات طوارئ
                </h3>
                <div className="space-y-2">
                  <Button variant="secondary" className="w-full bg-white text-red-600 hover:bg-red-50">
                    📞 اتصال طوارئ
                  </Button>
                  <Button variant="secondary" className="w-full bg-white/90 text-red-600 hover:bg-white">
                    📍 تحديث الموقع
                  </Button>
                  <Button variant="secondary" className="w-full bg-white/80 text-red-600 hover:bg-white">
                    ⚠️ إلغاء الحالة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Updates */}
        <Card className="mt-6 bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mt-2"></div>
              <div className="text-sm text-green-900">
                <strong>التحديثات المباشرة نشطة:</strong> يتم تحديث حالة المتبرعين تلقائياً كل 3 ثوانٍ. 
                ستتلقى إشعارات فورية عند قبول أي متبرع أو بدء رحلته أو وصوله للمستشفى.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}