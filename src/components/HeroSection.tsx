import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Globe, Calculator, TrendingDown } from 'lucide-react';
import heroImage from '@/assets/hero-earth.jpg';

interface HeroSectionProps {
  onStartCalculation: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartCalculation }) => {
  const features = [
    {
      icon: Calculator,
      title: 'Kolay Hesaplama',
      description: 'Birkaç basit soruyla karbon ayak izinizi hesaplayın'
    },
    {
      icon: TrendingDown,
      title: 'Azaltma Önerileri',
      description: 'Kişiselleştirilmiş çevre dostu öneriler alın'
    },
    {
      icon: Globe,
      title: 'Çevre Bilinci',
      description: 'Gezegenimizi korumak için attığınız adımları izleyin'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-nature relative overflow-hidden">
      {/* Hero Image Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Hero Content */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-sky/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Leaf className="w-5 h-5 text-forest" />
              <span className="text-sm font-medium text-forest">Sürdürülebilir Gelecek</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Karbon Ayak İzinizi
              <span className="block bg-gradient-to-r from-leaf to-ocean bg-clip-text text-transparent">
                Keşfedin
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Çevre dostu yaşam tarzınızı ölçün ve gezegenimizi korumak için 
              somut adımlar atın. Birkaç dakikada karbon ayak izinizi hesaplayın.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={onStartCalculation}
                className="text-lg px-8 py-4 shadow-nature"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Hemen Hesapla
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              >
                Daha Fazla Bilgi
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-white/10 backdrop-blur-md border-white/20 shadow-nature hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
                >
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-leaf/20 rounded-lg mb-4">
                      <Icon className="w-6 h-6 text-leaf" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { number: '2.4M+', label: 'Hesaplanan Ayak İzi' },
              { number: '15%', label: 'Ortalama Azalma' },
              { number: '50+', label: 'Azaltma Önerisi' },
              { number: '24/7', label: 'Erişilebilir' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-white/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-3 h-3 bg-leaf rounded-full opacity-60" />
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-2 h-2 bg-ocean rounded-full opacity-60" />
      </div>
      <div className="absolute bottom-40 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-4 h-4 bg-sky rounded-full opacity-40" />
      </div>
    </div>
  );
};

export default HeroSection;