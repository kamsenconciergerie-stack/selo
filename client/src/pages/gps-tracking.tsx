import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Navigation, Truck, Clock, Phone, User, AlertCircle, CheckCircle, Package, Navigation2 } from "lucide-react";

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

interface ServiceCity {
  id: number;
  name: string;
  region: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusKm: number;
  isActive: boolean;
  deliveryFeeBase: number;
  deliveryFeePerKm: number;
}

export default function GpsTracking() {
  const [activeTracking, setActiveTracking] = useState<GpsTracking[]>([]);
  const [serviceCities, setServiceCities] = useState<ServiceCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTracking, setSelectedTracking] = useState<GpsTracking | null>(null);

  useEffect(() => {
    loadTrackingData();
    loadServiceCities();
  }, []);

  const loadTrackingData = async () => {
    try {
      const response = await fetch('/api/tracking/active');
      if (response.ok) {
        const data = await response.json();
        setActiveTracking(data);
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadServiceCities = async () => {
    try {
      const response = await fetch('/api/cities');
      if (response.ok) {
        const data = await response.json();
        setServiceCities(data);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const updateTrackingStatus = async (id: number, status: string, deliveryNotes?: string) => {
    try {
      const response = await fetch(`/api/tracking/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          actualArrival: status === 'delivered' ? new Date().toISOString() : undefined,
          deliveryNotes
        }),
      });

      if (response.ok) {
        await loadTrackingData();
      }
    } catch (error) {
      console.error('Error updating tracking status:', error);
    }
  };

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
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'returned':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const filteredTracking = selectedCity === 'all' 
    ? activeTracking 
    : activeTracking.filter(t => t.city === selectedCity);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Suivi GPS des Équipements
        </h1>
        <p className="text-gray-600">
          Localisation et suivi en temps réel des équipements en livraison à Dakar et autres villes du Sénégal
        </p>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex gap-4">
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par ville" />
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
        <Button onClick={loadTrackingData} variant="outline">
          <Navigation2 className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Équipements en Transit ({filteredTracking.length})</TabsTrigger>
          <TabsTrigger value="cities">Villes de Service ({serviceCities.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {filteredTracking.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun équipement en transit
                </h3>
                <p className="text-gray-600">
                  Tous les équipements sont actuellement à leur base ou livrés.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTracking.map((tracking) => (
                <Card key={tracking.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Équipement #{tracking.equipmentId}
                      </CardTitle>
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
                        <p className="text-xs text-gray-600">
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
                            <p className="text-xs text-gray-600 flex items-center gap-1">
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
                          <p className="text-xs text-gray-600">
                            {new Date(tracking.estimatedArrival).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Réservation liée */}
                    {tracking.bookingId && (
                      <div className="bg-gray-50 p-2 rounded text-xs">
                        <span className="font-medium">Réservation:</span> #{tracking.bookingId}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => updateTrackingStatus(tracking.id, 'delivered')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={tracking.status === 'delivered'}
                      >
                        Marquer livré
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTracking(tracking)}
                      >
                        Détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cities">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCities.map((city) => (
              <Card key={city.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {city.name}
                    <Badge variant={city.isActive ? "default" : "secondary"}>
                      {city.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Région</p>
                    <p className="text-sm text-gray-600">{city.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Zone de service</p>
                    <p className="text-sm text-gray-600">{city.radiusKm} km de rayon</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tarification livraison</p>
                    <p className="text-sm text-gray-600">
                      Base: {city.deliveryFeeBase.toLocaleString()} XOF
                      <br />
                      Par km: {city.deliveryFeePerKm.toLocaleString()} XOF
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    <span className="font-medium">Centre:</span> {city.centerLatitude.toFixed(4)}, {city.centerLongitude.toFixed(4)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de détails */}
      {selectedTracking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Détails du Suivi - Équipement #{selectedTracking.equipmentId}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTracking(null)}
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Statut</p>
                  <Badge className={`${getStatusColor(selectedTracking.status)} flex items-center gap-1 w-fit`}>
                    {getStatusIcon(selectedTracking.status)}
                    {getStatusLabel(selectedTracking.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Ville</p>
                  <p className="text-sm text-gray-600">{selectedTracking.city}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Latitude</p>
                  <p className="text-sm text-gray-600">{selectedTracking.latitude.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Longitude</p>
                  <p className="text-sm text-gray-600">{selectedTracking.longitude.toFixed(6)}</p>
                </div>
              </div>

              {selectedTracking.address && (
                <div>
                  <p className="text-sm font-medium">Adresse</p>
                  <p className="text-sm text-gray-600">{selectedTracking.address}</p>
                </div>
              )}

              {selectedTracking.driverName && (
                <div>
                  <p className="text-sm font-medium">Chauffeur</p>
                  <p className="text-sm text-gray-600">
                    {selectedTracking.driverName}
                    {selectedTracking.driverPhone && ` - ${selectedTracking.driverPhone}`}
                  </p>
                </div>
              )}

              {selectedTracking.estimatedArrival && (
                <div>
                  <p className="text-sm font-medium">Arrivée estimée</p>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedTracking.estimatedArrival).toLocaleString('fr-FR')}
                  </p>
                </div>
              )}

              {selectedTracking.actualArrival && (
                <div>
                  <p className="text-sm font-medium">Arrivée réelle</p>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedTracking.actualArrival).toLocaleString('fr-FR')}
                  </p>
                </div>
              )}

              {selectedTracking.deliveryNotes && (
                <div>
                  <p className="text-sm font-medium">Notes de livraison</p>
                  <p className="text-sm text-gray-600">{selectedTracking.deliveryNotes}</p>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium">Dernière mise à jour</p>
                <p className="text-sm text-gray-600">
                  {new Date(selectedTracking.updatedAt).toLocaleString('fr-FR')}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    updateTrackingStatus(selectedTracking.id, 'delivered');
                    setSelectedTracking(null);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={selectedTracking.status === 'delivered'}
                >
                  Marquer comme livré
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    updateTrackingStatus(selectedTracking.id, 'returned');
                    setSelectedTracking(null);
                  }}
                  disabled={selectedTracking.status === 'returned'}
                >
                  Marquer comme retourné
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}