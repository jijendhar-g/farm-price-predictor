import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Sparkles, RefreshCw, Languages, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIChat } from "@/hooks/useAIChat";
import { toast } from "sonner";

const quickPrompts = [
  "What's the price of tomatoes today?",
  "Predict onion prices for next week",
  "Best time to sell potatoes?",
  "Give me market insights",
];

export function ChatbotSection() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useAIChat();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim() || isLoading) return;

    setInputValue("");
    await sendMessage(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section id="chatbot" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-gradient-primary">AI-Powered Assistant</span>
            <Zap className="h-4 w-4 text-secondary animate-pulse" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">Your </span>
            <span className="text-gradient-primary">AI Market</span>
            <span className="text-foreground"> Assistant</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Ask questions in natural language. Get real-time prices, predictions, and expert advice powered by advanced AI.
          </p>
        </div>

        {/* Chatbot Container */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-card/90 backdrop-blur-xl rounded-3xl border border-primary/10 shadow-2xl shadow-primary/5 overflow-hidden">
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-50 blur-sm -z-10" />
            
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
              <div className="flex items-center gap-4">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg shadow-primary/30 animate-glow-pulse">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">AgriPrice AI</h3>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-price-up opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-price-up" />
                    </span>
                    <span className="text-xs text-muted-foreground">Online • Powered by Gemini AI</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={clearMessages} title="Clear chat" className="hover:bg-primary/10 rounded-xl">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-secondary/10 rounded-xl">
                  <Languages className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="h-[450px] overflow-y-auto p-6 space-y-4">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-lg">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-gradient-to-br from-muted to-muted/50 text-foreground px-5 py-4 text-sm shadow-md">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      <span className="text-2xl">👋</span> Hello! I'm your <span className="font-bold text-primary">AgriPrice AI Assistant</span>. I can help you with:

• 📊 Current vegetable prices from mandis
• 🔮 AI-powered price predictions
• 💡 Storage and selling tips
• 📈 Market insights and trends

How can I assist you today?
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-4 animate-fade-in",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-lg",
                      message.role === "user"
                        ? "bg-gradient-secondary"
                        : "bg-gradient-primary"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-5 py-4 text-sm shadow-md",
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-sm"
                        : "bg-gradient-to-br from-muted to-muted/50 text-foreground rounded-tl-sm"
                    )}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-lg">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="bg-gradient-to-br from-muted to-muted/50 rounded-2xl rounded-tl-sm px-5 py-4 shadow-md">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2.5 h-2.5 bg-secondary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2.5 h-2.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-6 py-4 border-t border-border/50 bg-gradient-to-r from-muted/30 via-transparent to-muted/30">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className="flex-shrink-0 px-4 py-2 text-xs font-semibold text-muted-foreground bg-card/80 backdrop-blur-sm border border-border/50 rounded-full hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-50 shadow-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="px-6 py-5 border-t border-border/50 bg-card/50">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about prices, predictions, or get advice..."
                    className="w-full resize-none rounded-2xl border border-border/50 bg-muted/30 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 min-h-[56px] max-h-[120px] placeholder:text-muted-foreground/60 transition-all"
                    rows={1}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  className="h-14 w-14 rounded-2xl shadow-lg shadow-primary/30"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
