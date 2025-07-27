import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Navigation, Truck, Clock, Phone, User, AlertCircle, CheckCircle, Package, Eye, RefreshCw, Map } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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

interface TrackingDashboardProps {
  userType: 'admin' | 'partner' | 'user';
  partnerId?: number;
  userId?: number;
}

export default function TrackingDashboard({ userType, partnerId, userId }: TrackingDashboardProps) {
  const [trackingData, setTrackingData] = useState<GpsTracking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  const loadTrackingData = async () => {
    setIsLoading(true);
    try {
      let endpoint = '/api/tracking/active';
      
      // Determine the correct endpoint based on user type
      if (userType === 'partner' && partnerId) {
        endpoint = `/api/tracking/partner/${partnerId}`;
      } else if (userType === 'user' && userId) {
        endpoint = `/api/tracking/user/${userId}`;
      }

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setTrackingData(data);
        setLastUpdate(new Date());
      } else {
        // Fallback to test data if API fails
        const testResponse = await fetch('/api/test/tracking');
        if (testResponse.ok) {
          const testData = await testResponse.json();
          setTrackingData(testData.sampleTracking || []);
          setLastUpdate(new Date());
        } else {
          throw new Error('Impossible de charger les données GPS');
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du suivi GPS:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données de suivi GPS",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrackingData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadTrackingData, 30000);
    return () => clearInterval(interval);
  }, [userType, partnerId, userId]);

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
        return 'bg-kamsen-light text-blue-800';
      case 'delivered':
        return 'bg-kamsen-light text-green-800';
      case 'returned':
        return 'bg-kamsen-light text-gray-800';
      case 'maintenance':
        return 'bg-kamsen-light text-orange-800';
      default:
        return 'bg-kamsen-light text-gray-800';
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

  const openInMaps = (latitude: number, longitude: number, address?: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy à HH:mm", { locale: fr });
  };

  const getActiveTrackings = () => trackingData.filter(t => ['in_transit', 'delivered'].includes(t.status));
  const getInTransitTrackings = () => trackingData.filter(t => t.status === 'in_transit');
  const getDeliveredTrackings = () => trackingData.filter(t => t.status === 'delivered');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-kamsen-dark">
            {userType === 'admin' ? 'Suivi Global des Équipements' : 
             userType === 'partner' ? 'Suivi de Vos Équipements' : 
             'Suivi de Vos Réservations'}
          </h3>
          <p className="text-sm text-kamsen-medium">
            Dernière mise à jour: {format(lastUpdate, "HH:mm:ss", { locale: fr })}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadTrackingData}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-kamsen-medium">Total Suivi</p>
                <p className="text-2xl font-bold text-kamsen-dark">{trackingData.length}</p>
              </div>
              <Navigation className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-kamsen-medium">En Transit</p>
                <p className="text-2xl font-bold text-orange-600">{getInTransitTrackings().length}</p>
              </div>
              <Truck className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-kamsen-medium">Livrés</p>
                <p className="text-2xl font-bold text-kamsen-dark">{getDeliveredTrackings().length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main tracking data */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Actifs ({getActiveTrackings().length})</TabsTrigger>
          <TabsTrigger value="in_transit">En Transit ({getInTransitTrackings().length})</TabsTrigger>
          <TabsTrigger value="delivered">Livrés ({getDeliveredTrackings().length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {getActiveTrackings().length === 0 ? (
            <div className="text-center py-8 text-kamsen-medium">
              <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Aucun équipement actif en suivi</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {getActiveTrackings().map((tracking) => (
                <Card key={tracking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getStatusColor(tracking.status)}>
                            {getStatusIcon(tracking.status)}
                            <span className="ml-1">{getStatusLabel(tracking.status)}</span>
                          </Badge>
                          <span className="text-sm text-kamsen-medium">
                            Équipement #{tracking.equipmentId}
                          </span>
                          {tracking.bookingId && (
                            <span className="text-sm text-kamsen-medium">
                              Réservation #{tracking.bookingId}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-kamsen-light" />
                            <span className="font-medium">{tracking.city}</span>
                            {tracking.address && (
                              <span className="text-kamsen-medium">- {tracking.address}</span>
                            )}
                          </div>

                          {tracking.driverName && (
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-kamsen-light" />
                              <span>{tracking.driverName}</span>
                              {tracking.driverPhone && (
                                <a 
                                  href={`tel:${tracking.driverPhone}`}
                                  className="text-kamsen-dark hover:underline flex items-center gap-1"
                                >
                                  <Phone className="h-3 w-3" />
                                  {tracking.driverPhone}
                                </a>
                              )}
                            </div>
                          )}

                          {tracking.estimatedArrival && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-kamsen-light" />
                              <span className="text-kamsen-medium">
                                Arrivée prévue: {formatDateTime(tracking.estimatedArrival)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openInMaps(tracking.latitude, tracking.longitude, tracking.address || undefined)}
                          className="flex items-center gap-1"
                        >
                          <Map className="h-4 w-4" />
                          Carte
                        </Button>
                      </div>
                    </div>

                    {tracking.deliveryNotes && (
                      <div className="mt-4 p-3 bg-kamsen-light rounded-lg">
                        <p className="text-sm text-kamsen-dark">
                          <strong>Notes:</strong> {tracking.deliveryNotes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in_transit" className="space-y-4">
          {getInTransitTrackings().length === 0 ? (
            <div className="text-center py-8 text-kamsen-medium">
              <Truck className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Aucun équipement en transit</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {getInTransitTrackings().map((tracking) => (
                <Card key={tracking.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-kamsen-light text-blue-800">
                            <Truck className="h-4 w-4 mr-1" />
                            En transit
                          </Badge>
                          <span className="text-sm text-kamsen-medium">
                            Équipement #{tracking.equipmentId}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-kamsen-light" />
                            <span className="font-medium">{tracking.city}</span>
                            {tracking.address && (
                              <span className="text-kamsen-medium">- {tracking.address}</span>
                            )}
                          </div>

                          {tracking.estimatedArrival && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-kamsen-light" />
                              <span className="text-kamsen-medium">
                                Arrivée prévue: {formatDateTime(tracking.estimatedArrival)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openInMaps(tracking.latitude, tracking.longitude, tracking.address || undefined)}
                        className="flex items-center gap-1"
                      >
                        <Map className="h-4 w-4" />
                        Localiser
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {getDeliveredTrackings().length === 0 ? (
            <div className="text-center py-8 text-kamsen-medium">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Aucune livraison récente</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {getDeliveredTrackings().map((tracking) => (
                <Card key={tracking.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-kamsen-light text-green-800">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Livré
                          </Badge>
                          <span className="text-sm text-kamsen-medium">
                            Équipement #{tracking.equipmentId}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-kamsen-light" />
                            <span className="font-medium">{tracking.city}</span>
                            {tracking.address && (
                              <span className="text-kamsen-medium">- {tracking.address}</span>
                            )}
                          </div>

                          {tracking.actualArrival && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-kamsen-light" />
                              <span className="text-kamsen-medium">
                                Livré le: {formatDateTime(tracking.actualArrival)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {trackingData.length === 0 && (
        <div className="text-center py-12 text-kamsen-medium">
          <Navigation className="h-24 w-24 mx-auto mb-6 opacity-30" />
          <h3 className="text-lg font-medium mb-2">Aucun suivi GPS disponible</h3>
          <p className="text-sm">
            {userType === 'admin' 
              ? 'Aucun équipement n\'est actuellement suivi par GPS.' 
              : userType === 'partner'
              ? 'Aucun de vos équipements n\'est actuellement en location avec suivi GPS.'
              : 'Aucune de vos réservations n\'est actuellement suivie par GPS.'}
          </p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={loadTrackingData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      )}
    </div>
  );
}