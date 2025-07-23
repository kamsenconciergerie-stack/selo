import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Weight, Fuel } from "lucide-react";
import { Equipment } from "@shared/schema";
import { formatPriceWithPrefix } from "@/lib/constants";
import { Link } from "wouter";
import BookingModal from "./booking-modal";
import { useState } from "react";

interface EquipmentCardProps {
  equipment: Equipment;
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-shadow">
        <img 
          src={`${equipment.imageUrl}?v=${Date.now()}`}
          alt={equipment.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            console.log('Image load error:', equipment.imageUrl);
            e.currentTarget.src = '/attached_assets/image_1753108301083.png';
          }}
        />
        
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-900">
              {equipment.name}
            </h3>
            <Badge variant={equipment.isAvailable ? "default" : "secondary"}>
              {equipment.isAvailable ? "Disponible" : "Non disponible"}
            </Badge>
          </div>
          
          <p className="text-gray-600 mb-2 line-clamp-2">
            {equipment.description}
          </p>
          
          <p className="text-xs text-gray-500 mb-4 font-medium">
            {equipment.category}
          </p>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold text-primary-orange">
              {formatPriceWithPrefix(equipment.pricePerDay)}
              <span className="text-sm font-normal text-gray-500">/jour</span>
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              {equipment.location}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
            {equipment.weight && (
              <div className="flex items-center">
                <Weight className="mr-2 h-4 w-4" />
                {equipment.weight}
              </div>
            )}
            {equipment.fuelType && (
              <div className="flex items-center">
                <Fuel className="mr-2 h-4 w-4" />
                {equipment.fuelType}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Link href={`/equipements/${equipment.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Voir détails
              </Button>
            </Link>
            <Button 
              onClick={() => setShowBookingModal(true)}
              disabled={!equipment.isAvailable}
              className="flex-1 bg-primary-orange hover:bg-primary-orange/90 text-white"
            >
              {equipment.isAvailable ? "Réserver" : "Non disponible"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <BookingModal
        equipment={equipment}
        open={showBookingModal}
        onOpenChange={setShowBookingModal}
      />
    </>
  );
}
