import { useState, useEffect } from 'react';
import Login, { type NafathUserData } from './components/Login';
import Dashboard from './components/Dashboard';
import DonorDashboard from './components/DonorDashboard';
import CreateEmergency from './components/CreateEmergency';
import ResponseConfirmation from './components/ResponseConfirmation';
import LiveTracking from './components/LiveTracking';
import GeoEmergency from './components/GeoEmergency';
import InventoryMonitoring from './components/InventoryMonitoring';
import CreateCampaign from './components/CreateCampaign';
import AlgorithmDemo from './components/AlgorithmDemo';
import { seedDatabase } from '../utils/seedData';

export type EmergencyCase = {
  id: string;
  bloodType: string;
  units: number;
  severity: 'critical-high' | 'critical' | 'moderate';
  location: string;
  timeNeeded: 'now' | 'within-hour';
  status: 'pending' | 'matching' | 'responded' | 'completed';
  createdAt: Date;
  nightMode?: boolean; // وضع الطوارئ الليلي
};

export type Donor = {
  id: string;
  name: string;
  bloodType: string;
  distance: number;
  lastDonation: string;
  available: boolean;
  responseCount: number;
};

export default function App() {
  const [userType, setUserType] = useState<'staff' | 'donor' | null>(null);
  const [nafathData, setNafathData] = useState<NafathUserData | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'matching' | 'response' | 'tracking' | 'geo-emergency' | 'inventory' | 'create-campaign' | 'algorithm'>('dashboard');
  const [currentCase, setCurrentCase] = useState<EmergencyCase | null>(null);
  const [selectedDonors, setSelectedDonors] = useState<Donor[]>([]);
  const [geoEmergencyTrigger, setGeoEmergencyTrigger] = useState<{ bloodType: string; fromInventory: boolean } | null>(null);
  const [campaignBloodType, setCampaignBloodType] = useState<string | undefined>(undefined);
  const [isDataSeeded, setIsDataSeeded] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // التحقق من وجود البيانات في المرة الأولى
  useEffect(() => {
    const seeded = localStorage.getItem('redDropDataSeeded');
    if (seeded === 'true') {
      setIsDataSeeded(true);
    }
  }, []);

  // دالة لتحميل البيانات التجريبية
  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      localStorage.setItem('redDropDataSeeded', 'true');
      setIsDataSeeded(true);
      alert('✅ تم تحميل البيانات التجريبية بنجاح!');
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
      alert('❌ فشل تحميل البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleLogin = (type: 'staff' | 'donor', nafathUserData?: NafathUserData) => {
    setUserType(type);
    if (nafathUserData) {
      setNafathData(nafathUserData);
    }
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserType(null);
    setNafathData(null);
    setCurrentView('dashboard');
    setCurrentCase(null);
    setSelectedDonors([]);
    setGeoEmergencyTrigger(null);
  };

  const handleCreateCase = (caseData: Omit<EmergencyCase, 'id' | 'status' | 'createdAt'>) => {
    const newCase: EmergencyCase = {
      ...caseData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'responded',
      createdAt: new Date(),
    };
    setCurrentCase(newCase);
    setCurrentView('dashboard');
  };

  const handleDonorSelection = (donors: Donor[]) => {
    setSelectedDonors(donors);
    setCurrentView('response');
  };

  const handleConfirmResponse = () => {
    if (currentCase) {
      setCurrentCase({ ...currentCase, status: 'responded' });
      setCurrentView('tracking');
    }
  };

  // Login Screen
  if (!userType) {
    return (
      <div>
        <Login onLogin={handleLogin} />

        {/* زر تحميل البيانات التجريبية */}
        {!isDataSeeded && (
          <div className="fixed bottom-8 left-8 z-50">
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSeeding ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>جاري التحميل...</span>
                </>
              ) : (
                <>
                  <span>🌱</span>
                  <span>تحميل بيانات تجريبية</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Donor Dashboard
  if (userType === 'donor') {
    return (
      <div className="min-h-screen" dir="rtl">
        <DonorDashboard onLogout={handleLogout} nafathData={nafathData} />
      </div>
    );
  }

  // Hospital Staff System
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50" dir="rtl">
      {currentView === 'dashboard' && (
        <Dashboard
          onCreateNew={() => setCurrentView('create')}
          onViewActive={() => setCurrentView('tracking')}
          onGeoEmergency={() => setCurrentView('geo-emergency')}
          onInventoryMonitoring={() => setCurrentView('inventory')}
          onCreateCampaign={() => setCurrentView('create-campaign')}
          onAlgorithm={() => setCurrentView('algorithm')}
        />
      )}
      
      {currentView === 'create' && (
        <CreateEmergency 
          onSubmit={handleCreateCase}
          onBack={() => setCurrentView('dashboard')}
        />
      )}
      
      {currentView === 'response' && selectedDonors.length > 0 && currentCase && (
        <ResponseConfirmation 
          donors={selectedDonors}
          emergencyCase={currentCase}
          onConfirm={handleConfirmResponse}
          onBack={() => setCurrentView('matching')}
        />
      )}
      
      {currentView === 'tracking' && currentCase && (
        <LiveTracking 
          emergencyCase={currentCase}
          donors={selectedDonors}
          onBack={() => setCurrentView('dashboard')}
        />
      )}
      
      {currentView === 'geo-emergency' && (
        <GeoEmergency 
          onBack={() => setCurrentView('dashboard')}
          autoTrigger={geoEmergencyTrigger || undefined}
        />
      )}
      
      {currentView === 'inventory' && (
        <InventoryMonitoring 
          onBack={() => setCurrentView('dashboard')}
          onGeoEmergency={(bloodType: string) => {
            setGeoEmergencyTrigger({ bloodType, fromInventory: true });
            setCurrentView('geo-emergency');
          }}
          onCreateCampaign={(bloodType: string) => {
            setCampaignBloodType(bloodType);
            setCurrentView('create-campaign');
          }}
        />
      )}
      
      {currentView === 'create-campaign' && (
        <CreateCampaign
          onBack={() => setCurrentView('dashboard')}
          suggestedBloodType={campaignBloodType}
        />
      )}

      {currentView === 'algorithm' && (
        <AlgorithmDemo
          onBack={() => setCurrentView('dashboard')}
        />
      )}
    </div>
  );
}