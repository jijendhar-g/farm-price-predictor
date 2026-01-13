import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, MapPin, Package, Loader2, ShoppingBag, Sparkles, Star } from "lucide-react";
import { useCommodities } from "@/hooks/useCommodities";

interface Listing {
  id: string;
  quantity: number;
  price_per_unit: number;
  location: string;
  description: string | null;
  quality_grade: string | null;
  harvest_date: string | null;
  is_available: boolean;
  created_at: string;
  commodities: { name: string; icon: string | null; unit: string } | null;
}

export function MarketplaceSection() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    commodity_id: "",
    quantity: "",
    price_per_unit: "",
    location: "",
    description: "",
    quality_grade: "A",
  });

  const { data: commodities } = useCommodities();

  const { data: listings, isLoading } = useQuery({
    queryKey: ["marketplace_listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select(`
          *,
          commodities (name, icon, unit)
        `)
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) throw error;
      return data as Listing[];
    },
  });

  const createListing = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to create a listing");

      const { error } = await supabase.from("marketplace_listings").insert({
        seller_id: user.id,
        commodity_id: formData.commodity_id,
        quantity: parseFloat(formData.quantity),
        price_per_unit: parseFloat(formData.price_per_unit),
        location: formData.location,
        description: formData.description || null,
        quality_grade: formData.quality_grade,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Listing created successfully!");
      queryClient.invalidateQueries({ queryKey: ["marketplace_listings"] });
      setIsOpen(false);
      setFormData({
        commodity_id: "",
        quantity: "",
        price_per_unit: "",
        location: "",
        description: "",
        quality_grade: "A",
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createListing.mutate();
  };

  const getGradeColor = (grade: string | null) => {
    switch (grade) {
      case "A+": return "from-amber-400 to-orange-500";
      case "A": return "from-emerald-400 to-teal-500";
      case "B": return "from-blue-400 to-indigo-500";
      default: return "from-slate-400 to-slate-500";
    }
  };

  return (
    <section id="marketplace" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-6">
            <ShoppingBag className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Farmer Marketplace</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">Buy & Sell </span>
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Fresh Produce</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Connect directly with farmers and traders. List your produce or find the best deals in your area.
          </p>
        </div>

        {/* Create Listing Button */}
        <div className="flex justify-center mb-12">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="lg" className="gap-3 shadow-lg shadow-primary/30 px-8">
                <Plus className="h-5 w-5" />
                List Your Produce
                <Sparkles className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Create New Listing</DialogTitle>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Quantity (kg)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 100"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Price per kg (₹)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 45"
                      value={formData.price_per_unit}
                      onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Location</label>
                  <Input
                    placeholder="e.g., Azadpur, Delhi"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Quality Grade</label>
                  <Select
                    value={formData.quality_grade}
                    onValueChange={(value) => setFormData({ ...formData, quality_grade: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">⭐ A+ (Premium)</SelectItem>
                      <SelectItem value="A">🌟 A (Excellent)</SelectItem>
                      <SelectItem value="B">✨ B (Good)</SelectItem>
                      <SelectItem value="C">💫 C (Fair)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Description (optional)</label>
                  <Textarea
                    placeholder="Add details about freshness, harvest date, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full rounded-xl h-12"
                  disabled={createListing.isPending}
                >
                  {createListing.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Listing"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 animate-pulse" />
              <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-emerald-500" />
            </div>
            <p className="text-muted-foreground">Loading marketplace...</p>
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing, index) => (
              <Card
                key={listing.id}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-slide-up bg-card/80 backdrop-blur-sm border-border/50 rounded-2xl overflow-hidden"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Top gradient bar */}
                <div className={`h-1.5 bg-gradient-to-r ${getGradeColor(listing.quality_grade)}`} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {listing.commodities?.icon || "🌾"}
                    </div>
                    <Badge 
                      className={`bg-gradient-to-r ${getGradeColor(listing.quality_grade)} text-white border-0 shadow-lg`}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {listing.quality_grade}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-display">{listing.commodities?.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gradient-primary">
                      ₹{listing.price_per_unit}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      per {listing.commodities?.unit}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="font-medium">{listing.quantity} {listing.commodities?.unit} available</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-secondary" />
                      <span className="truncate">{listing.location}</span>
                    </div>
                  </div>

                  {listing.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 pt-2 border-t border-border/50">
                      {listing.description}
                    </p>
                  )}

                  <Button variant="outline" className="w-full rounded-xl mt-4 hover:bg-primary/5 hover:border-primary/30 hover:text-primary">
                    Contact Seller
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card/50 rounded-3xl border border-border/50">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">No listings available yet.</p>
            <p className="text-sm text-muted-foreground">Be the first to list your produce!</p>
          </div>
        )}
      </div>
    </section>
  );
}
