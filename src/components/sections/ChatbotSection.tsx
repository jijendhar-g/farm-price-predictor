import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Sparkles, Mic, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: "bot",
    content: "👋 Hello! I'm your AgriPrice AI Assistant. I can help you with:\n\n• Current vegetable prices\n• Price predictions and trends\n• Storage and selling tips\n• Market insights\n\nHow can I assist you today?",
    timestamp: new Date(),
  },
];

const quickPrompts = [
  "What's the price of tomatoes today?",
  "Predict onion prices for next week",
  "Best time to sell potatoes?",
  "Give me market insights",
];

export function ChatbotSection() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponses: { [key: string]: string } = {
        "tomato": "🍅 **Current Tomato Prices**\n\n• Local Market: ₹45.50/kg\n• Wholesale: ₹38.00/kg\n• Retail: ₹52.00/kg\n\n📈 **Trend**: Prices are expected to rise by 8% over the next week due to seasonal demand.\n\n💡 **Tip**: Consider selling within 3-4 days for best returns.",
        "onion": "🧅 **Onion Market Update**\n\n• Current Price: ₹32.00/kg\n• Weekly Change: -7.25%\n\n📊 **Prediction**: Our LSTM model forecasts prices to stabilize around ₹35/kg next week.\n\n⚠️ **Advisory**: Storage conditions are crucial. Maintain cool, dry conditions to prevent spoilage.",
        "predict": "📈 **Price Prediction Summary**\n\n| Commodity | Current | Next Week |\n|-----------|---------|----------|\n| Tomato | ₹45.50 | ₹49.00 (+7.7%) |\n| Onion | ₹32.00 | ₹35.00 (+9.4%) |\n| Potato | ₹28.75 | ₹31.00 (+7.8%) |\n\n🎯 Model Confidence: 95.2%",
        "potato": "🥔 **Potato Market Analysis**\n\n• Current Price: ₹28.75/kg\n• 30-Day Average: ₹27.50/kg\n\n📅 **Best Selling Time**: Based on historical data, prices peak in mid-monsoon season. Consider holding stock if storage permits.",
        "market": "📊 **Market Insights - Today**\n\n✅ **Bullish**: Green Chili (+16.4%), Tomato (+7.6%)\n🔻 **Bearish**: Cabbage (-5.1%), Onion (-7.3%)\n➡️ **Stable**: Carrot, Potato\n\n🌦️ **Weather Impact**: Upcoming rain may affect supply chains in southern regions.\n\n💰 **Tip**: Diversify your crops to hedge against price volatility.",
      };

      let response = "I understand you're asking about agricultural prices. Let me help you with specific information. Try asking about:\n\n• Specific vegetable prices (tomato, onion, potato)\n• Price predictions\n• Market insights\n• Storage tips";

      const lowerText = messageText.toLowerCase();
      if (lowerText.includes("tomato")) response = botResponses.tomato;
      else if (lowerText.includes("onion")) response = botResponses.onion;
      else if (lowerText.includes("predict")) response = botResponses.predict;
      else if (lowerText.includes("potato")) response = botResponses.potato;
      else if (lowerText.includes("market") || lowerText.includes("insight")) response = botResponses.market;

      const botMessage: Message = {
        id: Date.now(),
        type: "bot",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section id="chatbot" className="py-20 bg-muted/30">
      <div className="container px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">NLP-Powered</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            AI Market Assistant
          </h2>
          <p className="text-muted-foreground">
            Ask questions in natural language. Get real-time prices, predictions, and expert advice powered by advanced NLP.
          </p>
        </div>

        {/* Chatbot Container */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-primary/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">AgriPrice AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-2 w-2 rounded-full bg-price-up animate-pulse" />
                    <span className="text-xs text-muted-foreground">Online • Multilingual</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="iconSm">
                  <Languages className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="h-[400px] overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 animate-fade-in",
                    message.type === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      message.type === "user"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-gradient-primary text-primary-foreground"
                    )}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                      message.type === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <p
                      className={cn(
                        "text-[10px] mt-2 opacity-60",
                        message.type === "user" ? "text-right" : ""
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-6 py-3 border-t border-border bg-muted/30">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(prompt)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-card border border-border rounded-full hover:border-primary/30 hover:text-foreground transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 border-t border-border">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about prices, predictions, or get advice..."
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[48px] max-h-[120px]"
                    rows={1}
                  />
                  <Button
                    variant="ghost"
                    size="iconSm"
                    className="absolute right-2 bottom-2 text-muted-foreground hover:text-foreground"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="hero"
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
