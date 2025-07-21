import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Calendar,
  TrendingUp,
  DollarSign,
  Truck,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Star,
  Phone,
  Mail,
  MapPin,
  Building,
  Users,
  Award,
  Download,
  LogOut
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { EquipmentUnavailabilityManager } from "@/components/EquipmentUnavailabilityManager";

interface PartnerBooking {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  equipmentId: number;
  equipmentName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

interface PartnerStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
  equipmentCount: number;
}

interface PartnerInfo {
  id: number;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  businessType: string;
  rating: number;
  isVerified: boolean;
  joinedAt: string;
}

const statusConfig = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmée", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  in_progress: { label: "En cours", color: "bg-purple-100 text-purple-800", icon: Truck },
  completed: { label: "Terminée", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Annulée", color: "bg-red-100 text-red-800", icon: XCircle }
};

const COLORS = ['#FF8800', '#00C49F', '#FFBB28', '#FF8042'];

function PartnerDashboardContent() {
  const [partner, setPartner] = useState<PartnerInfo | null>(null);
  const [bookings, setBookings] = useState<PartnerBooking[]>([]);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<PartnerBooking | null>(null);
  const [revenueData, setRevenueData] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadPartnerData();
  }, []);

  const loadPartnerData = async () => {
    try {
      setIsLoading(true);
      
      // Get partner ID from session or URL
      const partnerId = sessionStorage.getItem("partnerId") || "1";
      
      // Load partner info and data
      await Promise.all([
        loadPartnerInfo(partnerId),
        loadPartnerBookings(partnerId),
        loadPartnerStats(partnerId),
        loadAnalyticsData(partnerId)
      ]);
      
    } catch (error) {
      console.error("Error loading partner data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPartnerInfo = async (partnerId: string) => {
    // Mock partner data - replace with actual API call
    const mockPartner: PartnerInfo = {
      id: parseInt(partnerId),
      companyName: "Transport Express Dakar",
      email: "contact@transportexpress.sn",
      phone: "+221 77 123 45 67",
      city: "Dakar",
      businessType: "Transport routier",
      rating: 4.8,
      isVerified: true,
      joinedAt: "2023-03-15T10:00:00Z"
    };
    setPartner(mockPartner);
  };

  const loadPartnerBookings = async (partnerId: string) => {
    // Mock bookings data - replace with actual API call
    const mockBookings: PartnerBooking[] = [
      {
        id: 1,
        customerName: "Amadou Ba",
        customerEmail: "amadou.ba@email.com",
        customerPhone: "+221 77 234 56 78",
        equipmentId: 1,
        equipmentName: "Camion benne 15T",
        startDate: "2025-01-22T08:00:00Z",
        endDate: "2025-01-25T18:00:00Z",
        totalPrice: 180000,
        status: "confirmed",
        createdAt: "2025-01-20T10:30:00Z",
        paymentStatus: "paid"
      },
      {
        id: 2,
        customerName: "Fatou Diop",
        customerEmail: "fatou.diop@entreprise.sn",
        customerPhone: "+221 76 345 67 89",
        equipmentId: 2,
        equipmentName: "Camion porteur 8T",
        startDate: "2025-01-23T09:00:00Z",
        endDate: "2025-01-24T17:00:00Z",
        totalPrice: 95000,
        status: "in_progress",
        createdAt: "2025-01-19T14:15:00Z",
        paymentStatus: "paid"
      },
      {
        id: 3,
        customerName: "Ousmane Ndiaye",
        customerEmail: "ousmane@construction.sn",
        customerPhone: "+221 78 456 78 90",
        equipmentId: 3,
        equipmentName: "Semi-remorque 40T",
        startDate: "2025-01-26T07:00:00Z",
        endDate: "2025-01-28T19:00:00Z",
        totalPrice: 275000,
        status: "pending",
        createdAt: "2025-01-21T11:20:00Z",
        paymentStatus: "pending"
      }
    ];
    setBookings(mockBookings);
  };

  const loadPartnerStats = async (partnerId: string) => {
    // Calculate stats from bookings - replace with actual API call
    const mockStats: PartnerStats = {
      totalBookings: 156,
      activeBookings: 8,
      completedBookings: 142,
      totalRevenue: 12500000,
      monthlyRevenue: 2100000,
      averageRating: 4.8,
      totalReviews: 89,
      equipmentCount: 25
    };
    setStats(mockStats);
  };

  const loadAnalyticsData = async (partnerId: string) => {
    // Mock analytics data - replace with actual API call
    const mockRevenueData = [
      { month: "Sep", revenus: 1800000 },
      { month: "Oct", revenus: 2200000 },
      { month: "Nov", revenus: 1950000 },
      { month: "Déc", revenus: 2400000 },
      { month: "Jan", revenus: 2100000 }
    ];
    
    const mockBookingTrends = [
      { semaine: "S1", reservations: 12, completees: 10, annulees: 2 },
      { semaine: "S2", reservations: 15, completees: 13, annulees: 1 },
      { semaine: "S3", reservations: 18, completees: 16, annulees: 1 },
      { semaine: "S4", reservations: 14, completees: 12, annulees: 2 }
    ];

    setRevenueData(mockRevenueData);
    setBookingTrends(mockBookingTrends);
  };

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      // Mock API call - replace with actual implementation
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus as any } : booking
      );
      setBookings(updatedBookings);
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la réservation a été modifié avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    }
  };

  const exportBookingsData = () => {
    const csvData = bookings.map(booking => ({
      'ID': booking.id,
      'Client': booking.customerName,
      'Email': booking.customerEmail,
      'Téléphone': booking.customerPhone,
      'Équipement': booking.equipmentName,
      'Date début': new Date(booking.startDate).toLocaleDateString('fr-FR'),
      'Date fin': new Date(booking.endDate).toLocaleDateString('fr-FR'),
      'Prix total': booking.totalPrice,
      'Statut': statusConfig[booking.status].label,
      'Paiement': booking.paymentStatus === 'paid' ? 'Payé' : 'En attente',
      'Créé le': new Date(booking.createdAt).toLocaleDateString('fr-FR')
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(key => `"${(row as any)[key] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reservations-${partner?.companyName?.replace(/\s+/g, '-').toLowerCase()}-${new Date().toLocaleDateString('fr-FR')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: `${bookings.length} réservations exportées en CSV`,
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("partnerId");
    sessionStorage.removeItem("partnerToken");
    window.location.href = "/adminpartners";
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('fr-FR')} FCFA`;
  };

  const getActiveBookings = () => {
    return bookings.filter(b => ['confirmed', 'in_progress'].includes(b.status));
  };

  const getPendingBookings = () => {
    return bookings.filter(b => b.status === 'pending');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-4">Impossible de charger les informations du partenaire</p>
          <Button onClick={() => window.location.href = "/adminpartners"}>
            Retour à la connexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary-orange rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{partner.companyName}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{partner.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{partner.rating}/5</span>
                  </div>
                  {partner.isVerified && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Vérifié
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Réservations actives</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.activeBookings}</p>
                  </div>
                  <Truck className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total réservations</p>
                    <p className="text-3xl font-bold text-green-600">{stats.totalBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenus ce mois</p>
                    <p className="text-3xl font-bold text-primary-orange">{formatPrice(stats.monthlyRevenue)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.averageRating}/5</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
            <TabsTrigger value="unavailability">Indisponibilités</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Réservations</h2>
              <Button onClick={exportBookingsData} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>

            {/* Active Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Réservations en cours ({getActiveBookings().length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getActiveBookings().map((booking) => {
                    const StatusIcon = statusConfig[booking.status].icon;
                    return (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold">{booking.customerName}</span>
                            <Badge className={statusConfig[booking.status].color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[booking.status].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{booking.equipmentName}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(booking.startDate), "dd/MM/yyyy", { locale: fr })} - {format(new Date(booking.endDate), "dd/MM/yyyy", { locale: fr })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatPrice(booking.totalPrice)}</p>
                            <p className="text-sm text-gray-500">{booking.paymentStatus === 'paid' ? '✓ Payé' : 'En attente'}</p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedBooking(booking)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            {getPendingBookings().length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    En attente d'approbation ({getPendingBookings().length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getPendingBookings().map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold">{booking.customerName}</span>
                            <Badge className="bg-yellow-100 text-yellow-800">Nouveau</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{booking.equipmentName}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(booking.startDate), "dd/MM/yyyy", { locale: fr })} - {format(new Date(booking.endDate), "dd/MM/yyyy", { locale: fr })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right mr-4">
                            <p className="font-bold text-lg">{formatPrice(booking.totalPrice)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approuver
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            >
                              Rejeter
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Equipment Unavailability Tab */}
          <TabsContent value="unavailability" className="space-y-6">
            <EquipmentUnavailabilityManager partnerId={partner.id} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des revenus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                        <Tooltip formatter={(value) => formatPrice(Number(value))} />
                        <Line type="monotone" dataKey="revenus" stroke="#FF8800" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tendances des réservations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bookingTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="semaine" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="reservations" fill="#FF8800" name="Nouvelles" />
                        <Bar dataKey="completees" fill="#00C49F" name="Terminées" />
                        <Bar dataKey="annulees" fill="#FF8042" name="Annulées" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informations du partenaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nom de l'entreprise</label>
                      <Input value={partner.companyName} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <Input value={partner.email} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Téléphone</label>
                      <Input value={partner.phone} disabled />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Ville</label>
                      <Input value={partner.city} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Type d'activité</label>
                      <Input value={partner.businessType} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Membre depuis</label>
                      <Input value={format(new Date(partner.joinedAt), "dd/MM/yyyy", { locale: fr })} disabled />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Détails de la réservation #{selectedBooking.id}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Client</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Nom:</strong> {selectedBooking.customerName}</p>
                      <p><strong>Email:</strong> {selectedBooking.customerEmail}</p>
                      <p><strong>Téléphone:</strong> {selectedBooking.customerPhone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Réservation</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Équipement:</strong> {selectedBooking.equipmentName}</p>
                      <p><strong>Début:</strong> {format(new Date(selectedBooking.startDate), "dd/MM/yyyy HH:mm", { locale: fr })}</p>
                      <p><strong>Fin:</strong> {format(new Date(selectedBooking.endDate), "dd/MM/yyyy HH:mm", { locale: fr })}</p>
                      <p><strong>Prix total:</strong> {formatPrice(selectedBooking.totalPrice)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Badge className={statusConfig[selectedBooking.status].color}>
                      {statusConfig[selectedBooking.status].label}
                    </Badge>
                    <Badge className={selectedBooking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {selectedBooking.paymentStatus === 'paid' ? 'Payé' : 'Paiement en attente'}
                    </Badge>
                  </div>
                  
                  {selectedBooking.status === 'confirmed' && (
                    <Button onClick={() => updateBookingStatus(selectedBooking.id, 'in_progress')}>
                      Marquer en cours
                    </Button>
                  )}
                  
                  {selectedBooking.status === 'in_progress' && (
                    <Button onClick={() => updateBookingStatus(selectedBooking.id, 'completed')} className="bg-green-600 hover:bg-green-700">
                      Marquer terminée
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default function PartnerDashboard() {
  return <PartnerDashboardContent />;
}