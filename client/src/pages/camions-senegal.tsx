import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import { Link } from "wouter";
import { Truck, MapPin, Phone, CheckCircle, Clock, Package } from "lucide-react";

export default function CamionsSenegal() {
  const { data: equipment = [] } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  const truckTypes = [
    {
      name: "Camions Bennes Sénégal",
      capacity: "5 à 20 tonnes",
      usage: "Transport de matériaux, terre, sable, gravats",
      price: "45 000 CFA/jour",
      cities: ["Dakar", "Thiès", "Kaolack", "Saint-Louis"]
    },
    {
      name: "Camions Plateaux",
      capacity: "3 à 15 tonnes", 
      usage: "Transport de charges lourdes, équipements",
      price: "40 000 CFA/jour",
      cities: ["Dakar", "Thiès", "Diourbel"]
    },
    {
      name: "Camions Frigorifiques",
      capacity: "2 à 12 tonnes",
      usage: "Transport de produits frais, denrées périssables", 
      price: "60 000 CFA/jour",
      cities: ["Dakar", "Thiès", "Mbour"]
    },
    {
      name: "Pick-ups 4x4",
      capacity: "1 à 2 tonnes",
      usage: "Zones difficiles, chantiers, livraisons",
      price: "25 000 CFA/jour", 
      cities: ["Toutes villes Sénégal"]
    }
  ];

  const charges = [
    {
      type: "Matériaux de Construction",
      examples: "Sable, gravier, ciment, fer à béton",
      trucks: "Camions bennes, camions plateaux",
      weight: "5-20 tonnes"
    },
    {
      type: "Produits Agricoles",
      examples: "Arachides, mil, riz, fruits, légumes",
      trucks: "Camions plateaux, frigorifiques",
      weight: "2-15 tonnes"
    },
    {
      type: "Équipements Industriels", 
      examples: "Machines, générateurs, équipements lourds",
      trucks: "Camions plateaux, porte-engins",
      weight: "3-25 tonnes"
    },
    {
      type: "Marchandises Générales",
      examples: "Mobilier, électroménager, textiles",
      trucks: "Camions fourgons, plateaux",
      weight: "1-10 tonnes"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-kamsen-blue to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Camions Sénégal - Location et Transport de Charges
          </h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-4xl mx-auto">
            Location de camions au Sénégal pour tous vos besoins de transport de charges. 
            Camions bennes, plateaux et véhicules spécialisés disponibles dans tout le pays.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-kamsen-orange hover:bg-orange-600 text-white px-8 py-3 text-lg">
              <Phone className="mr-2 h-5 w-5" />
              +221 33 827 57 26
            </Button>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-kamsen-blue px-8 py-3 text-lg">
                Devis Camions Gratuit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Types de Camions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Types de Camions Disponibles au Sénégal
            </h2>
            <p className="text-xl text-gray-600">
              Flotte complète de camions pour tous vos besoins de transport
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {truckTypes.map((truck, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Truck className="h-8 w-8 text-kamsen-orange mr-3" />
                    <h3 className="text-lg font-bold text-gray-900">{truck.name}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Capacité: {truck.capacity}</span>
                    </div>
                    <p className="text-sm text-gray-600">{truck.usage}</p>
                    <div className="bg-kamsen-blue-light p-3 rounded">
                      <p className="text-lg font-bold text-kamsen-blue">{truck.price}</p>
                      <p className="text-xs text-gray-600">Prix indicatif</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {truck.cities.map((city) => (
                        <span key={city} className="bg-gray-100 text-xs px-2 py-1 rounded">
                          {city}
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

      {/* Types de Charges */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Transport de Charges au Sénégal
            </h2>
            <p className="text-xl text-gray-600">
              Solutions adaptées à chaque type de marchandise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {charges.map((charge, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{charge.type}</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Exemples: </span>
                      <span className="text-sm text-gray-600">{charge.examples}</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Camions recommandés: </span>
                      <span className="text-sm text-gray-600">{charge.trucks}</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Capacité: </span>
                      <span className="text-sm text-gray-600">{charge.weight}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir Kamsen pour vos Camions au Sénégal ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-kamsen-orange mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Flotte Moderne</h3>
              <p className="text-gray-600">Camions récents et bien entretenus pour vos transports</p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-kamsen-orange mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Disponibilité 24h/7j</h3>
              <p className="text-gray-600">Service d'urgence et livraisons à tout moment</p>
            </div>
            <div className="text-center">
              <MapPin className="h-12 w-12 text-kamsen-orange mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Couverture Nationale</h3>
              <p className="text-gray-600">Livraisons dans toutes les régions du Sénégal</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-kamsen-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Besoin de Camions pour vos Charges au Sénégal ?
          </h2>
          <p className="text-xl mb-8">
            Contactez-nous maintenant pour obtenir un devis personnalisé et gratuit 
            pour la location de camions et transport de charges.
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