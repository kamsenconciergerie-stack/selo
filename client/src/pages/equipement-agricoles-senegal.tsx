import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import { Link } from "wouter";
import { Tractor, MapPin, Phone, CheckCircle, Wrench, Leaf } from "lucide-react";

export default function EquipementAgricolesSenegal() {
  const { data: equipment = [] } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  const agricEquipment = [
    {
      name: "Tracteurs Agricoles Sénégal",
      power: "75-90 CV",
      usage: "Labour, semis, récolte, transport",
      price: "35 000 CFA/jour",
      regions: ["Thiès", "Saint-Louis", "Kaolack", "Fatick"]
    },
    {
      name: "Moissonneuses-Batteuses",
      power: "150-200 CV",
      usage: "Récolte céréales, riz, arachides",
      price: "80 000 CFA/jour",
      regions: ["Saint-Louis", "Matam", "Tambacounda"]
    },
    {
      name: "Décortiqueuses Arachides",
      power: "15-25 CV",
      usage: "Transformation arachides, mil, riz",
      price: "20 000 CFA/jour",
      regions: ["Kaolack", "Kaffrine", "Fatick"]
    },
    {
      name: "Motoculteurs",
      power: "8-12 CV",
      usage: "Petites parcelles, maraîchage",
      price: "15 000 CFA/jour",
      regions: ["Thiès", "Dakar", "Louga"]
    }
  ];

  const toolsAndImplements = [
    {
      category: "Outils de Labour",
      items: ["Charrues à disques", "Charrues à socs", "Sous-soleuses", "Cultivateurs"],
      usage: "Préparation du sol, retournement terre"
    },
    {
      category: "Équipement de Semis",
      items: ["Semoirs en ligne", "Semoirs à volée", "Planteuses", "Épandeurs d'engrais"],
      usage: "Plantation précise, fertilisation"
    },
    {
      category: "Matériel de Récolte",
      items: ["Faucheuses", "Andaineurs", "Presses à balles", "Remorques agricoles"],
      usage: "Coupe, fanage, transport récolte"
    },
    {
      category: "Irrigation",
      items: ["Motopompes", "Asperseurs", "Goutte-à-goutte", "Tuyaux d'arrosage"],
      usage: "Arrosage cultures, maraîchage"
    }
  ];

  const crops = [
    {
      name: "Arachide",
      regions: ["Kaolack", "Kaffrine", "Fatick"],
      equipment: "Tracteurs, décortiqueuses, moissonneuses",
      season: "Juin - Novembre"
    },
    {
      name: "Riz",
      regions: ["Saint-Louis", "Matam", "Sédhiou"],
      equipment: "Motoculteurs, repiqueuses, batteuses",
      season: "Juillet - Décembre"
    },
    {
      name: "Mil/Sorgho",
      regions: ["Thiès", "Diourbel", "Louga"],
      equipment: "Semoirs, cultivateurs, moissonneuses",
      season: "Juin - Octobre"
    },
    {
      name: "Maraîchage",
      regions: ["Niayes", "Dakar", "Thiès"],
      equipment: "Motoculteurs, irrigation, pulvérisateurs",
      season: "Toute l'année"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Équipement Agricoles Sénégal - Location Machines Farming
          </h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-4xl mx-auto">
            Location équipement agricoles Sénégal : tracteurs, moissonneuses, décortiqueuses et machines agricoles 
            pour optimiser vos rendements dans toutes les régions du pays.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-kamsen-orange hover:bg-orange-600 text-white px-8 py-3 text-lg">
              <Phone className="mr-2 h-5 w-5" />
              +221 33 827 57 26
            </Button>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-700 px-8 py-3 text-lg">
                Devis Équipement Agricole
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Équipements Principaux */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Machines Agricoles Disponibles au Sénégal
            </h2>
            <p className="text-xl text-gray-600">
              Équipement agricoles modernes pour tous types de cultures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agricEquipment.map((machine, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Tractor className="h-8 w-8 text-green-600 mr-3" />
                    <h3 className="text-lg font-bold text-gray-900">{machine.name}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Wrench className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Puissance: {machine.power}</span>
                    </div>
                    <p className="text-sm text-gray-600">{machine.usage}</p>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-lg font-bold text-green-700">{machine.price}</p>
                      <p className="text-xs text-gray-600">Prix de location</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {machine.regions.map((region) => (
                        <span key={region} className="bg-gray-100 text-xs px-2 py-1 rounded">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Outils et Implements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Outils Agricoles et Implements Sénégal
            </h2>
            <p className="text-xl text-gray-600">
              Outils spécialisés pour chaque étape de production
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {toolsAndImplements.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded">
                      <span className="text-sm font-semibold text-green-700">Usage: </span>
                      <span className="text-sm text-gray-600">{category.usage}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cultures par Région */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Équipement par Culture au Sénégal
            </h2>
            <p className="text-xl text-gray-600">
              Solutions adaptées à chaque type de culture sénégalaise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {crops.map((crop, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Leaf className="h-8 w-8 text-green-600 mr-3" />
                    <h3 className="text-lg font-bold text-gray-900">{crop.name}</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Régions: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {crop.regions.map((region) => (
                          <span key={region} className="bg-green-100 text-xs px-2 py-1 rounded">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Équipement: </span>
                      <span className="text-sm text-gray-600">{crop.equipment}</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Saison: </span>
                      <span className="text-sm text-gray-600">{crop.season}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Louer vos Équipement Agricoles avec Kamsen ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <Tractor className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Machines Modernes</h3>
              <p className="text-gray-600">Équipement agricoles récents et performants pour optimiser vos rendements</p>
            </div>
            <div className="text-center">
              <Wrench className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Maintenance Incluse</h3>
              <p className="text-gray-600">Service technique et réparations inclus dans la location</p>
            </div>
            <div className="text-center">
              <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Livraison sur Site</h3>
              <p className="text-gray-600">Transport et installation directement sur vos parcelles</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-kamsen-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Besoin d'Équipement Agricoles pour vos Cultures ?
          </h2>
          <p className="text-xl mb-8">
            Contactez-nous maintenant pour obtenir un devis personnalisé et gratuit 
            pour la location d'équipement agricoles adaptés à vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-kamsen-orange hover:bg-orange-600 text-white px-8 py-3 text-lg">
              <Phone className="mr-2 h-5 w-5" />
              Appeler Maintenant
            </Button>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-kamsen-blue px-8 py-3 text-lg">
                Demander un Devis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}