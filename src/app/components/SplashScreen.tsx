import { useEffect } from 'react';
import logo from 'figma:asset/07b3c35aee0fd5e080b43ed08377751086215a52.png';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#8B0000' }}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at center, rgba(139, 0, 0, 0.5) 0%, rgba(139, 0, 0, 0) 70%)'
      }}></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-12 px-8">
        {/* Logo - Clean without box, soft edges */}
        <div className="relative">
          <img
            src={logo}
            alt="RedDrop Logo"
            className="w-48 h-48 object-contain relative z-10 animate-pulse-slow rounded-full"
            style={{ filter: 'drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))' }}
          />
        </div>

        {/* Quranic Verse - Main element */}
        <div className="text-center max-w-4xl">
          <p className="text-4xl text-white leading-relaxed" style={{
            fontFamily: 'Traditional Arabic, serif',
            lineHeight: '2.8'
          }}>
            وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
