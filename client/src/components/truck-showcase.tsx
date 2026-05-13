import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Fuel, Weight, Zap } from "lucide-react";
import { formatPrice } from "@/lib/constants";

export function TruckShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: equipment = [] } = useQuery({
    queryKey: ['/api/equipment'],
  });

  // Filter truck categories
  const truckCategories = [
    "Véhicules de tourisme",
    "Bus",
    "4/4 tout terrain",
    "Mini Bus",
    "Pick up",
    "Berlines"
  ];

  const trucks = equipment.filter((item: any) => 
    truckCategories.includes(item.category)
  );

  const filteredTrucks = selectedCategory 
    ? trucks.filter((truck: any) => truck.category === selectedCategory)
    : trucks;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Véhicules de tourisme": return "🚗";
      case "Bus": return "🚌";
      case "4/4 tout terrain": return "🚙";
      case "Mini Bus": return "🚐";
      case "Pick up": return "🛻";
      case "Berlines": return "🚘";
      default: return "🚗";
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "Véhicules de tourisme": return "Voitures citadines et SUV pour vos déplacements";
      case "Bus": return "Voyagez en groupe jusqu'à plus de 60 personnes";
      case "4/4 tout terrain": return "Affrontez les routes les plus périlleuses";
      case "Mini Bus": return "Déplacements en petit comité";
      case "Pick up": return "Véhicules robustes pour tous terrains";
      case "Berlines": return "Confort et élégance pour vos déplacements";
      default: return "";
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-kamsen-blue mb-4">
            🚗 Notre Flotte de Véhicules
          </h2>
          <p className="text-lg text-kamsen-gray max-w-3xl mx-auto">
            Location de voitures, SUV, bus et berlines au Sénégal. 
            Trouvez le véhicule idéal pour vos déplacements professionnels ou personnels.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            Tous les véhicules
          </Button>
          {truckCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="flex items-center gap-2"
            >
              <span>{getCategoryIcon(category)}</span>
              {category}
            </Button>
          ))}
        </div>

        {/* Category Cards */}
        {!selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {truckCategories.map((category) => (
              <Card 
                key={category} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-200"
                onClick={() => setSelectedCategory(category)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{getCategoryIcon(category)}</div>
                  <CardTitle className="text-lg">{category}</CardTitle>
                  <CardDescription className="text-sm">
                    {getCategoryDescription(category)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="secondary">
                    {trucks.filter((t: any) => t.category === category).length} disponibles
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrucks.map((truck: any) => (
            <Card key={truck.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative bg-kamsen-blue-light">
                <img
                  src={truck.image_url}
                  alt={truck.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500';
                  }}
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-blue-600">
                    {getCategoryIcon(truck.category)} {truck.category}
                  </Badge>
                </div>
                {truck.is_available && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-600">Disponible</Badge>
                  </div>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{truck.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {truck.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{truck.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <span>{truck.weight}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span>{truck.power}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span>{truck.fuel_type || 'Diesel'}</span>
                  </div>
                </div>
                
                {truck.specifications && truck.specifications.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Caractéristiques :</h4>
                    <div className="flex flex-wrap gap-1">
                      {truck.specifications.slice(0, 3).map((spec: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {truck.specifications.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{truck.specifications.length - 3} autres
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-2xl font-bold text-kamsen-blue">
                    {formatPrice(truck.price_per_day)}/jour
                  </div>
                  <Button>
                    Réserver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrucks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-kamsen-gray">Aucun véhicule disponible dans cette catégorie.</p>
          </div>
        )}
      </div>
    </section>
  );
}