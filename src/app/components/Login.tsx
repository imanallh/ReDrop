import { useState } from 'react';
import { Building2, Heart, Shield } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import logo from 'figma:asset/07b3c35aee0fd5e080b43ed08377751086215a52.png';

interface LoginProps {
  onLogin: (userType: 'staff' | 'donor', nafathData?: NafathUserData) => void;
}

export type NafathUserData = {
  nationalId: string;
  name: string;
  phone: string;
  dateOfBirth: string;
  age: number;
};

export default function Login({ onLogin }: LoginProps) {
  const [selectedUserType, setSelectedUserType] = useState<'staff' | 'donor' | null>(null);

  const handleNafathLogin = (userType: 'staff' | 'donor') => {
    // محاكاة بيانات نفاذ (في الواقع ستأتي من API نفاذ)
    const mockNafathData: NafathUserData = {
      nationalId: '1234567890',
      name: 'أحمد محمد العلي',
      phone: '0551234567',
      dateOfBirth: '1995-03-15',
      age: 29
    };

    onLogin(userType, mockNafathData);
  };

  const handleGoogleLogin = (userType: 'staff' | 'donor') => {
    // محاكاة تسجيل الدخول عبر Google (في الواقع ستأتي من Google OAuth)
    onLogin(userType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-center">
            <img src={logo} alt="RedDrop Logo" className="w-24 h-24 mx-auto mb-4 drop-shadow-lg rounded-[15px]" />
            
            <p className="text-red-100 text-[20px] font-bold font-[Cairo]">منصة إدارة التبرع بالدم</p>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            {!selectedUserType ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">مرحباً بك</h2>
                  <p className="text-gray-500 text-sm">اختر نوع الحساب للمتابعة</p>
                </div>

                {/* User Type Selection */}
                <div className="space-y-4">
                  {/* Donor */}
                  <button
                    onClick={() => setSelectedUserType('donor')}
                    className="w-full group relative overflow-hidden rounded-xl p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-red-500 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <Heart className="w-7 h-7 text-red-600" />
                      </div>
                      <div className="text-right">
                        <h3 className="text-lg font-bold text-gray-800">متبرع بالدم</h3>
                        <p className="text-sm text-gray-500">Blood Donor</p>
                      </div>
                    </div>
                  </button>

                  {/* Staff */}
                  <button
                    onClick={() => setSelectedUserType('staff')}
                    className="w-full group relative overflow-hidden rounded-xl p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-red-500 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <Building2 className="w-7 h-7 text-red-600" />
                      </div>
                      <div className="text-right">
                        <h3 className="text-lg font-bold text-gray-800">موظف مستشفى</h3>
                        <p className="text-sm text-gray-500">Hospital Staff</p>
                      </div>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <button
                    onClick={() => setSelectedUserType(null)}
                    className="text-gray-500 hover:text-gray-700 text-sm mb-4"
                  >
                    ← العودة لاختيار نوع الحساب
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">اختر طريقة الدخول</h2>
                  <p className="text-gray-500 text-sm">
                    {selectedUserType === 'staff' ? 'موظف مستشفى' : 'متبرع بالدم'}
                  </p>
                </div>

                {/* Login Methods */}
                <div className="space-y-4">
                  {/* Nafath Login */}
                  <button
                    onClick={() => handleNafathLogin(selectedUserType)}
                    className="w-full group rounded-xl p-5 bg-[#00843D] hover:bg-[#006B32] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6" />
                        <div className="text-right">
                          <h3 className="font-bold">تسجيل الدخول عبر نفاذ</h3>
                          <p className="text-xs text-green-100">تعبئة تلقائية للبيانات</p>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Google Login */}
                  <button
                    onClick={() => handleGoogleLogin(selectedUserType)}
                    className="w-full group rounded-xl p-5 bg-white border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <div className="text-right">
                          <h3 className="font-bold text-gray-800">تسجيل الدخول عبر Google</h3>
                          <p className="text-xs text-gray-500">سريع وسهل</p>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Login Info */}
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700 font-semibold mb-1">خيارات دخول متعددة</p>
                      <p className="text-xs text-gray-600">نفاذ للحصول على بيانات تلقائية، أو Google للدخول السريع</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          نظام RedDrop لإدارة الحالات العاجلة
        </p>
      </div>
    </div>
  );
}