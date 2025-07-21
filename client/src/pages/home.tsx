import Header from "@/components/header";
import Hero from "@/components/hero";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import { Link } from "wouter";
import { Hammer, Truck, Zap, HardHat, Search, Calendar, CheckCircle, Phone, Star } from "lucide-react";
import EquipmentCard from "@/components/equipment-card";
import { SERVICE_AREAS } from "@/lib/constants";

export default function Home() {
  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  // Most demanded equipment in Senegal - exact popular equipment list
  const getPopularEquipment = () => {
    const popularCategories = [
      // Tracteur 75–90 CV
      { names: ["Tracteur 75 CV", "Tracteur 90 CV"], displayName: "Tracteur 75–90 CV" },
      // Charrue 2–3 socs  
      { names: ["Charrue 2 socs", "Charrue 3 socs"], displayName: "Charrue 2–3 socs" },
      // Motopompe thermique
      { names: ["Motopompe thermique"], displayName: "Motopompe thermique" },
      // Camion benne 20–30 T
      { names: ["Camion benne 20 T", "Camion benne 30 T"], displayName: "Camion benne 20–30 T" },
      // Pulvérisateur motorisé
      { names: ["Pulvérisateur motorisé"], displayName: "Pulvérisateur motorisé" },
      // Semoir mécanique
      { names: ["Semoir mécanique"], displayName: "Semoir mécanique" },
      // Billonneuse / butteuse
      { names: ["Billonneuse", "Butteuse"], displayName: "Billonneuse / butteuse" },
      // Camion plateau 10–20 T
      { names: ["Camion plateau 10 T", "Camion plateau 20 T"], displayName: "Camion plateau 10–20 T" },
      // Pick-up 4x4 double cabine
      { names: ["Pick-up 4x4 double cabine"], displayName: "Pick-up 4x4 double cabine" },
      // Décortiqueuse (riz, arachide)
      { names: ["Décortiqueuse à riz", "Décortiqueuse à arachide"], displayName: "Décortiqueuse (riz, arachide)" }
    ];

    const popularEquipment = [];
    
    for (const category of popularCategories) {
      // Find first available equipment from each category
      const foundEquipment = equipment.find(eq => 
        category.names.some(name => eq.name === name)
      );
      if (foundEquipment) {
        popularEquipment.push(foundEquipment);
      }
    }
    
    return popularEquipment;
  };
  
  const featuredEquipment = getPopularEquipment();

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
      
      {/* Bannière Promo Magal de Touba 2025 - Version Créative */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 py-6 px-4 shadow-2xl border-b-4 border-orange-700">

        
        {/* Motifs décoratifs orange/bleu */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full transform -translate-x-16 -translate-y-16"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full transform translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full transform translate-y-10"></div>
          <div className="absolute bottom-0 right-1/3 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full transform translate-y-8"></div>
        </div>
        
        {/* Contenu principal */}
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Section gauche - Message principal */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                <div className="bg-blue-500/30 backdrop-blur-sm p-3 rounded-full border border-blue-400/60 magal-banner-float shadow-lg">
                  <span className="text-3xl">🕌</span>
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg magal-banner-shimmer">
                  ÉVÉNEMENT SPÉCIAL
                </div>
              </div>
              
              <h2 className="text-2xl lg:text-4xl font-bold text-blue-800 mb-2 leading-tight drop-shadow-sm">
                Profitez de Réductions Spéciales sur nos Équipements !
              </h2>
              
              <p className="text-blue-800 text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 mb-4 drop-shadow-sm">
                En cette période sacrée, nous vous offrons des <span className="font-bold text-blue-900">réductions exceptionnelles</span> 
                sur toute notre gamme d'équipements ! Simplifiez vos déplacements et le transport de vos bagages, colis, etc.
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="bg-blue-200/70 backdrop-blur-sm text-blue-900 px-3 py-1 rounded-full text-sm border border-blue-300/70 shadow-sm font-semibold">
                  🚛 Camions & Véhicules
                </span>
                <span className="bg-blue-200/70 backdrop-blur-sm text-blue-900 px-3 py-1 rounded-full text-sm border border-blue-300/70 shadow-sm font-semibold">
                  🚜 Matériel Agricole
                </span>
                <span className="bg-blue-200/70 backdrop-blur-sm text-blue-900 px-3 py-1 rounded-full text-sm border border-blue-300/70 shadow-sm font-semibold">
                  ⚡ Équipements Électriques
                </span>
              </div>
            </div>

            {/* Section droite - Actions */}
            <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/60 shadow-xl">
              <div className="text-center">
                <div className="text-blue-700 text-sm font-bold mb-1">Offre Limitée</div>
                <div className="text-blue-900 text-2xl font-bold">*Jusqu'à -25%*</div>
                <div className="text-blue-800 text-sm font-semibold">sur vos locations</div>
              </div>
              
              <Button 
                asChild
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 font-bold px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
              >
                <Link href="/contact">
                  <Phone className="h-5 w-5 mr-2" />
                  Service Commercial
                </Link>
              </Button>
              
              <div className="text-center">
                <div className="text-blue-700 text-sm mb-1 font-semibold">Réservation directe</div>
                <div className="bg-blue-200/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-300/60">
                  <div className="text-blue-900 font-bold text-xl">+221 78 606 70 13</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Élément décoratif en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-lg"></div>
      </div>

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
              Tracteurs, charrues, camions benne, motopompes et équipements agricoles les plus demandés
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
              <Button className="bg-aywa-blue hover:bg-aywa-blue/90 text-white px-8 py-3 text-lg">
                Voir tous les équipements
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Package Examples Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Exemple de combinaisons populaires (forfait location)
            </h2>
            <p className="text-xl text-gray-600">
              Nos équipes vous proposent des forfaits complets pour vos projets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-primary-orange/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary-orange" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tracteur 75 CV + charrue + opérateur → pour 5 ha de maïs
                </h3>
                <p className="text-gray-600">
                  Solution complète pour la préparation et le labour de terrain agricole avec opérateur expérimenté inclus.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tracteur + billonneuse + semoir + motopompe → pour périmètre maraîcher de 2 ha
                </h3>
                <p className="text-gray-600">
                  Kit complet pour l'aménagement et l'irrigation d'un périmètre maraîcher moderne.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Camion benne 30 T + chargeur frontal → pour approvisionnement en gravier ou céréales
                </h3>
                <p className="text-gray-600">
                  Ensemble logistique pour le transport et la manutention de matériaux en vrac ou de produits agricoles.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Pick-up 4x4 + pulvérisateur + motopompe → pour suivi agricole multisite
                </h3>
                <p className="text-gray-600">
                  Solution mobile pour la surveillance et le traitement de plusieurs exploitations agricoles.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/contact">
              <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white px-8 py-3 text-lg">
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
                        {area.description}
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
