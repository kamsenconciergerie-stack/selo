import Header from "@/components/header";
import Hero from "@/components/hero";
import Footer from "@/components/footer";
import Chatbot from "@/components/chatbot";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import { Link } from "wouter";
import { Car, Bus, Truck, Zap, Search, Calendar, CheckCircle, Users } from "lucide-react";
import EquipmentCard from "@/components/equipment-card";
import { SERVICE_AREAS } from "@/lib/constants";
import SEOContent from "@/components/seo-content";

export default function Home() {
  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  // Featured vehicles from SELOV categories
  const featuredEquipment = equipment.slice(0, 8);

  const categories = [
    {
      name: "Véhicules de tourisme",
      description: "Citadines, SUV et voitures confortables pour tous vos trajets",
      icon: Car,
      emoji: "🚗",
      count: equipment.filter(eq => eq.category === "Véhicules de tourisme").length,
    },
    {
      name: "Bus",
      description: "Transport de groupe, voyages et événements jusqu'à 60 personnes",
      icon: Bus,
      emoji: "🚌",
      count: equipment.filter(eq => eq.category === "Bus").length,
    },
    {
      name: "4/4 tout terrain",
      description: "Affrontez les pistes les plus difficiles en toute sécurité",
      icon: Truck,
      emoji: "🚙",
      count: equipment.filter(eq => eq.category === "4/4 tout terrain").length,
    },
    {
      name: "Mini Bus",
      description: "Minibus pour groupes réduits, transferts et excursions",
      icon: Users,
      emoji: "🚐",
      count: equipment.filter(eq => eq.category === "Mini Bus").length,
    },
    {
      name: "Pick up",
      description: "Véhicules robustes pour le transport et les terrains variés",
      icon: Truck,
      emoji: "🛻",
      count: equipment.filter(eq => eq.category === "Pick up").length,
    },
    {
      name: "Berlines",
      description: "Élégance et confort pour vos déplacements professionnels",
      icon: Car,
      emoji: "🚘",
      count: equipment.filter(eq => eq.category === "Berlines").length,
    },
  ];

  const steps = [
    {
      icon: Search,
      title: "1. Choisissez",
      description: "Sélectionnez votre véhicule parmi notre large flotte disponible partout au Sénégal",
      bgColor: "bg-kamsen-blue-light",
      iconColor: "text-kamsen-blue",
    },
    {
      icon: Calendar,
      title: "2. Réservez", 
      description: "Choisissez vos dates, votre ville et confirmez votre réservation en quelques clics",
      bgColor: "bg-kamsen-blue-light",
      iconColor: "text-kamsen-blue",
    },
    {
      icon: Car,
      title: "3. Prenez la route",
      description: "Votre véhicule est livré à l'adresse de votre choix ou récupéré en agence",
      bgColor: "bg-kamsen-blue-light", 
      iconColor: "text-kamsen-blue",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      

      {/* Equipment Categories */}
      <section className="py-16 bg-kamsen-blue-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kamsen-blue mb-4">
              Nos Catégories de Véhicules
            </h2>
            <p className="text-xl text-kamsen-gray max-w-3xl mx-auto">
              Une flotte complète pour tous vos besoins — déplacements, événements ou missions terrain
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} href={`/equipements?category=${encodeURIComponent(category.name)}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105 border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-kamsen-blue-light p-4 rounded-full">
                          <span className="text-3xl">{category.emoji}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-center mb-2 group-hover:text-orange-600">
                        {category.name}
                      </h3>
                      <p className="text-kamsen-gray text-sm text-center mb-3">
                        {category.description}
                      </p>
                      <div className="text-center">
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          {category.count > 0 ? `${category.count} véhicule${category.count > 1 ? 's' : ''} disponible${category.count > 1 ? 's' : ''}` : 'Bientôt disponible'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Equipment */}
      <section className="py-16 bg-kamsen-blue-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kamsen-blue mb-4">
              Véhicules les Plus Demandés
            </h2>
            <p className="text-xl text-kamsen-gray">
              Les voitures, 4x4 et bus les plus réservés par nos clients au Sénégal
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredEquipment.map((item) => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
            </div>
          )}
          
          <div className="flex justify-center mt-12">
            <Link href="/equipements">
              <Button className="bg-kamsen-blue hover:bg-kamsen-blue/90 text-white px-8 py-3 text-lg">
                Voir tous nos véhicules
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Package Examples Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kamsen-blue mb-4">
              Nos Forfaits les Plus Populaires
            </h2>
            <p className="text-xl text-kamsen-gray">
              Des solutions sur mesure pour tous vos besoins de déplacement au Sénégal
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-kamsen-blue/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Car className="h-6 w-6 text-kamsen-blue" />
                </div>
                <h3 className="text-xl font-semibold text-kamsen-blue mb-3">
                  Berline avec chauffeur → pour séminaires et réunions d'affaires
                </h3>
                <p className="text-kamsen-gray">
                  Arrivez en toute élégance à vos rendez-vous professionnels avec un chauffeur attitré pour la journée.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-kamsen-blue-light w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Bus className="h-6 w-6 text-kamsen-blue" />
                </div>
                <h3 className="text-xl font-semibold text-kamsen-blue mb-3">
                  Mini Bus ou Bus → pour excursions et sorties scolaires
                </h3>
                <p className="text-kamsen-gray">
                  Transport confortable et sécurisé pour vos groupes, avec chauffeur expérimenté inclus.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-kamsen-blue-light w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-kamsen-blue" />
                </div>
                <h3 className="text-xl font-semibold text-kamsen-blue mb-3">
                  4x4 tout terrain → pour missions terrain et zones reculées
                </h3>
                <p className="text-kamsen-gray">
                  Idéal pour les missions ONG, prospections minières ou déplacements dans des zones difficiles d'accès.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-kamsen-blue mb-3">
                  Pick-up double cabine → pour chantiers et travaux
                </h3>
                <p className="text-kamsen-gray">
                  Robustesse et polyvalence pour vos équipes sur le terrain, avec possibilité de personnalisation.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/contact">
              <Button className="bg-kamsen-blue hover:bg-kamsen-blue/90 text-white px-8 py-3 text-lg">
                Demander un devis personnalisé
              </Button>
            </Link>
          </div>
        </div>
      </section>



      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kamsen-blue mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-kamsen-gray">
              Louez votre véhicule en 3 étapes simples
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="text-center">
                  <div className={`${step.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Icon className={`h-8 w-8 ${step.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-kamsen-blue mb-4">
                    {step.title}
                  </h3>
                  <p className="text-kamsen-gray">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kamsen-blue mb-4">
              Disponibles Partout au Sénégal
            </h2>
            <p className="text-xl text-kamsen-gray">
              Livraison ou retrait de votre véhicule dans les principales villes
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {SERVICE_AREAS.map((area) => (
                <Card key={area.city} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-kamsen-blue">
                        {area.city}
                      </h3>
                      <p className="text-kamsen-gray">
                        {area.description}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-kamsen-blue" />
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Carte du Sénégal" 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <p className="text-kamsen-gray mb-4">
                Votre ville n'est pas listée ?
              </p>
              <div className="mb-4">
                <p className="text-kamsen-blue font-semibold text-lg mb-2">Appelez-nous directement :</p>
                <a href="tel:+221710188989" className="text-kamsen-blue font-bold text-2xl hover:text-kamsen-orange transition-colors">+221 71 018 89 89</a>
              </div>
              <Link href="/contact">
                <Button className="bg-kamsen-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Demandez un devis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <SEOContent />

      <Footer />
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
