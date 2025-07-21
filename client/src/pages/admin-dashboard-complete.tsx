import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
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
  DollarSign
} from "lucide-react";

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
}

function formatPrice(price: number): string {
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
      
      // Load bookings
      const bookingsResponse = await fetch("/api/admin/bookings");
      const bookingsData = bookingsResponse.ok ? await bookingsResponse.json() : [];
      setBookings(bookingsData);

      // Load equipment
      const equipmentResponse = await fetch("/api/equipment");
      const equipmentData = equipmentResponse.ok ? await equipmentResponse.json() : [];
      setEquipment(equipmentData);

      // Calculate stats
      const totalRevenue = bookingsData
        .filter((b: Booking) => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum: number, b: Booking) => sum + b.totalPrice, 0);

      setStats({
        totalBookings: bookingsData.length,
        totalRevenue,
        pendingBookings: bookingsData.filter((b: Booking) => b.status === 'pending').length,
        confirmedBookings: bookingsData.filter((b: Booking) => b.status === 'confirmed').length,
        totalEquipment: equipmentData.length,
        availableEquipment: equipmentData.filter((e: Equipment) => e.isAvailable).length
      });

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <p className="text-2xl font-bold text-green-600">{formatPrice(stats.totalRevenue)}</p>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="equipment">Équipements</TabsTrigger>
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
                        <span className="font-bold text-sm">{formatPrice(booking.totalPrice)}</span>
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
                        <p className="text-xs text-gray-500">{formatPrice(equipment.pricePerDay)}/jour</p>
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
                      <p className="font-bold">{formatPrice(booking.totalPrice)}</p>
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
              <CardTitle>Gestion des Équipements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipment.slice(0, 12).map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{item.name}</h3>
                      <Badge variant={item.isAvailable ? "default" : "secondary"}>
                        {item.isAvailable ? "Disponible" : "Indisponible"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                    <p className="font-bold">{formatPrice(item.pricePerDay)}/jour</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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