import Header from "@/components/header";
import Footer from "@/components/footer";
import EquipmentCard from "@/components/equipment-card";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import { TrendingUp, Zap, Droplets, Building, Tractor, Volume2 } from "lucide-react";

export default function PopularEquipment() {
  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  // Équipements les plus demandés au Sénégal basés sur l'économie locale
  const priorityEquipment = [
    "Groupe Électrogène 100 KVA",
    "Pelleteuse 20 Tonnes", 
    "Camion-Citerne 10 000L",
    "Motopompe Haute Pression",
    "Foreuse à Eau Mobile",
    "Tracteur Agricole 85 CV",
    "Système de Sonorisation 5000W",
    "Camion Grue 25 Tonnes"
  ];

  const popularEquipment = equipment.filter(eq => 
    priorityEquipment.includes(eq.name)
  );

  const sectors = [
    {
      icon: Zap,
      title: "Énergie & Électricité",
      description: "Groupes électrogènes très demandés en raison des coupures fréquentes",
      equipment: ["Générateurs", "Onduleurs", "Panneaux solaires"],
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      icon: Droplets,
      title: "Eau & Hydraulique", 
      description: "Équipements vitaux pour l'accès à l'eau potable en zones rurales",
      equipment: ["Foreuses", "Motopompes", "Citernes"],
      bgColor: "bg-kamsen-light",
      iconColor: "text-kamsen-dark"
    },
    {
      icon: Building,
      title: "Construction & BTP",
      description: "Boom immobilier et grands projets d'infrastructure du PSE",
      equipment: ["Pelleteuses", "Grues", "Échafaudages"],
      bgColor: "bg-kamsen-light",
      iconColor: "text-kamsen-dark"
    },
    {
      icon: Tractor,
      title: "Agriculture",
      description: "Modernisation agricole pour la sécurité alimentaire",
      equipment: ["Tracteurs", "Moissonneuses", "Irrigation"],
      bgColor: "bg-kamsen-light",
      iconColor: "text-kamsen-dark"
    },
    {
      icon: Volume2,
      title: "Événementiel",
      description: "Secteur en croissance avec les cérémonies et événements",
      equipment: ["Sonorisation", "Éclairage", "Podiums"],
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  const insights = [
    {
      title: "Délestage Électrique",
      description: "Les groupes électrogènes représentent 35% de nos locations en raison des coupures d'électricité fréquentes."
    },
    {
      title: "Plan Sénégal Émergent",
      description: "Les équipements de construction connaissent une forte demande avec les grands projets d'infrastructure."
    },
    {
      title: "Agriculture Moderne",
      description: "L'État encourage la mécanisation agricole, boostant la demande en tracteurs et équipements agricoles."
    },
    {
      title: "Accès à l'Eau",
      description: "Les foreuses et motopompes sont essentielles pour l'hydraulique rurale et l'agriculture."
    }
  ];

  return (
    <div className="min-h-screen bg-kamsen-light">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-kamsen-gradient text-kamsen-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <TrendingUp className="h-12 w-12 text-kamsen-dark mr-4" />
              <h1 className="text-4xl lg:text-5xl font-bold">
                Équipements les Plus Demandés
              </h1>
            </div>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Découvrez les équipements essentiels adaptés aux besoins spécifiques 
              de l'économie sénégalaise
            </p>
          </div>
        </div>
      </section>

      {/* Secteurs Clés */}
      <section className="py-16 bg-kamsen-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kamsen-dark mb-4">
              Secteurs Économiques Clés du Sénégal
            </h2>
            <p className="text-xl text-kamsen-medium">
              Nos équipements répondent aux besoins des secteurs porteurs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <Card key={sector.title} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`${sector.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                      <Icon className={`h-8 w-8 ${sector.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-kamsen-dark mb-3">
                      {sector.title}
                    </h3>
                    <p className="text-kamsen-medium mb-4">
                      {sector.description}
                    </p>
                    <div className="space-y-1">
                      {sector.equipment.map((item, index) => (
                        <div key={index} className="flex items-center text-sm text-kamsen-dark">
                          <div className="w-2 h-2 bg-kamsen-dark rounded-full mr-2"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Équipements Populaires */}
      <section className="py-16 bg-kamsen-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kamsen-dark mb-4">
              Top Équipements Demandés
            </h2>
            <p className="text-xl text-kamsen-medium">
              Sélection basée sur l'analyse du marché sénégalais
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
              {popularEquipment.map((item) => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Insights du Marché */}
      <section className="py-16 bg-kamsen-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kamsen-dark mb-4">
              Analyse du Marché Sénégalais
            </h2>
            <p className="text-xl text-kamsen-medium">
              Pourquoi ces équipements sont-ils si demandés ?
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {insights.map((insight, index) => (
              <Card key={index} className="border-l-4 border-l-primary-orange">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-kamsen-dark mb-3">
                    {insight.title}
                  </h3>
                  <p className="text-kamsen-medium">
                    {insight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16 bg-kamsen-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-kamsen-white">
            <div>
              <div className="text-4xl font-bold text-kamsen-dark mb-2">35%</div>
              <p className="text-kamsen-light">Générateurs électriques</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-kamsen-dark mb-2">28%</div>
              <p className="text-kamsen-light">Engins de construction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-kamsen-dark mb-2">20%</div>
              <p className="text-kamsen-light">Équipements agricoles</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-kamsen-dark mb-2">17%</div>
              <p className="text-kamsen-light">Matériel hydraulique</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}