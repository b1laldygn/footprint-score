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
  consumption: {
    meatFrequency: string;
    dailyDiet: string;
    monthlyPackages: number;
  };
  environment: {
    recycling: string;
    renewableEnergy: string;
    treePlanting: string;
    lightsOff: string;
    waterUsage: string;
  };
  transportation: {
    dailyTransport: string;
    carKm: number;
    publicTransportKm: number;
  };
}

const CarbonCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [carbonData, setCarbonData] = useState<CarbonData>({
    consumption: { meatFrequency: '', dailyDiet: '', monthlyPackages: 0 },
    environment: { recycling: '', renewableEnergy: '', treePlanting: '', lightsOff: '', waterUsage: '' },
    transportation: { dailyTransport: '', carKm: 0, publicTransportKm: 0 }
  });
  const [result, setResult] = useState<number | null>(null);

  const steps = [
    { title: 'Tüketim Alışkanlıkları', icon: Utensils, description: 'Beslenme ve kargo alışkanlıklarınız' },
    { title: 'Çevre Bilinci', icon: Leaf, description: 'Geri dönüşüm ve çevre dostu davranışlarınız' },
    { title: 'Ulaşım', icon: Car, description: 'Günlük ulaşım tercihleriniz' },
    { title: 'Sonuçlar', icon: Calculator, description: 'Karbon ayak iziniz' }
  ];

  // CO₂ emission factors (kg CO₂ per unit)
  const emissionFactors = {
    // Meat consumption (weekly to annual kg CO₂)
    meatFrequency: {
      'gunluk': 1300,      // Daily meat consumption
      '5-6-gun': 1100,     // 5-6 days per week
      '3-4-gun': 800,      // 3-4 days per week
      '1-2-gun': 500,      // 1-2 days per week
      'hic': 200           // No meat (vegetarian/vegan)
    },
    // Daily diet habits
    dailyDiet: {
      'fast-food': 500,     // Frequent fast food
      'islenmis': 300,      // Processed foods
      'evde': 150,          // Home cooked
      'organik': 100        // Organic/local foods
    },
    // Monthly packages
    packageEmission: 2.5,   // kg CO₂ per package
    
    // Environmental consciousness multipliers
    recycling: { 'evet': 0.9, 'hayir': 1.1 },
    renewableEnergy: { 'evet': 0.8, 'hayir': 1.2 },
    treePlanting: { 'evet': 0.95, 'hayir': 1.0 },
    lightsOff: { 'evet': 0.95, 'hayir': 1.05 },
    waterUsage: { 'tasarruf': 0.9, 'normal': 1.0, 'fazla': 1.1 },
    
    // Transportation (daily to annual kg CO₂)
    dailyTransport: {
      'araba': 2200,        // Daily car use
      'motosiklet': 1200,   // Motorcycle
      'toplu-tasima': 800,  // Public transport
      'bisiklet': 50,       // Bicycle
      'yuru': 20            // Walking
    }
  };

  const calculateCarbonFootprint = () => {
    // Consumption emissions
    const meatEmissions = emissionFactors.meatFrequency[carbonData.consumption.meatFrequency as keyof typeof emissionFactors.meatFrequency] || 0;
    const dietEmissions = emissionFactors.dailyDiet[carbonData.consumption.dailyDiet as keyof typeof emissionFactors.dailyDiet] || 0;
    const packageEmissions = carbonData.consumption.monthlyPackages * 12 * emissionFactors.packageEmission;
    
    // Transportation emissions
    const transportEmissions = emissionFactors.dailyTransport[carbonData.transportation.dailyTransport as keyof typeof emissionFactors.dailyTransport] || 0;
    
    // Calculate base emissions
    const baseEmissions = meatEmissions + dietEmissions + packageEmissions + transportEmissions;
    
    // Apply environmental consciousness multipliers
    const recyclingMultiplier = emissionFactors.recycling[carbonData.environment.recycling as keyof typeof emissionFactors.recycling] || 1;
    const renewableMultiplier = emissionFactors.renewableEnergy[carbonData.environment.renewableEnergy as keyof typeof emissionFactors.renewableEnergy] || 1;
    const treePlantingMultiplier = emissionFactors.treePlanting[carbonData.environment.treePlanting as keyof typeof emissionFactors.treePlanting] || 1;
    const lightsMultiplier = emissionFactors.lightsOff[carbonData.environment.lightsOff as keyof typeof emissionFactors.lightsOff] || 1;
    const waterMultiplier = emissionFactors.waterUsage[carbonData.environment.waterUsage as keyof typeof emissionFactors.waterUsage] || 1;
    
    const totalMultiplier = recyclingMultiplier * renewableMultiplier * treePlantingMultiplier * lightsMultiplier * waterMultiplier;
    const totalEmissions = baseEmissions * totalMultiplier;
    
    setResult(Math.round(totalEmissions));
  };

  const getCategoryAssessment = (emissions: number) => {
    if (emissions < 4000) return { category: 'Düşük', color: 'leaf', description: 'Tebrikler! Karbon ayak iziniz ortalamanın altında.' };
    if (emissions < 8000) return { category: 'Orta', color: 'earth', description: 'Ortalama seviyedesiniz. Bazı iyileştirmeler yapabilirsiniz.' };
    return { category: 'Yüksek', color: 'destructive', description: 'Karbon ayak izinizi azaltmak için harekete geçme zamanı.' };
  };

  const getTips = () => [
    'Haftada 2-3 gün et tüketmeyerek yıllık 500-800 kg CO₂ tasarruf edebilirsiniz.',
    'Düzenli geri dönüşüm yaparak karbon ayak izinizi %10 azaltabilirsiniz.',
    'Yenilenebilir enerji kullanarak emisyonlarınızı %20 düşürebilirsiniz.',
    'Toplu taşımayı tercih ederek günlük 3-5 kg CO₂ tasarruf edebilirsiniz.',
    'Organik ve yerel gıdalar tercih ederek beslenme kaynaklı emisyonları azaltın.',
    'Su tasarrufu yaparak yıllık 200 kg CO₂ tasarruf edebilirsiniz.',
    'Işık tasarrufu yaparak elektrik tüketiminizi %5-10 azaltın.',
    'Ağaç dikme etkinliklerine katılarak doğaya katkıda bulunun.',
    'Online alışverişi azaltarak kargo kaynaklı emisyonları düşürün.'
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
      consumption: { meatFrequency: '', dailyDiet: '', monthlyPackages: 0 },
      environment: { recycling: '', renewableEnergy: '', treePlanting: '', lightsOff: '', waterUsage: '' },
      transportation: { dailyTransport: '', carKm: 0, publicTransportKm: 0 }
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
          {/* Consumption Habits Step */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="meat-frequency">Haftada ne sıklıkla et tüketiyorsunuz?</Label>
                  <Select 
                    value={carbonData.consumption.meatFrequency} 
                    onValueChange={(value) => setCarbonData({
                      ...carbonData,
                      consumption: { ...carbonData.consumption, meatFrequency: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Et tüketim sıklığınızı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gunluk">Her gün</SelectItem>
                      <SelectItem value="5-6-gun">Haftada 5-6 gün</SelectItem>
                      <SelectItem value="3-4-gun">Haftada 3-4 gün</SelectItem>
                      <SelectItem value="1-2-gun">Haftada 1-2 gün</SelectItem>
                      <SelectItem value="hic">Hiç tüketmem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="daily-diet">Günlük beslenme alışkanlığınız nasıldır?</Label>
                  <Select 
                    value={carbonData.consumption.dailyDiet} 
                    onValueChange={(value) => setCarbonData({
                      ...carbonData,
                      consumption: { ...carbonData.consumption, dailyDiet: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Beslenme tarzınızı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast-food">Çoğunlukla fast food</SelectItem>
                      <SelectItem value="islenmis">İşlenmiş gıdalar</SelectItem>
                      <SelectItem value="evde">Evde yapılan yemekler</SelectItem>
                      <SelectItem value="organik">Organik/yerel gıdalar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="monthly-packages">Ayda kaç kargo alırsınız?</Label>
                  <Input
                    id="monthly-packages"
                    type="number"
                    placeholder="0"
                    value={carbonData.consumption.monthlyPackages || ''}
                    onChange={(e) => setCarbonData({
                      ...carbonData,
                      consumption: { ...carbonData.consumption, monthlyPackages: Number(e.target.value) }
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Environmental Consciousness Step */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="recycling">Geri dönüşüm yapıyor musunuz?</Label>
                  <Select 
                    value={carbonData.environment.recycling} 
                    onValueChange={(value) => setCarbonData({
                      ...carbonData,
                      environment: { ...carbonData.environment, recycling: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Geri dönüşüm durumunuzu seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="evet">Evet, düzenli yapıyorum</SelectItem>
                      <SelectItem value="hayir">Hayır, yapmıyorum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="renewable-energy">Yenilenebilir enerji kaynakları kullanıyor musunuz?</Label>
                  <Select 
                    value={carbonData.environment.renewableEnergy} 
                    onValueChange={(value) => setCarbonData({
                      ...carbonData,
                      environment: { ...carbonData.environment, renewableEnergy: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Yenilenebilir enerji kullanımınızı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="evet">Evet, kullanıyorum</SelectItem>
                      <SelectItem value="hayir">Hayır, kullanmıyorum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lights-off">Odadan çıktığında ışıklarını kapatır mısın?</Label>
                  <Select 
                    value={carbonData.environment.lightsOff} 
                    onValueChange={(value) => setCarbonData({
                      ...carbonData,
                      environment: { ...carbonData.environment, lightsOff: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Işık kullanım alışkanlığınızı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="evet">Evet, her zaman kapatırım</SelectItem>
                      <SelectItem value="hayir">Hayır, genelde açık bırakırım</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tree-planting">Ağaç dikme etkinliklerine katılır mısın?</Label>
                  <Select 
                    value={carbonData.environment.treePlanting} 
                    onValueChange={(value) => setCarbonData({
                      ...carbonData,
                      environment: { ...carbonData.environment, treePlanting: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ağaç dikme etkinliklerine katılımınızı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="evet">Evet, katılıyorum</SelectItem>
                      <SelectItem value="hayir">Hayır, katılmıyorum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="water-usage">Su tüketimini nasıl sağlarsınız?</Label>
                  <Select 
                    value={carbonData.environment.waterUsage} 
                    onValueChange={(value) => setCarbonData({
                      ...carbonData,
                      environment: { ...carbonData.environment, waterUsage: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Su kullanım alışkanlığınızı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tasarruf">Tasarruflu kullanırım</SelectItem>
                      <SelectItem value="normal">Normal kullanırım</SelectItem>
                      <SelectItem value="fazla">Fazla kullanırım</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Transportation Step */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="daily-transport">Günlük ulaşımda hangi araçları kullanıyorsunuz?</Label>
                  <Select 
                    value={carbonData.transportation.dailyTransport} 
                    onValueChange={(value) => setCarbonData({
                      ...carbonData,
                      transportation: { ...carbonData.transportation, dailyTransport: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ana ulaşım aracınızı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="araba">Araba</SelectItem>
                      <SelectItem value="motosiklet">Motosiklet</SelectItem>
                      <SelectItem value="toplu-tasima">Toplu Taşıma</SelectItem>
                      <SelectItem value="bisiklet">Bisiklet</SelectItem>
                      <SelectItem value="yuru">Yürüyüş</SelectItem>
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
                <h4 className="text-lg font-semibold text-foreground mb-3">Kişiselleştirilmiş Öneriler:</h4>
                <div className="grid gap-3 max-h-64 overflow-y-auto">
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