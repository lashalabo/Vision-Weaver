
import React, { useState }from 'react';
import PhaseOne from './components/PhaseOne';
import PhaseTwo from './components/PhaseTwo';
import { CreativeSession } from './types';
import { VisionWeaverIcon } from './components/icons';

enum AppPhase {
  Discovery = 'DISCOVERY',
  Generation = 'GENERATION',
}

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.Discovery);
  const [sessionData, setSessionData] = useState<CreativeSession | null>(null);

  const handlePhaseOneComplete = (data: CreativeSession) => {
    setSessionData(data);
    setPhase(AppPhase.Generation);
  };

  const handleBackToDiscovery = () => {
    setPhase(AppPhase.Discovery);
  };
  
  const handleStartOver = () => {
    setSessionData(null);
    setPhase(AppPhase.Discovery);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <VisionWeaverIcon className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Vision Weaver</h1>
          </div>
          {phase === AppPhase.Generation && (
            <button
              onClick={handleStartOver}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300 text-sm font-semibold"
            >
              Start New Project
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {phase === AppPhase.Discovery ? (
          <PhaseOne onComplete={handlePhaseOneComplete} initialSessionData={sessionData} />
        ) : sessionData ? (
          <PhaseTwo sessionData={sessionData} onBack={handleBackToDiscovery} />
        ) : (
          <p>Error: Session data is missing.</p>
        )}
      </main>
    </div>
  );
};

export default App;
