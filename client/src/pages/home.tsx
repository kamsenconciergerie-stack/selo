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
import SEOContent from "@/components/seo-content";

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
      name: "Camions et Transport",
      description: "Camions bennes, plateaux et véhicules de transport",
      icon: Truck,
      emoji: "🚛",
      count: equipment.filter(eq => eq.category === "Camions et Transport").length,
    },
    {
      name: "BTP et Construction",
      description: "Équipements de construction et de travaux publics", 
      icon: HardHat,
      emoji: "🏗️",
      count: equipment.filter(eq => eq.category === "BTP et Construction").length,
    },
    {
      name: "Électricité et Énergie",
      description: "Générateurs, compresseurs et équipements électriques",
      icon: Zap,
      emoji: "⚡",
      count: equipment.filter(eq => eq.category === "Électricité et Énergie").length,
    },
    {
      name: "Pompage et Irrigation",
      description: "Pompes, motopompes et systèmes d'irrigation",
      icon: Zap,
      emoji: "💧",
      count: equipment.filter(eq => eq.category === "Pompage et Irrigation").length,
    },
    {
      name: "Équipement Agricole", 
      description: "Tracteurs, charrues, semoirs et outils agricoles",
      icon: Truck,
      emoji: "🚜",
      count: equipment.filter(eq => eq.category === "Équipement Agricole").length,
    },
    {
      name: "Équipement Spécialisé",
      description: "Équipements techniques et spécialisés",
      icon: Zap,
      emoji: "⚙️",
      count: equipment.filter(eq => eq.category === "Équipement Spécialisé").length,
    },
    {
      name: "Manutention",
      description: "Équipements de levage et de manutention",
      icon: Hammer,
      emoji: "🏋️",
      count: equipment.filter(eq => eq.category === "Manutention").length,
    },
  ];

  const steps = [
    {
      icon: Search,
      title: "1. Recherchez",
      description: "Trouvez l'équipement dont vous avez besoin parmi notre large catalogue",
      bgColor: "bg-kamsen-blue-light",
      iconColor: "text-kamsen-blue",
    },
    {
      icon: Calendar,
      title: "2. Réservez", 
      description: "Sélectionnez vos dates et confirmez votre réservation en ligne",
      bgColor: "bg-kamsen-blue-light",
      iconColor: "text-kamsen-blue",
    },
    {
      icon: Truck,
      title: "3. Recevez",
      description: "Nous livrons votre équipement directement sur votre site",
      bgColor: "bg-kamsen-blue-light", 
      iconColor: "text-kamsen-blue",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      {/* Bannière Promo Magal de Touba 2025 - Version Créative */}
      <div className="relative overflow-hidden bg-gradient-to-br from-kamsen-medium via-orange-500 to-kamsen-dark py-6 px-4 shadow-2xl border-b-4 border-orange-700">

        
        {/* Motifs décoratifs orange/bleu */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full transform -translate-x-16 -translate-y-16"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full transform translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full transform translate-y-10"></div>
          <div className="absolute bottom-0 right-1/3 w-16 h-16 bg-gradient-to-br from-kamsen-medium to-orange-500 rounded-full transform translate-y-8"></div>
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
                  GRAND MAGAL DE TOUBA 2025
                </div>
              </div>
              
              <h2 className="text-2xl lg:text-4xl font-bold text-blue-800 mb-2 leading-tight drop-shadow-sm">
                Réductions Spéciales !
              </h2>
              
              <p className="text-blue-800 text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 mb-4 drop-shadow-sm">
                À l'occasion du <span className="font-bold text-blue-900">Grand Magal de Touba 2025</span>, nous vous offrons des 
                <span className="font-bold text-blue-900"> réductions exceptionnelles</span> sur toute notre gamme d'équipements ! 
                Simplifiez vos déplacements, le transport de vos bagages et marchandises pendant cet événement sacré.
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
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-kamsen-gradient shadow-lg"></div>
      </div>

      {/* Equipment Categories */}
      <section className="py-16 bg-kamsen-blue-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kamsen-blue mb-4">
              Nos Catégories d'Équipements
            </h2>
            <p className="text-xl text-kamsen-gray max-w-3xl mx-auto">
              Découvrez notre gamme complète d'équipements professionnels disponibles à la location
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
                          {category.count} équipement{category.count > 1 ? 's' : ''} disponible{category.count > 1 ? 's' : ''}
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
              Les Plus Populaires
            </h2>
            <p className="text-xl text-kamsen-gray">
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
              <Button className="bg-kamsen-blue hover:bg-kamsen-blue/90 text-white px-8 py-3 text-lg">
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
            <h2 className="text-3xl lg:text-4xl font-bold text-kamsen-blue mb-4">
              Exemple de combinaisons populaires (forfait location)
            </h2>
            <p className="text-xl text-kamsen-gray">
              Nos équipes vous proposent des forfaits complets pour vos projets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-kamsen-blue/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-kamsen-blue" />
                </div>
                <h3 className="text-xl font-semibold text-kamsen-blue mb-3">
                  Tracteur 75 CV + charrue + opérateur → pour 5 ha de maïs
                </h3>
                <p className="text-kamsen-gray">
                  Solution complète pour la préparation et le labour de terrain agricole avec opérateur expérimenté inclus.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-kamsen-blue-light w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-kamsen-blue" />
                </div>
                <h3 className="text-xl font-semibold text-kamsen-blue mb-3">
                  Tracteur + billonneuse + semoir + motopompe → pour périmètre maraîcher de 2 ha
                </h3>
                <p className="text-kamsen-gray">
                  Kit complet pour l'aménagement et l'irrigation d'un périmètre maraîcher moderne.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-kamsen-blue-light w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-kamsen-blue" />
                </div>
                <h3 className="text-xl font-semibold text-kamsen-blue mb-3">
                  Camion benne 30 T + chargeur frontal → pour approvisionnement en gravier ou céréales
                </h3>
                <p className="text-kamsen-gray">
                  Ensemble logistique pour le transport et la manutention de matériaux en vrac ou de produits agricoles.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-kamsen-blue mb-3">
                  Pick-up 4x4 + pulvérisateur + motopompe → pour suivi agricole multisite
                </h3>
                <p className="text-kamsen-gray">
                  Solution mobile pour la surveillance et le traitement de plusieurs exploitations agricoles.
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

      {/* Moyens de Paiement */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Paiement Simple et Sécurisé
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Payez facilement avec vos moyens de paiement mobile préférés
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Orange Money
              </h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Paiement instantané</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>100% sécurisé</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Confirmé par SMS</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Wave
              </h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Paiement rapide</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Sécurité maximale</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Interface simple</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-lg text-gray-700 font-medium">
              ✓ Transactions 100% sécurisées • ✓ Confirmation immédiate • ✓ Support client 24h/7j
            </p>
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
              Zones de Service
            </h2>
            <p className="text-xl text-kamsen-gray">
              Nous livrons dans les principales villes du Sénégal
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
    </div>
  );
}
