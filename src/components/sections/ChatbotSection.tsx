import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2, MessageSquare, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIChat } from "@/hooks/useAIChat";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const quickPrompts = [
  "What's the price of tomatoes?",
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
    <section id="chatbot" className="py-16 bg-muted/30">
      <div className="container px-4">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-primary mb-4">
            <Bot className="h-4 w-4" />
            AI Assistant
          </div>
          <h2 className="section-title">AgriPrice AI Chat</h2>
          <p className="section-description">
            Get instant answers about market prices and farming advice
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="card-elevated overflow-hidden">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AgriPrice AI</h3>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-price-up" />
                    <span className="text-xs text-muted-foreground">Powered by Gemini</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearMessages} className="text-muted-foreground">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Ask me anything about agricultural markets!</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    I can help with prices, predictions, storage tips, and more.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        disabled={isLoading}
                        className="text-left p-3 rounded-lg bg-muted hover:bg-muted/80 text-sm text-foreground transition-colors disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "flex-shrink-0 p-2 h-8 w-8 rounded-lg",
                      message.role === "user"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl px-4 py-3 text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:my-2">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 p-2 h-8 w-8 rounded-lg bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex gap-3">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about prices, predictions, or tips..."
                  className="flex-1 resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[48px] max-h-[120px]"
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  className="btn-primary px-4"
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
