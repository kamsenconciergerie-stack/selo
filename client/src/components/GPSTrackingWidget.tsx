import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Truck, Clock, Navigation, Phone } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface GPSTrackingProps {
  bookingId?: number;
  compact?: boolean;
  autoRefresh?: boolean;
}

export default function GPSTrackingWidget({ bookingId, compact = false, autoRefresh = true }: GPSTrackingProps) {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const { data: trackingData, isLoading, refetch } = useQuery({
    queryKey: ['/api/gps-tracking', bookingId],
    queryFn: () => apiRequest(`/api/gps-tracking${bookingId ? `?booking=${bookingId}` : ''}`),
    refetchInterval: autoRefresh ? 30000 : false, // Refresh every 30 seconds
  });

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
        refetch();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refetch]);

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    dispatched: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-yellow-100 text-yellow-800',
    arrived: 'bg-green-100 text-green-800',
    delivered: 'bg-green-600 text-white',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    pending: 'En attente',
    dispatched: 'Expédié',
    in_transit: 'En transit',
    arrived: 'Arrivé',
    delivered: 'Livré',
    cancelled: 'Annulé',
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateETA = (remainingKm: number, speed: number) => {
    if (!remainingKm || !speed) return 'N/A';
    const hours = remainingKm / speed;
    const eta = new Date(Date.now() + hours * 60 * 60 * 1000);
    return formatTime(eta.toISOString());
  };

  if (isLoading) {
    return (
      <Card className={compact ? 'p-3' : 'p-6'}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (!trackingData || trackingData.length === 0) {
    return (
      <Card className={compact ? 'p-3' : 'p-6'}>
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucun suivi GPS actif</p>
        </div>
      </Card>
    );
  }

  const activeTracking = trackingData.filter((t: any) => 
    ['dispatched', 'in_transit', 'arrived'].includes(t.status)
  );

  if (compact) {
    return (
      <div className="space-y-2">
        {activeTracking.slice(0, 2).map((tracking: any) => (
          <Card key={tracking.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-1.5 rounded-full">
                  <Truck className="h-3 w-3 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Livraison #{tracking.bookingId}</p>
                  <p className="text-xs text-gray-600">{tracking.currentCity}</p>
                </div>
              </div>
              <Badge className={`${statusColors[tracking.status as keyof typeof statusColors]} text-xs px-2 py-0.5`}>
                {statusLabels[tracking.status as keyof typeof statusLabels]}
              </Badge>
            </div>
          </Card>
        ))}
        {activeTracking.length > 2 && (
          <div className="text-center">
            <Button variant="outline" size="sm" className="text-xs">
              Voir tout ({activeTracking.length})
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-600" />
          Suivi GPS en Temps Réel
        </h3>
        <div className="text-xs text-gray-500">
          Mis à jour: {formatTime(lastUpdate.toISOString())}
        </div>
      </div>

      {activeTracking.map((tracking: any) => (
        <Card key={tracking.id} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    Livraison #{tracking.bookingId}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {tracking.currentCity} → {tracking.destinationCity}
                  </p>
                </div>
              </div>
              <Badge className={`${statusColors[tracking.status as keyof typeof statusColors]} px-2 py-1`}>
                {statusLabels[tracking.status as keyof typeof statusLabels]}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            {/* Driver Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Chauffeur</p>
                <p className="font-medium text-sm">{tracking.driverName}</p>
                <a href={`tel:${tracking.driverPhone}`} className="text-blue-600 text-xs hover:underline">
                  {tracking.driverPhone}
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Véhicule</p>
                <p className="font-medium text-sm">{tracking.vehiclePlate}</p>
                <p className="text-xs text-gray-500">
                  Signal: {tracking.signalStrength}/5 | Batterie: {tracking.batteryLevel}%
                </p>
              </div>
            </div>

            {/* Location & Progress */}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Position actuelle</span>
                <span className="text-xs text-gray-500">
                  {formatTime(tracking.lastPingAt)}
                </span>
              </div>
              <p className="font-medium text-sm mb-2">{tracking.currentAddress}</p>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-gray-600">Distance restante</p>
                  <p className="font-medium">{tracking.remainingDistanceKm?.toFixed(1)} km</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Vitesse</p>
                  <p className="font-medium">{tracking.currentSpeed} km/h</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">ETA</p>
                  <p className="font-medium">
                    {calculateETA(tracking.remainingDistanceKm, tracking.currentSpeed)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            {tracking.status === 'in_transit' && (
              <div className="border-t pt-3">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Phone className="h-3 w-3 mr-1" />
                    Appeler
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    Localiser
                  </Button>
                </div>
              </div>
            )}

            {tracking.deliveryNotes && (
              <div className="border-t pt-3">
                <p className="text-xs text-gray-600 mb-1">Notes de livraison</p>
                <p className="text-sm bg-gray-50 p-2 rounded">
                  {tracking.deliveryNotes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {activeTracking.length === 0 && (
        <Card className="p-6">
          <div className="text-center text-gray-500">
            <Truck className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <h3 className="font-semibold mb-2">Aucune livraison en cours</h3>
            <p className="text-sm">
              Toutes les livraisons sont terminées ou aucune n'est programmée pour le moment.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}