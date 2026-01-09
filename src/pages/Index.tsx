import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { PriceDashboard } from "@/components/sections/PriceDashboard";
import { PredictionChart } from "@/components/sections/PredictionChart";
import { ChatbotSection } from "@/components/sections/ChatbotSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { MarketplaceSection } from "@/components/sections/MarketplaceSection";
import { PriceAlertsSection } from "@/components/sections/PriceAlertsSection";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <PriceDashboard />
        <PredictionChart />
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
