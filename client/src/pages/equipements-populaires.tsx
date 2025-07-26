import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Truck, Tractor, Wrench, MapPin, Calendar, Fuel, Zap } from "lucide-react";
import type { Equipment } from "@shared/schema";

export default function EquipementsPopulaires() {
  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  // Équipements les plus populaires selon les spécifications
  const popularEquipmentNames = [
    "Tracteur 75 CV",
    "Tracteur 90 CV", 
    "Charrue 2 socs",
    "Charrue 3 socs",
    "Motopompe thermique",
    "Camion benne 20 T",
    "Camion benne 30 T",
    "Pulvérisateur motorisé",
    "Semoir mécanique",
    "Billonneuse",
    "Camion plateau 10 T",
    "Camion plateau 20 T",
    "Pick-up 4x4 double cabine",
    "Décortiqueuse à riz",
    "Décortiqueuse à arachide"
  ];

  const popularEquipment = equipment.filter(eq => 
    popularEquipmentNames.some(name => eq.name === name)
  );

  const getCategoryIcon = (category: string) => {
    if (category.includes("Tracteur")) return <Tractor className="h-5 w-5" />;
    if (category.includes("Camion")) return <Truck className="h-5 w-5" />;
    return <Wrench className="h-5 w-5" />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des équipements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-aywa-blue to-primary-orange text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Équipements les Plus Populaires
            </h1>
            <p className="text-xl lg:text-2xl mb-6 opacity-90">
              Découvrez notre sélection des équipements les plus demandés au Sénégal
            </p>
            <div className="flex items-center justify-center gap-4 text-lg">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span>Disponibles immédiatement</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Livraison rapide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Equipment Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Notre Top {popularEquipment.length} des Équipements
            </h2>
            <p className="text-xl text-gray-600">
              Ces équipements représentent 80% de nos locations au Sénégal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularEquipment.map((item) => (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary-orange text-white">
                      Populaire
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                      {getCategoryIcon(item.category)}
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-primary-orange transition-colors">
                    {item.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {/* Spécifications */}
                  {item.specifications && item.specifications.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">Spécifications :</h4>
                      <div className="flex flex-wrap gap-1">
                        {item.specifications.slice(0, 3).map((spec, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {item.specifications.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.specifications.length - 3} autres
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Détails techniques */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {item.power && (
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{item.power}</span>
                      </div>
                    )}
                    {item.fuelType && item.fuelType !== "N/A" && (
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{item.fuelType}</span>
                      </div>
                    )}
                  </div>

                  {/* Prix et disponibilité */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary-orange">
                          {formatPrice(item.pricePerDay)} FCFA
                        </p>
                        <p className="text-sm text-gray-500">par jour</p>
                      </div>
                      <div className="text-right">
                        {item.isAvailable ? (
                          <Badge className="bg-green-100 text-green-800">
                            Disponible
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            Indisponible
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/equipements/${item.id}`} className="flex-1">
                        <Button className="w-full bg-kamsen-blue hover:bg-kamsen-blue/90">
                          Voir détails
                        </Button>
                      </Link>
                      <Link href="/contact" className="flex-1">
                        <Button variant="outline" className="w-full border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white">
                          Réserver
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-kamsen-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Besoin d'un équipement spécifique ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Notre équipe vous conseille et vous propose les meilleures solutions pour vos projets
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/equipements">
              <Button size="lg" variant="secondary" className="bg-white text-kamsen-blue hover:bg-gray-100">
                Voir tous les équipements
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-kamsen-blue">
                Demander un devis
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}