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
import { Plus, MapPin, Package, Loader2, ShoppingBag } from "lucide-react";
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

  return (
    <section id="marketplace" className="py-20">
      <div className="container px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-6">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Farmer Marketplace</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Buy & Sell Fresh Produce
          </h2>
          <p className="text-muted-foreground">
            Connect directly with farmers and traders. List your produce or find the best deals in your area.
          </p>
        </div>

        {/* Create Listing Button */}
        <div className="flex justify-center mb-8">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                List Your Produce
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Listing</DialogTitle>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Quantity (kg)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 100"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price per kg (₹)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 45"
                      value={formData.price_per_unit}
                      onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="e.g., Azadpur, Delhi"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Quality Grade</label>
                  <Select
                    value={formData.quality_grade}
                    onValueChange={(value) => setFormData({ ...formData, quality_grade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+ (Premium)</SelectItem>
                      <SelectItem value="A">A (Excellent)</SelectItem>
                      <SelectItem value="B">B (Good)</SelectItem>
                      <SelectItem value="C">C (Fair)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description (optional)</label>
                  <Textarea
                    placeholder="Add details about freshness, harvest date, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
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
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((listing, index) => (
              <Card
                key={listing.id}
                className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{listing.commodities?.icon || "🌾"}</div>
                    <Badge variant={listing.quality_grade === "A+" ? "default" : "secondary"}>
                      Grade {listing.quality_grade}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{listing.commodities?.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ₹{listing.price_per_unit}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      per {listing.commodities?.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{listing.quantity} {listing.commodities?.unit} available</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{listing.location}</span>
                  </div>

                  {listing.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {listing.description}
                    </p>
                  )}

                  <Button variant="outline" className="w-full mt-2">
                    Contact Seller
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No listings available yet. Be the first to list!</p>
          </div>
        )}
      </div>
    </section>
  );
}
