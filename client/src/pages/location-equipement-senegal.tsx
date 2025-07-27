import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import { Link } from "wouter";
import { MapPin, Phone, Clock, CheckCircle, Star, Truck } from "lucide-react";

export default function LocationEquipementSenegal() {
  const { data: equipment = [] } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  const cities = [
    {
      name: "Dakar",
      population: "3,2 millions",
      equipment: "Pelleteuses, Camions, Générateurs",
      description: "Capitale économique du Sénégal avec le plus grand parc d'équipements disponibles"
    },
    {
      name: "Thiès",
      population: "365 000",
      equipment: "Tracteurs, Engins agricoles, Camions bennes",
      description: "Centre agricole et industriel majeur avec équipements spécialisés"
    },
    {
      name: "Saint-Louis",
      population: "258 000",
      equipment: "Équipement agricole, Motopompes, Véhicules 4x4",
      description: "Région du fleuve Sénégal spécialisée en agriculture et pêche"
    },
    {
      name: "Kaolack",
      population: "233 000",
      equipment: "Tracteurs, Décortiqueuses, Camions de transport",
      description: "Hub commercial et agricole du centre du Sénégal"
    }
  ];

  const categories = [
    {
      name: "Engins de Chantier",
      icon: "🏗️",
      cities: ["Dakar", "Thiès", "Kaolack"],
      equipment: ["Pelleteuses hydrauliques", "Chargeuses", "Compacteurs", "Bulldozers"]
    },
    {
      name: "Transport et Logistique", 
      icon: "🚛",
      cities: ["Dakar", "Thiès", "Saint-Louis", "Kaolack"],
      equipment: ["Camions bennes", "Camions plateaux", "Pick-ups 4x4", "Véhicules utilitaires"]
    },
    {
      name: "Équipement Agricole",
      icon: "🚜", 
      cities: ["Thiès", "Saint-Louis", "Kaolack"],
      equipment: ["Tracteurs 75-90 CV", "Charrues", "Semoirs", "Décortiqueuses"]
    },
    {
      name: "Équipement Électrique",
      icon: "⚡",
      cities: ["Dakar", "Thiès", "Saint-Louis"],
      equipment: ["Générateurs", "Groupes électrogènes", "Compresseurs", "Motopompes"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-kamsen-blue to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Location d'Équipement Professionnel au Sénégal
          </h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-4xl mx-auto">
            Louez vos équipements professionnels partout au Sénégal avec Kamsen. 
            Pelleteuses, camions, tracteurs et générateurs disponibles dans toutes les régions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-kamsen-orange hover:bg-orange-600 text-white px-8 py-3 text-lg">
              <Phone className="mr-2 h-5 w-5" />
              +221 78 606 70 13
            </Button>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-kamsen-blue px-8 py-3 text-lg">
                Devis Gratuit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos Villes de Service au Sénégal
            </h2>
            <p className="text-xl text-gray-600">
              Kamsen dessert les principales villes du Sénégal avec un service de qualité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((city) => (
              <Card key={city.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-6 w-6 text-kamsen-orange mr-2" />
                    <h3 className="text-xl font-bold text-gray-900">{city.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{city.population} habitants</p>
                  <p className="text-sm text-gray-700 mb-4">{city.description}</p>
                  <div className="bg-kamsen-blue-light p-3 rounded">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Équipements disponibles:</p>
                    <p className="text-sm text-gray-700">{city.equipment}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories by Region */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Équipements par Catégorie et Région
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez nos équipements spécialisés selon votre localisation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {categories.map((category) => (
              <Card key={category.name} className="border-l-4 border-l-kamsen-orange">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{category.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Villes desservies:</p>
                    <div className="flex flex-wrap gap-2">
                      {category.cities.map((city) => (
                        <span key={city} className="bg-kamsen-blue-light text-kamsen-blue px-2 py-1 rounded text-sm">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Équipements:</p>
                    <ul className="space-y-1">
                      {category.equipment.map((item) => (
                        <li key={item} className="text-sm text-gray-600 flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Kamsen */}
      <section className="py-16 bg-kamsen-blue-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Pourquoi Choisir Kamsen pour Votre Location d'Équipement au Sénégal ?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Star className="h-6 w-6 text-kamsen-orange mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Plus de 500 Équipements</h4>
                    <p className="text-gray-600">Le plus grand parc d'équipements professionnels du Sénégal</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Truck className="h-6 w-6 text-kamsen-orange mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Livraison Partout au Sénégal</h4>
                    <p className="text-gray-600">Service de livraison et installation dans toutes les régions</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-kamsen-orange mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Devis en 24h</h4>
                    <p className="text-gray-600">Réponse rapide et tarifs transparents pour tous vos projets</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-kamsen-orange mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Support 24h/7j</h4>
                    <p className="text-gray-600">Assistance technique et maintenance incluses</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-white">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">
                Obtenez Votre Devis Maintenant
              </h3>
              <div className="space-y-4">
                <p className="text-center text-gray-600">
                  Contactez-nous pour un devis personnalisé et gratuit
                </p>
                <div className="flex flex-col gap-3">
                  <a 
                    href="tel:+221786067013" 
                    className="bg-kamsen-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
                  >
                    📞 Appeler +221 78 606 70 13
                  </a>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full border-kamsen-blue text-kamsen-blue hover:bg-kamsen-blue hover:text-white">
                      📝 Formulaire de Contact
                    </Button>
                  </Link>
                  <a 
                    href="mailto:contact@kamsenlogistic.com" 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg text-center transition-colors"
                  >
                    ✉️ contact@kamsenlogistic.com
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-kamsen-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Prêt à Louer Vos Équipements au Sénégal ?
          </h2>
          <p className="text-xl mb-8">
            Rejoignez des centaines d'entreprises qui font confiance à Kamsen 
            pour leurs besoins en équipement professionnel partout au Sénégal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-kamsen-orange hover:bg-orange-600 text-white px-8 py-3 text-lg">
              Commencer Maintenant
            </Button>
            <Link href="/equipements">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-kamsen-blue px-8 py-3 text-lg">
                Voir Tous les Équipements
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}