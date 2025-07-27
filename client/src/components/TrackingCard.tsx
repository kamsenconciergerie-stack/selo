import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Truck, Clock, Phone, User, AlertCircle, CheckCircle, Package, Eye } from "lucide-react";

interface GpsTracking {
  id: number;
  equipmentId: number;
  bookingId: number | null;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string;
  status: string;
  driverName: string | null;
  driverPhone: string | null;
  estimatedArrival: string | null;
  actualArrival: string | null;
  deliveryNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TrackingCardProps {
  tracking: GpsTracking;
  showEquipmentInfo?: boolean;
  showBookingInfo?: boolean;
  onViewDetails?: (tracking: GpsTracking) => void;
}

export default function TrackingCard({ 
  tracking, 
  showEquipmentInfo = true, 
  showBookingInfo = true,
  onViewDetails 
}: TrackingCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'returned':
        return <Package className="h-4 w-4" />;
      case 'maintenance':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Navigation className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_transit':
        return 'bg-kamsen-blue-light text-blue-800';
      case 'delivered':
        return 'bg-kamsen-blue-light text-green-800';
      case 'returned':
        return 'bg-kamsen-blue-light text-gray-800';
      case 'maintenance':
        return 'bg-kamsen-blue-light text-orange-800';
      default:
        return 'bg-kamsen-blue-light text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_transit':
        return 'En transit';
      case 'delivered':
        return 'Livré';
      case 'returned':
        return 'Retourné';
      case 'maintenance':
        return 'Maintenance';
      default:
        return status;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {showEquipmentInfo && (
            <CardTitle className="text-lg">
              Équipement #{tracking.equipmentId}
            </CardTitle>
          )}
          {showBookingInfo && tracking.bookingId && (
            <div className="text-sm text-kamsen-gray">
              Réservation #{tracking.bookingId}
            </div>
          )}
          <Badge className={`${getStatusColor(tracking.status)} flex items-center gap-1`}>
            {getStatusIcon(tracking.status)}
            {getStatusLabel(tracking.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Localisation */}
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-1 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">{tracking.city}</p>
            <p className="text-xs text-kamsen-gray">
              {tracking.address || `${tracking.latitude.toFixed(6)}, ${tracking.longitude.toFixed(6)}`}
            </p>
          </div>
        </div>

        {/* Chauffeur */}
        {tracking.driverName && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm">{tracking.driverName}</p>
              {tracking.driverPhone && (
                <p className="text-xs text-kamsen-gray flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {tracking.driverPhone}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Heure d'arrivée estimée */}
        {tracking.estimatedArrival && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <div>
              <p className="text-sm">Arrivée prévue</p>
              <p className="text-xs text-kamsen-gray">
                {new Date(tracking.estimatedArrival).toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
        )}

        {/* Heure d'arrivée réelle */}
        {tracking.actualArrival && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm">Arrivée réelle</p>
              <p className="text-xs text-kamsen-gray">
                {new Date(tracking.actualArrival).toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
        )}

        {/* Notes de livraison */}
        {tracking.deliveryNotes && (
          <div className="bg-kamsen-blue-light p-2 rounded text-xs">
            <span className="font-medium">Notes:</span> {tracking.deliveryNotes}
          </div>
        )}

        {/* Bouton pour voir les détails */}
        {onViewDetails && (
          <div className="pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(tracking)}
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir détails complets
            </Button>
          </div>
        )}

        <div className="bg-kamsen-blue-light p-2 rounded text-xs">
          <span className="font-medium">Dernière mise à jour:</span> {new Date(tracking.updatedAt).toLocaleString('fr-FR')}
        </div>
      </CardContent>
    </Card>
  );
}