import { Cloud, Droplets, Wind, Sun, Thermometer, CloudRain, MapPin } from "lucide-react";

// Mock weather data - in production this would come from a weather API
const weatherData = [
  { city: "Delhi", temp: 18, humidity: 65, wind: 12, condition: "Partly Cloudy", impact: "Favorable for storage" },
  { city: "Mumbai", temp: 28, humidity: 78, wind: 8, condition: "Humid", impact: "Risk of spoilage - sell quickly" },
  { city: "Chennai", temp: 30, humidity: 72, wind: 15, condition: "Sunny", impact: "Good transport conditions" },
  { city: "Kolkata", temp: 22, humidity: 70, wind: 10, condition: "Clear", impact: "Ideal market conditions" },
];

const weatherImpacts = [
  { commodity: "Tomato", impact: "Heavy rains expected - prices may rise 15-20%", trend: "up" },
  { commodity: "Onion", impact: "Dry conditions - stable storage, steady prices", trend: "neutral" },
  { commodity: "Potato", impact: "Cool weather extending shelf life", trend: "down" },
  { commodity: "Green Chili", impact: "Heat wave - faster spoilage expected", trend: "up" },
];

function WeatherCard({ city, temp, humidity, wind, condition, impact }: typeof weatherData[0]) {
  return (
    <div className="card-interactive p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{city}</h3>
          <p className="text-sm text-muted-foreground">{condition}</p>
        </div>
        <div className="p-2 rounded-lg bg-accent/20">
          {condition.includes("Rain") ? (
            <CloudRain className="h-6 w-6 text-accent-foreground" />
          ) : condition.includes("Cloud") ? (
            <Cloud className="h-6 w-6 text-accent-foreground" />
          ) : (
            <Sun className="h-6 w-6 text-accent-foreground" />
          )}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-bold text-foreground">{temp}°</span>
        <span className="text-sm text-muted-foreground">C</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Droplets className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">{humidity}%</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Wind className="h-4 w-4 text-secondary" />
          <span className="text-muted-foreground">{wind} km/h</span>
        </div>
      </div>
      
      <div className="pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">{impact}</p>
      </div>
    </div>
  );
}

export function WeatherSection() {
  return (
    <section id="weather" className="py-16">
      <div className="container px-4">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-accent mb-4">
            <Cloud className="h-4 w-4" />
            Weather Impact
          </div>
          <h2 className="section-title">Weather & Price Forecast</h2>
          <p className="section-description">
            See how weather conditions affect commodity prices across major markets
          </p>
          <div className="flex justify-center items-center gap-2 mt-4">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Live data from major Indian cities</span>
          </div>
        </div>

        {/* Weather Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {weatherData.map((weather) => (
            <WeatherCard key={weather.city} {...weather} />
          ))}
        </div>

        {/* Price Impact Alerts */}
        <div className="max-w-3xl mx-auto">
          <h3 className="font-semibold text-lg text-foreground mb-4 text-center">Weather-Based Price Alerts</h3>
          <div className="space-y-3">
            {weatherImpacts.map((item) => (
              <div key={item.commodity} className="card-interactive p-4 flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  item.trend === "up" ? "bg-price-up/10" : 
                  item.trend === "down" ? "bg-price-down/10" : "bg-price-neutral/10"
                }`}>
                  <Thermometer className={`h-5 w-5 ${
                    item.trend === "up" ? "text-price-up" : 
                    item.trend === "down" ? "text-price-down" : "text-price-neutral"
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.commodity}</p>
                  <p className="text-sm text-muted-foreground">{item.impact}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.trend === "up" ? "bg-price-up/10 text-price-up" : 
                  item.trend === "down" ? "bg-price-down/10 text-price-down" : "bg-price-neutral/10 text-price-neutral"
                }`}>
                  {item.trend === "up" ? "↑ Rising" : item.trend === "down" ? "↓ Falling" : "→ Stable"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
