import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Navigation, Clock, Truck, Phone, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface GpsTracking {
  id: number;
  equipmentId: number;
  bookingId: number;
  currentLatitude: number;
  currentLongitude: number;
  currentAddress: string;
  currentCity: string;
  destinationLatitude: number;
  destinationLongitude: number;
  destinationAddress: string;
  destinationCity: string;
  status: string;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  totalDistanceKm: number;
  remainingDistanceKm: number;
  currentSpeed: number;
  estimatedArrival: string;
  actualArrival?: string;
  deliveryNotes: string;
  lastPingAt: string;
  signalStrength: number;
  batteryLevel: number;
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  dispatched: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-yellow-100 text-yellow-800',
  arrived: 'bg-green-100 text-green-800',
  delivered: 'bg-green-600 text-white',
  returned: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'En attente',
  dispatched: 'Expédié',
  in_transit: 'En transit',
  arrived: 'Arrivé',
  delivered: 'Livré',
  returned: 'Retourné',
  cancelled: 'Annulé',
};

export default function GpsTracking() {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout>();

  // Fetch active GPS tracking data
  const { data: trackingData, isLoading, refetch } = useQuery({
    queryKey: ['/api/gps-tracking', selectedCity, selectedStatus],
    queryFn: () => apiRequest(`/api/gps-tracking?city=${selectedCity}&status=${selectedStatus}`),
  });

  // Update location mutation
  const updateLocationMutation = useMutation({
    mutationFn: (data: { trackingId: number; latitude: number; longitude: number; address?: string }) =>
      apiRequest('/api/gps-tracking/update-location', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gps-tracking'] });
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (data: { trackingId: number; status: string; notes?: string; deliveryPhoto?: string }) =>
      apiRequest('/api/gps-tracking/update-status', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gps-tracking'] });
    },
  });

  // Auto-refresh every 30 seconds when enabled
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        refetch();
      }, 30000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refetch]);

  const handleStatusUpdate = (trackingId: number, newStatus: string) => {
    const notes = prompt('Notes de livraison (optionnel):');
    updateStatusMutation.mutate({
      trackingId,
      status: newStatus,
      notes: notes || undefined,
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateETA = (remainingKm: number, averageSpeed: number) => {
    if (!remainingKm || !averageSpeed) return 'N/A';
    const hours = remainingKm / averageSpeed;
    const eta = new Date(Date.now() + hours * 60 * 60 * 1000);
    return formatTime(eta.toISOString());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚚 Suivi GPS en Temps Réel</h1>
              <p className="text-gray-600 mt-1">
                Livraisons d'équipements à Dakar et dans tout le Sénégal
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  <SelectItem value="Dakar">Dakar</SelectItem>
                  <SelectItem value="Thiès">Thiès</SelectItem>
                  <SelectItem value="Saint-Louis">Saint-Louis</SelectItem>
                  <SelectItem value="Kaolack">Kaolack</SelectItem>
                  <SelectItem value="Ziguinchor">Ziguinchor</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="in_transit">En transit</SelectItem>
                  <SelectItem value="dispatched">Expédié</SelectItem>
                  <SelectItem value="arrived">Arrivé</SelectItem>
                  <SelectItem value="delivered">Livré</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={autoRefresh ? "default" : "outline"}
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="whitespace-nowrap"
              >
                {autoRefresh ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
              </Button>

              <Button onClick={() => refetch()} variant="outline">
                🔄 Actualiser
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">En Transit</p>
                  <p className="text-2xl font-bold">
                    {trackingData?.filter((t: GpsTracking) => t.status === 'in_transit').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Livrés Aujourd'hui</p>
                  <p className="text-2xl font-bold">
                    {trackingData?.filter((t: GpsTracking) => 
                      t.status === 'delivered' && 
                      t.actualArrival &&
                      new Date(t.actualArrival).toDateString() === new Date().toDateString()
                    ).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold">
                    {trackingData?.filter((t: GpsTracking) => t.status === 'pending').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Retards</p>
                  <p className="text-2xl font-bold">
                    {trackingData?.filter((t: GpsTracking) => 
                      new Date(t.estimatedArrival) < new Date() && 
                      t.status === 'in_transit'
                    ).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tracking Cards */}
        <div className="space-y-4">
          {trackingData?.map((tracking: GpsTracking) => (
            <Card key={tracking.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Livraison #{tracking.bookingId} - Équipement #{tracking.equipmentId}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {tracking.currentCity} → {tracking.destinationCity}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${statusColors[tracking.status as keyof typeof statusColors]} px-3 py-1`}>
                    {statusLabels[tracking.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Driver and Vehicle Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Chauffeur & Véhicule
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chauffeur:</span>
                        <span className="font-medium">{tracking.driverName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Téléphone:</span>
                        <a href={`tel:${tracking.driverPhone}`} className="text-blue-600 hover:underline">
                          {tracking.driverPhone}
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Véhicule:</span>
                        <span className="font-medium">{tracking.vehiclePlate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Signal GPS:</span>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            tracking.signalStrength >= 4 ? 'bg-green-500' :
                            tracking.signalStrength >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-xs">{tracking.signalStrength}/5</span>
                        </div>
                      </div>
                      {tracking.batteryLevel && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Batterie GPS:</span>
                          <span className={`text-xs ${
                            tracking.batteryLevel > 50 ? 'text-green-600' :
                            tracking.batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {tracking.batteryLevel}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location and Route Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      Itinéraire & Position
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Position actuelle:</span>
                        <p className="font-medium">{tracking.currentAddress}</p>
                        <p className="text-xs text-gray-500">
                          {tracking.currentLatitude?.toFixed(4)}, {tracking.currentLongitude?.toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Destination:</span>
                        <p className="font-medium">{tracking.destinationAddress}</p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance restante:</span>
                        <span className="font-medium">{tracking.remainingDistanceKm?.toFixed(1)} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vitesse actuelle:</span>
                        <span className="font-medium">{tracking.currentSpeed?.toFixed(0)} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dernière position:</span>
                        <span className="text-xs text-gray-500">
                          {formatTime(tracking.lastPingAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline and Actions */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Planning & Actions
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Arrivée prévue:</span>
                        <span className="font-medium">{formatTime(tracking.estimatedArrival)}</span>
                      </div>
                      {tracking.actualArrival && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Arrivée réelle:</span>
                          <span className="font-medium text-green-600">
                            {formatTime(tracking.actualArrival)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">ETA calculé:</span>
                        <span className="text-xs text-gray-500">
                          {calculateETA(tracking.remainingDistanceKm, tracking.currentSpeed)}
                        </span>
                      </div>
                    </div>

                    {/* Status Update Buttons */}
                    <div className="space-y-2 pt-2">
                      {tracking.status === 'in_transit' && (
                        <Button
                          onClick={() => handleStatusUpdate(tracking.id, 'arrived')}
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={updateStatusMutation.isPending}
                        >
                          ✅ Marquer comme arrivé
                        </Button>
                      )}
                      {tracking.status === 'arrived' && (
                        <Button
                          onClick={() => handleStatusUpdate(tracking.id, 'delivered')}
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={updateStatusMutation.isPending}
                        >
                          📦 Marquer comme livré
                        </Button>
                      )}
                      {['in_transit', 'arrived'].includes(tracking.status) && (
                        <Button
                          onClick={() => handleStatusUpdate(tracking.id, 'cancelled')}
                          size="sm"
                          variant="destructive"
                          className="w-full"
                          disabled={updateStatusMutation.isPending}
                        >
                          ❌ Annuler livraison
                        </Button>
                      )}
                    </div>

                    {tracking.deliveryNotes && (
                      <div className="pt-2 border-t">
                        <span className="text-gray-600 text-sm">Notes:</span>
                        <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                          {tracking.deliveryNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {trackingData?.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune livraison en cours
                </h3>
                <p className="text-gray-600">
                  Aucune livraison GPS n'est actuellement active pour les critères sélectionnés.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}