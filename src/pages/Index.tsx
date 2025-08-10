import React, { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import CarbonCalculator from '@/components/CarbonCalculator';

const Index = () => {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {!showCalculator ? (
        <HeroSection onStartCalculation={() => setShowCalculator(true)} />
      ) : (
        <div className="min-h-screen bg-background py-16">
          <div className="container mx-auto">
            <CarbonCalculator />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
