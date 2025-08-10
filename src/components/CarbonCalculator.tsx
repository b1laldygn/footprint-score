import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Car, Plane, Home, Utensils, Calculator, Leaf } from 'lucide-react';

interface CarbonData {
  transportation: {
    carKm: number;
    publicTransportKm: number;
    flightHours: number;
  };
  energy: {
    electricityKwh: number;
    naturalGasKwh: number;
  };
  lifestyle: {
    dietType: string;
    recyclingFrequency: string;
  };
}

const CarbonCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [carbonData, setCarbonData] = useState<CarbonData>({
    transportation: { carKm: 0, publicTransportKm: 0, flightHours: 0 },
    energy: { electricityKwh: 0, naturalGasKwh: 0 },
    lifestyle: { dietType: '', recyclingFrequency: '' }
  });
  const [result, setResult] = useState<number | null>(null);

  const steps = [
    { title: 'Ulaşım', icon: Car, description: 'Yıllık ulaşım alışkanlıklarınız' },
    { title: 'Enerji', icon: Home, description: 'Ev ve enerji tüketiminiz' },
    { title: 'Yaşam Tarzı', icon: Utensils, description: 'Beslenme ve geri dönüşüm' },
    { title: 'Sonuçlar', icon: Calculator, description: 'Karbon ayak iziniz' }
  ];

  // CO₂ emission factors (kg CO₂ per unit)
  const emissionFactors = {
    carKm: 0.21,
    publicTransportKm: 0.05,
    flightHour: 90,
    electricityKwh: 0.43,
    naturalGasKwh: 0.19,
    dietMultipliers: {
      'yuksek-et': 1.5,
      'orta-et': 1.2,
      'az-et': 1.0,
      'vejetaryen': 0.7,
      'vegan': 0.5
    },
    recyclingMultipliers: {
      'hic': 1.2,
      'az': 1.1,
      'orta': 1.0,
      'cok': 0.9
    }
  };

  const calculateCarbonFootprint = () => {
    const transportEmissions = 
      carbonData.transportation.carKm * emissionFactors.carKm +
      carbonData.transportation.publicTransportKm * emissionFactors.publicTransportKm +
      carbonData.transportation.flightHours * emissionFactors.flightHour;

    const energyEmissions = 
      carbonData.energy.electricityKwh * emissionFactors.electricityKwh +
      carbonData.energy.naturalGasKwh * emissionFactors.naturalGasKwh;

    const baseFoodEmissions = 1500; // Base annual food emissions in kg CO₂
    const dietMultiplier = emissionFactors.dietMultipliers[carbonData.lifestyle.dietType as keyof typeof emissionFactors.dietMultipliers] || 1;
    const recyclingMultiplier = emissionFactors.recyclingMultipliers[carbonData.lifestyle.recyclingFrequency as keyof typeof emissionFactors.recyclingMultipliers] || 1;
    
    const lifestyleEmissions = baseFoodEmissions * dietMultiplier * recyclingMultiplier;

    const totalEmissions = transportEmissions + energyEmissions + lifestyleEmissions;
    setResult(Math.round(totalEmissions));
  };

  const getCategoryAssessment = (emissions: number) => {
    if (emissions < 4000) return { category: 'Düşük', color: 'leaf', description: 'Tebrikler! Karbon ayak iziniz ortalamanın altında.' };
    if (emissions < 8000) return { category: 'Orta', color: 'earth', description: 'Ortalama seviyedesiniz. Bazı iyileştirmeler yapabilirsiniz.' };
    return { category: 'Yüksek', color: 'destructive', description: 'Karbon ayak izinizi azaltmak için harekete geçme zamanı.' };
  };

  const getTips = () => [
    'Toplu taşıma kullanarak yıllık 1-2 ton CO₂ tasarruf edebilirsiniz.',
    'Enerji tasarruflu ampuller kullanarak elektrik tüketiminizi %10 azaltın.',
    'Haftada 1-2 gün et tüketmeyerek karbon ayak izinizi %15 azaltabilirsiniz.',
    'Geri dönüşümü artırarak yıllık 500 kg CO₂ tasarruf edebilirsiniz.'
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === steps.length - 2) {
      calculateCarbonFootprint();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetCalculator = () => {
    setCurrentStep(0);
    setCarbonData({
      transportation: { carKm: 0, publicTransportKm: 0, flightHours: 0 },
      energy: { electricityKwh: 0, naturalGasKwh: 0 },
      lifestyle: { dietType: '', recyclingFrequency: '' }
    });
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  isActive ? 'bg-primary border-primary text-primary-foreground' :
                  isCompleted ? 'bg-leaf border-leaf text-leaf-foreground' :
                  'bg-background border-border text-muted-foreground'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-16 mx-2 rounded-full transition-all ${
                    isCompleted ? 'bg-leaf' : 'bg-border'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">{steps[currentStep].title}</h2>
          <p className="text-muted-foreground">{steps[currentStep].description}</p>
        </div>
      </div>

      <Card className="shadow-nature">
        <CardContent className="p-6">
          {/* Transportation Step */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="car-km">Yıllık Araba Kullanımı (km)</Label>
                  <Input
                    id="car-km"
                    type="number"
                    placeholder="0"
                    value={carbonData.transportation.carKm || ''}
                    onChange={(e) => setCarbonData({
                      ...carbonData,
                      transportation: { ...carbonData.transportation, carKm: Number(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="public-transport">Yıllık Toplu Taşıma (km)</Label>
                  <Input
                    id="public-transport"
                    type="number"
                    placeholder="0"
                    value={carbonData.transportation.publicTransportKm || ''}
                    onChange={(e) => setCarbonData({
                      ...carbonData,
                      transportation: { ...carbonData.transportation, publicTransportKm: Number(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="flights">Yıllık Uçuş Saati</Label>
                  <Input
                    id="flights"
                    type="number"
                    placeholder="0"
                    value={carbonData.transportation.flightHours || ''}
                    onChange={(e) => setCarbonData({
                      ...carbonData,
                      transportation: { ...carbonData.transportation, flightHours: Number(e.target.value) }
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Energy Step */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="electricity">Aylık Elektrik Tüketimi (kWh)</Label>
                  <Input
                    id="electricity"
                    type="number"
                    placeholder="0"
                    value={carbonData.energy.electricityKwh || ''}
                    onChange={(e) => setCarbonData({
                      ...carbonData,
                      energy: { ...carbonData.energy, electricityKwh: Number(e.target.value) * 12 }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="natural-gas">Aylık Doğal Gaz Tüketimi (kWh)</Label>
                  <Input
                    id="natural-gas"
                    type="number"
                    placeholder="0"
                    value={carbonData.energy.naturalGasKwh || ''}
                    onChange={(e) => setCarbonData({
                      ...carbonData,
                      energy: { ...carbonData.energy, naturalGasKwh: Number(e.target.value) * 12 }
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Lifestyle Step */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="diet">Beslenme Tarzınız</Label>
                  <Select value={carbonData.lifestyle.dietType} onValueChange={(value) => 
                    setCarbonData({
                      ...carbonData,
                      lifestyle: { ...carbonData.lifestyle, dietType: value }
                    })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Beslenme tarzınızı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yuksek-et">Yoğun Et Tüketimi</SelectItem>
                      <SelectItem value="orta-et">Orta Düzey Et</SelectItem>
                      <SelectItem value="az-et">Az Et Tüketimi</SelectItem>
                      <SelectItem value="vejetaryen">Vejetaryen</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recycling">Geri Dönüşüm Sıklığınız</Label>
                  <Select value={carbonData.lifestyle.recyclingFrequency} onValueChange={(value) => 
                    setCarbonData({
                      ...carbonData,
                      lifestyle: { ...carbonData.lifestyle, recyclingFrequency: value }
                    })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Geri dönüşüm sıklığını seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hic">Hiç Yapmam</SelectItem>
                      <SelectItem value="az">Nadiren</SelectItem>
                      <SelectItem value="orta">Bazen</SelectItem>
                      <SelectItem value="cok">Düzenli Olarak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Results Step */}
          {currentStep === 3 && result !== null && (
            <div className="text-center space-y-6">
              <div className="animate-float">
                <Leaf className="w-16 h-16 mx-auto text-leaf mb-4" />
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-2">
                  {(result / 1000).toFixed(1)} ton CO₂
                </h3>
                <p className="text-lg text-muted-foreground">Yıllık karbon ayak iziniz</p>
              </div>

              <div className="flex justify-center">
                <Badge variant="secondary" className={`text-lg px-4 py-2 bg-${getCategoryAssessment(result).color} text-${getCategoryAssessment(result).color}-foreground`}>
                  {getCategoryAssessment(result).category} Seviye
                </Badge>
              </div>

              <p className="text-muted-foreground">
                {getCategoryAssessment(result).description}
              </p>

              <Separator />

              <div className="text-left space-y-4">
                <h4 className="text-lg font-semibold text-foreground mb-3">Azaltma Önerileri:</h4>
                <div className="grid gap-3">
                  {getTips().map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <Leaf className="w-5 h-5 text-leaf mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={currentStep === 0 ? undefined : prevStep}
              disabled={currentStep === 0}
            >
              Geri
            </Button>
            
            <div className="flex gap-2">
              {currentStep === 3 ? (
                <Button variant="hero" onClick={resetCalculator}>
                  Yeniden Hesapla
                </Button>
              ) : (
                <Button variant="forest" onClick={nextStep}>
                  {currentStep === 2 ? 'Hesapla' : 'İleri'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonCalculator;