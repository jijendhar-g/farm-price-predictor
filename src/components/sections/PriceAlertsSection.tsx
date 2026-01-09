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
import { Bell, Plus, Trash2, Loader2, TrendingUp, TrendingDown } from "lucide-react";
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
    <section id="alerts" className="py-20 bg-muted/30">
      <div className="container px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-6">
            <Bell className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Price Alerts</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Never Miss a Price Move
          </h2>
          <p className="text-muted-foreground">
            Set alerts to get notified when commodity prices reach your target levels. Sell high, buy low.
          </p>
        </div>

        {/* Create Alert Button */}
        <div className="flex justify-center mb-8">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Price Alert</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Commodity</label>
                  <Select
                    value={formData.commodity_id}
                    onValueChange={(value) => setFormData({ ...formData, commodity_id: value })}
                  >
                    <SelectTrigger>
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
                  <label className="text-sm font-medium mb-2 block">Alert Type</label>
                  <Select
                    value={formData.alert_type}
                    onValueChange={(value) => setFormData({ ...formData, alert_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">
                        <span className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-price-up" />
                          Price goes above
                        </span>
                      </SelectItem>
                      <SelectItem value="below">
                        <span className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-price-down" />
                          Price goes below
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Target Price (₹ per kg)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.threshold_price}
                    onChange={(e) => setFormData({ ...formData, threshold_price: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
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
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : alerts && alerts.length > 0 ? (
          <div className="max-w-2xl mx-auto space-y-4">
            {alerts.map((alert, index) => (
              <Card
                key={alert.id}
                className={cn(
                  "animate-slide-up",
                  !alert.is_active && "opacity-60"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{alert.commodities?.icon || "🌾"}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{alert.commodities?.name}</span>
                        <Badge
                          variant={alert.alert_type === "above" ? "default" : "secondary"}
                          className={cn(
                            "text-xs",
                            alert.alert_type === "above"
                              ? "bg-price-up/10 text-price-up border-price-up/20"
                              : "bg-price-down/10 text-price-down border-price-down/20"
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
                        Target: ₹{alert.threshold_price} per {alert.commodities?.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={alert.is_active}
                      onCheckedChange={(checked) =>
                        toggleAlert.mutate({ id: alert.id, isActive: checked })
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlert.mutate(alert.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No alerts yet. Create your first price alert to get started!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
