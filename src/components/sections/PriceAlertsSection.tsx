import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Bell, Plus, Trash2, Loader2, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { useCommodities } from "@/hooks/useCommodities";
import { cn } from "@/lib/utils";

interface PriceAlert {
  id: string;
  alert_type: string;
  threshold_price: number;
  is_active: boolean;
  created_at: string;
  triggered_at: string | null;
  commodities: { name: string; icon: string | null; unit: string } | null;
}

export function PriceAlertsSection() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    commodity_id: "",
    alert_type: "above",
    threshold_price: "",
  });

  const { data: commodities } = useCommodities();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ["price_alerts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("price_alerts")
        .select(`
          *,
          commodities (name, icon, unit)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PriceAlert[];
    },
  });

  const createAlert = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to create an alert");

      const { error } = await supabase.from("price_alerts").insert({
        user_id: user.id,
        commodity_id: formData.commodity_id,
        alert_type: formData.alert_type,
        threshold_price: parseFloat(formData.threshold_price),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Price alert created!");
      queryClient.invalidateQueries({ queryKey: ["price_alerts"] });
      setIsOpen(false);
      setFormData({ commodity_id: "", alert_type: "above", threshold_price: "" });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const toggleAlert = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("price_alerts")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price_alerts"] });
    },
    onError: () => {
      toast.error("Failed to update alert");
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("price_alerts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Alert deleted");
      queryClient.invalidateQueries({ queryKey: ["price_alerts"] });
    },
    onError: () => {
      toast.error("Failed to delete alert");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAlert.mutate();
  };

  return (
    <section id="alerts" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />

      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-6">
            <Bell className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Smart Alerts</span>
            <Zap className="h-4 w-4 text-orange-500" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">Never Miss a </span>
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Price Move</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Set alerts to get notified when commodity prices reach your target levels. Sell high, buy low.
          </p>
        </div>

        {/* Create Alert Button */}
        <div className="flex justify-center mb-12">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="lg" className="gap-3 shadow-lg shadow-primary/30 px-8">
                <Plus className="h-5 w-5" />
                Create Alert
                <Bell className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Create Price Alert</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Commodity</label>
                  <Select
                    value={formData.commodity_id}
                    onValueChange={(value) => setFormData({ ...formData, commodity_id: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select commodity" />
                    </SelectTrigger>
                    <SelectContent>
                      {commodities?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.icon} {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Alert Type</label>
                  <Select
                    value={formData.alert_type}
                    onValueChange={(value) => setFormData({ ...formData, alert_type: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">
                        <span className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                          Price goes above
                        </span>
                      </SelectItem>
                      <SelectItem value="below">
                        <span className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-rose-500" />
                          Price goes below
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Target Price (₹ per kg)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.threshold_price}
                    onChange={(e) => setFormData({ ...formData, threshold_price: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full rounded-xl h-12"
                  disabled={createAlert.isPending}
                >
                  {createAlert.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Alert"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alerts List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 animate-pulse" />
              <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-amber-500" />
            </div>
            <p className="text-muted-foreground">Loading alerts...</p>
          </div>
        ) : alerts && alerts.length > 0 ? (
          <div className="max-w-2xl mx-auto space-y-4">
            {alerts.map((alert, index) => (
              <Card
                key={alert.id}
                className={cn(
                  "animate-slide-up bg-card/80 backdrop-blur-sm rounded-2xl border-border/50 overflow-hidden transition-all duration-300 hover:shadow-lg",
                  !alert.is_active && "opacity-60"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Top gradient line based on alert type */}
                <div className={cn(
                  "h-1",
                  alert.alert_type === "above" 
                    ? "bg-gradient-to-r from-emerald-400 to-teal-500" 
                    : "bg-gradient-to-r from-rose-400 to-pink-500"
                )} />
                
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{alert.commodities?.icon || "🌾"}</div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-display font-bold text-lg">{alert.commodities?.name}</span>
                        <Badge
                          className={cn(
                            "text-xs font-semibold border-0",
                            alert.alert_type === "above"
                              ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600"
                              : "bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-600"
                          )}
                        >
                          {alert.alert_type === "above" ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {alert.alert_type === "above" ? "Above" : "Below"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Target: <span className="font-bold text-foreground">₹{alert.threshold_price}</span> per {alert.commodities?.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Switch
                      checked={alert.is_active}
                      onCheckedChange={(checked) =>
                        toggleAlert.mutate({ id: alert.id, isActive: checked })
                      }
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-secondary"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlert.mutate(alert.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card/50 rounded-3xl border border-border/50 max-w-2xl mx-auto">
            <Bell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">
              No alerts yet.
            </p>
            <p className="text-sm text-muted-foreground">Create your first price alert to get started!</p>
          </div>
        )}
      </div>
    </section>
  );
}
