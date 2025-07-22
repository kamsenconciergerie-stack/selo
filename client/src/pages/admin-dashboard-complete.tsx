import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Calendar, 
  Users, 
  Truck, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  BarChart3,
  FileText,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  ExternalLink,
  Clock
} from "lucide-react";
import { formatPrice, formatPriceWithPrefix } from "@/lib/constants";

interface Booking {
  id: number;
  equipmentId: number;
  equipmentName?: string;
  equipmentCategory?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus?: string;
  notes?: string;
  createdAt: string;
}

interface Equipment {
  id: number;
  name: string;
  category: string;
  pricePerDay: number;
  location: string;
  isAvailable: boolean;
}

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalEquipment: number;
  availableEquipment: number;
  partnerRequests?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

interface PartnerRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website: string;
  equipmentCategories: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

function PartnerRequestsList() {
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/admin/partner-requests');
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        }
      } catch (error) {
        console.error('Error fetching partner requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune demande de partenariat enregistrée
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">En Attente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejetée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Info partenaire */}
              <div className="md:col-span-2">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold text-gray-900">
                    {request.firstName} {request.lastName}
                  </h5>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{request.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{request.phone}</span>
                  </div>
                  {request.website && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <a 
                        href={request.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {request.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(request.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Catégories d'équipements */}
              <div>
                <h6 className="font-medium text-gray-900 mb-2">Catégories d'intérêt</h6>
                <div className="flex flex-wrap gap-1">
                  {request.equipmentCategories.map((category) => (
                    <Badge 
                      key={category} 
                      variant="secondary" 
                      className="text-xs bg-blue-50 text-blue-700"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {request.status === 'pending' && (
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approuver
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="h-4 w-4 mr-1" />
                  Rejeter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function formatPriceLocal(price: number): string {
  return `${price.toLocaleString('fr-FR')} FCFA`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
}

function EquipmentWithUnavailabilityList() {
  const { data: equipmentData = [], isLoading } = useQuery({
    queryKey: ["/api/admin/equipment-with-unavailability"],
  });

  const equipment = equipmentData as any[];

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {equipment.map((eq: any) => (
        <Card key={eq.id} className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Information équipement */}
              <div className="lg:col-span-1">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-lg">{eq.name}</h4>
                  <Badge 
                    className={eq.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  >
                    {eq.isAvailable ? 'Disponible' : 'Indisponible'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{eq.category}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4" />
                  {eq.location}
                </div>
                <p className="font-bold text-orange-600">{formatPriceWithPrefix(eq.pricePerDay)}/jour</p>
              </div>

              {/* Informations partenaire */}
              <div className="lg:col-span-1">
                <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Informations Partenaire
                </h5>
                {eq.partnerInfo ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Partenaire:</span> {eq.partnerInfo.partnerName}
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span className="font-medium">Dernière MAJ:</span> 
                      <span className="text-gray-600">{formatDate(eq.partnerInfo.lastUpdate)}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucune information partenaire</p>
                )}
              </div>

              {/* Périodes d'indisponibilité */}
              <div className="lg:col-span-1">
                <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Indisponibilités
                </h5>
                {eq.unavailabilityPeriods && eq.unavailabilityPeriods.length > 0 ? (
                  <div className="space-y-3">
                    {eq.unavailabilityPeriods.map((period: any) => (
                      <div key={period.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="outline" 
                            className={
                              period.reason === 'maintenance' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              period.reason === 'repair' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }
                          >
                            {period.reason === 'maintenance' ? 'Maintenance' :
                             period.reason === 'repair' ? 'Réparation' : 'Location externe'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          Du {format(new Date(period.startDate), 'dd MMM', { locale: fr })} au {format(new Date(period.endDate), 'dd MMM yyyy', { locale: fr })}
                        </p>
                        <p className="text-xs text-gray-700">{period.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucune indisponibilité prévue</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdminDashboardContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalEquipment: 0,
    availableEquipment: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load admin stats first
      const statsResponse = await fetch("/api/admin/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load bookings
      const bookingsResponse = await fetch("/api/admin/bookings");
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }

      // Load equipment
      const equipmentResponse = await fetch("/api/equipment");
      if (equipmentResponse.ok) {
        const equipmentData = await equipmentResponse.json();
        setEquipment(equipmentData);
      }

    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        loadDashboardData();
        alert("Statut mis à jour avec succès");
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const getRecentBookings = () => {
    return bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getPopularEquipment = () => {
    const equipmentBookings = bookings.reduce((acc: { [key: number]: number }, booking) => {
      acc[booking.equipmentId] = (acc[booking.equipmentId] || 0) + 1;
      return acc;
    }, {});

    return equipment
      .map(eq => ({
        ...eq,
        bookingCount: equipmentBookings[eq.id] || 0
      }))
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 5);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          Dashboard Administrateur Aywa
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de la plateforme de location d'équipements
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Réservations</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires</p>
                <p className="text-2xl font-bold text-green-600">{formatPriceLocal(stats.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingBookings}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Demandes Partenaires</p>
                <p className="text-3xl font-bold text-purple-600">{stats.partnerRequests?.total || 0}</p>
                <p className="text-xs text-purple-500 mt-1">{stats.partnerRequests?.pending || 0} en attente</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Équipements Actifs</p>
                <p className="text-3xl font-bold text-blue-600">{stats.availableEquipment}/{stats.totalEquipment}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu par onglets */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="equipment">Équipements</TabsTrigger>
          <TabsTrigger value="partners">Partenaires</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Réservations récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Réservations Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecentBookings().map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-sm text-gray-600">{booking.equipmentName || `Équipement #${booking.equipmentId}`}</p>
                        <p className="text-sm text-gray-500">{formatDate(booking.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {booking.status === 'confirmed' ? 'Confirmée' :
                           booking.status === 'pending' ? 'En attente' :
                           booking.status === 'completed' ? 'Terminée' : 'Annulée'}
                        </Badge>
                        <span className="font-bold text-sm">{formatPriceLocal(booking.totalPrice)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Équipements populaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Équipements Populaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getPopularEquipment().map((equipment) => (
                    <div key={equipment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{equipment.name}</p>
                        <p className="text-sm text-gray-600">{equipment.category}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {equipment.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{equipment.bookingCount} réservations</p>
                        <p className="text-xs text-gray-500">{formatPriceWithPrefix(equipment.pricePerDay)}/jour</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.slice(0, 10).map((booking) => (
                  <div key={booking.id} className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-sm text-gray-600">{booking.customerEmail}</p>
                      <p className="text-sm text-gray-600">{booking.customerPhone}</p>
                    </div>
                    <div>
                      <p className="font-medium">{booking.equipmentName || `Équipement #${booking.equipmentId}`}</p>
                      <p className="text-sm text-gray-600">{booking.equipmentCategory}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{formatDate(booking.startDate)}</p>
                      <p className="text-sm text-gray-600">au {formatDate(booking.endDate)}</p>
                    </div>
                    <div>
                      <p className="font-bold">{formatPriceLocal(booking.totalPrice)}</p>
                      <Badge 
                        className={
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {booking.status === 'confirmed' ? 'Confirmée' :
                         booking.status === 'pending' ? 'En attente' :
                         booking.status === 'completed' ? 'Terminée' : 'Annulée'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirmer
                        </Button>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Terminer
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Équipements avec Indisponibilités</CardTitle>
            </CardHeader>
            <CardContent>
              <EquipmentWithUnavailabilityList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Réseau de Partenaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats.partnerRequests?.total || 15}</p>
                    <p className="text-sm text-gray-600">Total Partenaires</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{(stats.partnerRequests?.total || 15) - (stats.partnerRequests?.pending || 2)}</p>
                    <p className="text-sm text-gray-600">Partenaires Actifs</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{stats.partnerRequests?.pending || 2}</p>
                    <p className="text-sm text-gray-600">En Attente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Partenaires récents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Transport Express Dakar</p>
                      <p className="text-sm text-gray-600">Dakar - Transport routier</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Vérifié</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Logistique Sénégal Pro</p>
                      <p className="text-sm text-gray-600">Thiès - Logistique</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Répartition géographique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Dakar</span>
                    <span className="font-bold">8 partenaires</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Thiès</span>
                    <span className="font-bold">3 partenaires</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Kaolack</span>
                    <span className="font-bold">2 partenaires</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Partenaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Transport Express Dakar</p>
                      <p className="text-sm text-gray-600">Note: 4.8/5 - 45 commandes</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-green-600">95%</span>
                      <p className="text-xs text-gray-500">Taux de réussite</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Camions Sahel</p>
                      <p className="text-sm text-gray-600">Note: 4.6/5 - 32 commandes</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-green-600">92%</span>
                      <p className="text-xs text-gray-500">Taux de réussite</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Actions requises
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium">Validation partenaire</p>
                      <p className="text-sm text-gray-600">Logistique Sénégal Pro - en attente</p>
                    </div>
                    <Button size="sm" className="bg-primary-orange hover:bg-primary-orange/90">
                      Examiner
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Réservation litigieuse</p>
                      <p className="text-sm text-gray-600">Commande #4521 - client mécontent</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Résoudre
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Répartition par Statut
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">En attente</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded">
                        <div 
                          className="h-2 bg-yellow-500 rounded" 
                          style={{ width: `${(stats.pendingBookings / stats.totalBookings) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{stats.pendingBookings}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Confirmées</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded">
                        <div 
                          className="h-2 bg-green-500 rounded" 
                          style={{ width: `${(stats.confirmedBookings / stats.totalBookings) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{stats.confirmedBookings}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Terminées</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded">
                        <div 
                          className="h-2 bg-blue-500 rounded" 
                          style={{ width: `${(bookings.filter(b => b.status === 'completed').length / stats.totalBookings) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{bookings.filter(b => b.status === 'completed').length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Catégories Populaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    bookings.reduce((acc: { [key: string]: number }, booking) => {
                      const category = booking.equipmentCategory || 'Non catégorisé';
                      acc[category] = (acc[category] || 0) + 1;
                      return acc;
                    }, {})
                  )
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded">
                          <div 
                            className="h-2 bg-primary-orange rounded" 
                            style={{ width: `${(count / stats.totalBookings) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Demandes de Partenariat ({stats.partnerRequests?.total || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">{stats.partnerRequests?.pending || 0}</p>
                          <p className="text-sm text-gray-600">En Attente</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{stats.partnerRequests?.approved || 0}</p>
                          <p className="text-sm text-gray-600">Approuvées</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{stats.partnerRequests?.rejected || 0}</p>
                          <p className="text-sm text-gray-600">Rejetées</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Liste des demandes */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Demandes Récentes</h4>
                    <PartnerRequestsList />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions rapides */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => window.open('/admin/reservations', '_blank')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Gestion Complète des Réservations
            </Button>
            <Button 
              variant="outline"
              onClick={() => loadDashboardData()}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Actualiser les Données
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open('/equipements', '_blank')}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Voir Catalogue Public
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboardComplete() {
  return (
    <ProtectedAdminRoute>
      <AdminDashboardContent />
    </ProtectedAdminRoute>
  );
}