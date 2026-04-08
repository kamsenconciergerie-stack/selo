import Header from "@/components/header";
import Footer from "@/components/footer";
import BookingModal from "@/components/booking-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { ArrowLeft, MapPin, Weight, Fuel, Calendar, Shield, Clock, Phone, Smartphone, CreditCard } from "lucide-react";
import { formatPriceWithPrefix, SERVICE_AREAS } from "@/lib/constants";

export default function EquipmentDetail() {
  const { id } = useParams();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { data: equipment, isLoading, error } = useQuery<Equipment>({
    queryKey: [`/api/equipment/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kamsen-blue-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4 w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="min-h-screen bg-kamsen-blue-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-kamsen-blue mb-4">
              Équipement non trouvé
            </h1>
            <p className="text-kamsen-gray mb-6">
              L'équipement que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
            <Link href="/equipements">
              <Button className="bg-kamsen-blue hover:bg-kamsen-blue/90">
                Retour aux équipements
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const serviceArea = SERVICE_AREAS.find(area => area.city === equipment.location);

  return (
    <div className="min-h-screen bg-kamsen-blue-light">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/equipements" className="flex items-center text-kamsen-gray hover:text-kamsen-blue mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux équipements
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Equipment Image */}
          <div>
            <img 
              src={equipment.imageUrl}
              alt={equipment.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Equipment Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-kamsen-blue">
                  {equipment.name}
                </h1>
                <Badge variant={equipment.isAvailable ? "default" : "secondary"} className="text-sm">
                  {equipment.isAvailable ? "Disponible" : "Non disponible"}
                </Badge>
              </div>
              
              <div className="flex items-center text-kamsen-gray mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                {equipment.location}
              </div>

              <p className="text-kamsen-blue text-lg leading-relaxed">
                {equipment.description}
              </p>
            </div>

            {/* Moyens de Paiement */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Moyens de Paiement Acceptés
                </h3>
                <div className="flex items-center gap-4 justify-center">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                    <div className="w-12 h-12 bg-kamsen-blue rounded-lg flex items-center justify-center">
                      <Smartphone className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Mobile Money</div>
                      <div className="text-sm text-gray-600">Paiement sécurisé et rapide</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center text-xs text-green-600 font-medium">
                  ✓ Transactions 100% sécurisées
                </div>
              </CardContent>
            </Card>

            {/* Price */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-kamsen-blue mb-2">
                    {formatPriceWithPrefix(equipment.pricePerDay)}
                  </div>
                  <div className="text-kamsen-gray">par jour</div>

                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                onClick={() => setShowBookingModal(true)}
                disabled={!equipment.isAvailable}
                className="flex-1 bg-kamsen-blue hover:bg-kamsen-blue/90 text-white text-lg py-3"
              >
                {equipment.isAvailable ? "Réserver maintenant" : "Non disponible"}
              </Button>
              <Button variant="outline" className="flex-1 text-lg py-3">
                <Phone className="h-4 w-4 mr-2" />
                Contacter
              </Button>
            </div>

            {/* Delivery Info */}
            {serviceArea && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-kamsen-blue">Livraison à {equipment.location}</div>
                      <div className="text-sm text-kamsen-gray">{serviceArea.deliveryTime}</div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-kamsen-blue mb-6">Spécifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipment.weight && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Weight className="h-8 w-8 text-kamsen-blue mx-auto mb-2" />
                  <div className="font-semibold text-kamsen-blue">Poids</div>
                  <div className="text-kamsen-gray">{equipment.weight}</div>
                </CardContent>
              </Card>
            )}
            
            {equipment.fuelType && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Fuel className="h-8 w-8 text-kamsen-blue mx-auto mb-2" />
                  <div className="font-semibold text-kamsen-blue">Carburant</div>
                  <div className="text-kamsen-gray">{equipment.fuelType}</div>
                </CardContent>
              </Card>
            )}

            {equipment.power && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Fuel className="h-8 w-8 text-kamsen-blue mx-auto mb-2" />
                  <div className="font-semibold text-kamsen-blue">Puissance</div>
                  <div className="text-kamsen-gray">{equipment.power}</div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-kamsen-blue mx-auto mb-2" />
                <div className="font-semibold text-kamsen-blue">Catégorie</div>
                <div className="text-kamsen-gray">{equipment.category}</div>
              </CardContent>
            </Card>
          </div>

          {equipment.specifications && equipment.specifications.length > 0 && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-kamsen-blue mb-4">Caractéristiques supplémentaires</h3>
                <ul className="space-y-2">
                  {equipment.specifications.map((spec, index) => (
                    <li key={index} className="flex items-center text-kamsen-blue">
                      <div className="w-2 h-2 bg-kamsen-blue rounded-full mr-3"></div>
                      {spec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Terms and Conditions */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-kamsen-blue mb-4">Conditions de location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-kamsen-gray">
              <div>
                <h4 className="font-semibold text-kamsen-blue mb-2">Location</h4>
                <ul className="space-y-1">
                  <li>• Durée minimum : 1 jour</li>
                  <li>• Paiement à la réservation</li>
                  <li>• Caution demandée</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-kamsen-blue mb-2">Livraison</h4>
                <ul className="space-y-1">
                  <li>• Livraison et reprise incluses</li>
                  <li>• Opérateur disponible sur demande</li>
                  <li>• Formation à l'utilisation</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-kamsen-blue/10 rounded-lg border-l-4 border-primary-orange">
              <p className="text-kamsen-blue font-medium">
                📞 Contactez l'équipe commerciale d'Kamsen pour en savoir plus au{" "}
                <a href="tel:+221338275726" className="text-kamsen-blue font-bold hover:underline">
                  33 827 57 26
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />

      <BookingModal
        equipment={equipment}
        open={showBookingModal}
        onOpenChange={setShowBookingModal}
      />
    </div>
  );
}
