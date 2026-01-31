import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { PriceDashboard } from "@/components/sections/PriceDashboard";
import { PredictionChart } from "@/components/sections/PredictionChart";
import { WeatherSection } from "@/components/sections/WeatherSection";
import { MarketNewsSection } from "@/components/sections/MarketNewsSection";
import { PriceComparisonSection } from "@/components/sections/PriceComparisonSection";
import { ChatbotSection } from "@/components/sections/ChatbotSection";
import { MarketplaceSection } from "@/components/sections/MarketplaceSection";
import { PriceAlertsSection } from "@/components/sections/PriceAlertsSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <PriceDashboard />
        <PredictionChart />
        <WeatherSection />
        <MarketNewsSection />
        <PriceComparisonSection />
        <MarketplaceSection />
        <PriceAlertsSection />
        <FeaturesSection />
        <ChatbotSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
