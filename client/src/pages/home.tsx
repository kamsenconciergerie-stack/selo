import Header from "@/components/header";
import Hero from "@/components/hero";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import { Link } from "wouter";
import { Hammer, Truck, Zap, HardHat, Search, Calendar, CheckCircle } from "lucide-react";
import EquipmentCard from "@/components/equipment-card";
import { SERVICE_AREAS } from "@/lib/constants";

export default function Home() {
  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  // Most demanded equipment in Senegal - prioritize these categories
  const popularEquipmentNames = [
    "Groupe Électrogène Silencieux 20KVA",
    "Marteau-Piqueur Électrique", 
    "Compresseur d'Air Mobile 500L",
    "Motopompe Eau Claire 6 Pouces",
    "Échafaudage Mobile Aluminium",
    "Perceuse à Colonne Professionnelle"
  ];
  
  const featuredEquipment = equipment.filter(eq => 
    eq.name.includes("Groupe Électrogène") || 
    eq.name.includes("Marteau-Piqueur") || 
    eq.name.includes("Compresseur") || 
    eq.name.includes("Motopompe") ||
    eq.name.includes("Échafaudage") ||
    eq.name.includes("Perceuse")
  ).slice(0, 6);

  const categories = [
    {
      name: "🚛 Camion porteur",
      description: "Camions de déménagement et livraison",
      icon: Truck,
      count: equipment.filter(eq => eq.category === "Camion porteur").length,
    },
    {
      name: "🚚 Camion semi-remorque", 
      description: "Tracteurs avec remorques détachables",
      icon: Truck,
      count: equipment.filter(eq => eq.category === "Camion semi-remorque").length,
    },
    {
      name: "🛻 Camionnette / Fourgon",
      description: "Renault Master, Mercedes Sprinter", 
      icon: Truck,
      count: equipment.filter(eq => eq.category === "Camionnette / Fourgon").length,
    },
    {
      name: "🏗️ Camion benne",
      description: "Bennes arrière et basculantes trilatérales",
      icon: Truck,
      count: equipment.filter(eq => eq.category === "Camion benne").length,
    },
    {
      name: "⚡ Équipement Électrique",
      description: "Groupes électrogènes, compresseurs, pompes", 
      icon: Zap,
      count: equipment.filter(eq => eq.category === "Équipement Électrique").length,
    },
    {
      name: "🔨 Outils à Main",
      description: "Marteaux-piqueurs, perceuses, échafaudages",
      icon: Hammer,
      count: equipment.filter(eq => eq.category === "Outils à Main").length,
    },
  ];

  const steps = [
    {
      icon: Search,
      title: "1. Recherchez",
      description: "Trouvez l'équipement dont vous avez besoin parmi notre large catalogue",
      bgColor: "bg-orange-100",
      iconColor: "text-primary-orange",
    },
    {
      icon: Calendar,
      title: "2. Réservez", 
      description: "Sélectionnez vos dates et confirmez votre réservation en ligne",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Truck,
      title: "3. Recevez",
      description: "Nous livrons votre équipement directement sur votre site",
      bgColor: "bg-green-100", 
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      
      {/* Equipment Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos Produits
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} href={`/equipements?category=${encodeURIComponent(category.name)}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="text-primary-orange text-4xl mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-10 w-10" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {category.description}
                      </p>
                      <div className="text-sm text-primary-orange font-medium">
                        {category.count}+ équipements
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Les Plus Populaires
            </h2>
            <p className="text-xl text-gray-600">
              Groupes électrogènes, marteaux-piqueurs, compresseurs et équipements essentiels
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEquipment.map((item) => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link href="/equipements-populaires">
              <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white px-8 py-3 text-lg">
                Les plus populaires
              </Button>
            </Link>
            <Link href="/equipements">
              <Button className="bg-aywa-blue hover:bg-aywa-blue/90 text-white px-8 py-3 text-lg">
                Voir tous les équipements
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Louer votre équipement en 3 étapes simples
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Zones de Service
            </h2>
            <p className="text-xl text-gray-600">
              Nous livrons dans les principales villes du Sénégal
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {SERVICE_AREAS.map((area) => (
                <Card key={area.city} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {area.city}
                      </h3>
                      <p className="text-gray-600">
                        {area.description} {area.cost > 0 && `- ${area.cost.toLocaleString()} XOF`}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </Card>
              ))}
            </div>
            
            <Card className="p-6">
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Carte du Sénégal" 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-center text-gray-600">
                <i className="fas fa-info-circle mr-2"></i>
                Votre ville n'est pas listée ? Contactez-nous pour un devis personnalisé
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
