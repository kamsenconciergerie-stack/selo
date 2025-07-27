import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Star, CheckCircle } from "lucide-react";

const businessHours = [
  { day: "Lundi - Vendredi", hours: "08:00 - 18:00" },
  { day: "Samedi", hours: "09:00 - 17:00" },
  { day: "Dimanche", hours: "Sur rendez-vous" }
];

const localReviews = [
  {
    name: "Abdou Diouf",
    location: "Dakar",
    rating: 5,
    comment: "Service excellent pour la location de pelleteuse. Livraison rapide et équipe professionnelle.",
    equipment: "Pelleteuse hydraulique"
  },
  {
    name: "Fatou Sall",
    location: "Thiès", 
    rating: 5,
    comment: "Très satisfaite de la location de tracteur. Équipement en parfait état et tarifs compétitifs.",
    equipment: "Tracteur 90 CV"
  },
  {
    name: "Mamadou Ba",
    location: "Saint-Louis",
    rating: 5,
    comment: "Location de générateur pour notre événement. Service impeccable et support technique disponible.",
    equipment: "Générateur 50 kVA"
  }
];

export default function LocalSEO() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          
          {/* Contact & Hours */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 text-kamsen-orange mr-2" />
                Nous Contacter
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-kamsen-blue mr-3 mt-1" />
                  <div>
                    <p className="font-semibold">Téléphone</p>
                    <a href="tel:+221786067013" className="text-kamsen-orange hover:underline">
                      +221 78 606 70 13
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-kamsen-blue mr-3 mt-1" />
                  <div>
                    <p className="font-semibold">Adresse</p>
                    <p className="text-gray-600">Dakar, Sénégal</p>
                    <p className="text-gray-600">Service dans tout le pays</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Clock className="h-4 w-4 text-kamsen-blue mr-2" />
                    Horaires d'Ouverture
                  </h4>
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{schedule.day}</span>
                      <span className="font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>


        </div>

        {/* Local Service Areas */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Zones de Service Kamsen au Sénégal
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  "Dakar", "Thiès", "Saint-Louis", "Kaolack",
                  "Ziguinchor", "Tambacounda", "Kolda", "Sédhiou",
                  "Kaffrine", "Kédougou", "Matam", "Louga",
                  "Fatick", "Diourbel"
                ].map((city) => (
                  <div key={city} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold text-gray-900">{city}</p>
                    <p className="text-xs text-gray-600">Livraison disponible</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">
                  Votre ville n'est pas listée ? Nous livrons partout au Sénégal !
                </p>
                <Button className="bg-kamsen-orange hover:bg-orange-600 text-white">
                  Vérifier la Disponibilité
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}