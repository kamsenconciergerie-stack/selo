import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
  Clock,
  Navigation,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { formatPrice, formatPriceWithPrefix } from "@/lib/constants";
import TrackingDashboard from "@/components/TrackingDashboard";

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
  kamsenEarnings: number; // 💰 Gains totaux de Kamsen (15% de commission)
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
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/partners/applications');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        console.error('Failed to fetch partner requests:', response.status);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveMutation = useMutation({
    mutationFn: async (requestId: number) => {
      return await apiRequest(`/api/partners/applications/${requestId}/review`, {
        method: 'POST',
        body: JSON.stringify({
          status: 'approved',
          notes: 'Demande approuvée par l\'administrateur'
        })
      });
    },
    onSuccess: () => {
      toast({
        title: 'Demande approuvée',
        description: 'La demande de partenariat a été approuvée avec succès.',
      });
      fetchRequests(); // Refresh the list
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'approbation.',
        variant: 'destructive'
      });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: number; reason: string }) => {
      return await apiRequest(`/api/partners/applications/${requestId}/review`, {
        method: 'POST',
        body: JSON.stringify({
          status: 'rejected',
          notes: reason
        })
      });
    },
    onSuccess: () => {
      toast({
        title: 'Demande rejetée',
        description: 'La demande de partenariat a été rejetée.',
      });
      setRejectionModalOpen(false);
      setRejectionReason('');
      setSelectedRequestId(null);
      fetchRequests(); // Refresh the list
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du rejet.',
        variant: 'destructive'
      });
    }
  });

  const handleApprove = (requestId: number) => {
    approveMutation.mutate(requestId);
  };

  const handleRejectClick = (requestId: number) => {
    setSelectedRequestId(requestId);
    setRejectionModalOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedRequestId || rejectionReason.trim().length < 10) {
      toast({
        title: 'Commentaire requis',
        description: 'Veuillez saisir un motif de refus d\'au moins 10 caractères.',
        variant: 'destructive'
      });
      return;
    }
    rejectMutation.mutate({ requestId: selectedRequestId, reason: rejectionReason.trim() });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-kamsen-gray">
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
    <>
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Info partenaire */}
                <div className="md:col-span-2">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-kamsen-blue">
                      {request.firstName} {request.lastName}
                    </h5>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="space-y-1 text-sm text-kamsen-gray">
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
                          className="text-kamsen-blue hover:underline"
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
                  <h6 className="font-medium text-kamsen-blue mb-2">Catégories d'intérêt</h6>
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
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(request.id)}
                    disabled={approveMutation.isPending}
                    data-testid={`button-approve-${request.id}`}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {approveMutation.isPending ? 'Approbation...' : 'Approuver'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleRejectClick(request.id)}
                    disabled={rejectMutation.isPending}
                    data-testid={`button-reject-${request.id}`}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejeter
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Modal de refus */}
      <Dialog open={rejectionModalOpen} onOpenChange={setRejectionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rejeter la demande de partenariat</DialogTitle>
            <DialogDescription>
              Veuillez indiquer le motif du refus. Ce commentaire sera visible par le demandeur.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Motif du refus *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Expliquez pourquoi cette demande est rejetée (minimum 10 caractères)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
                rows={4}
                data-testid="textarea-rejection-reason"
              />
              <p className="text-xs text-gray-500 mt-1">
                {rejectionReason.length}/10 caractères minimum
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setRejectionModalOpen(false);
                  setRejectionReason('');
                  setSelectedRequestId(null);
                }}
                disabled={rejectMutation.isPending}
                data-testid="button-cancel-rejection"
              >
                Annuler
              </Button>
              <Button 
                variant="destructive"
                onClick={handleRejectConfirm}
                disabled={rejectMutation.isPending || rejectionReason.trim().length < 10}
                data-testid="button-confirm-rejection"
              >
                {rejectMutation.isPending ? 'Rejet en cours...' : 'Confirmer le rejet'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatPriceLocal(price: number): string {
  return `${price.toLocaleString('fr-FR')} XOF`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
}

function EquipmentOwnersViewer() {
  const [equipmentOwners, setEquipmentOwners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEquipmentOwners = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/equipment-owners');
        if (response.ok) {
          const data = await response.json();
          setEquipmentOwners(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipmentOwners();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Chargement des propriétaires d'équipements...</div>;
  }

  // Grouper les équipements par ID pour afficher les propriétaires multiples
  const groupedEquipment = equipmentOwners.reduce((acc, item) => {
    if (!acc[item.equipment_id]) {
      acc[item.equipment_id] = {
        id: item.equipment_id,
        name: item.equipment_name,
        category: item.category,
        price_per_day: item.price_per_day,
        location: item.location,
        is_available: item.is_available,
        partners: []
      };
    }
    
    if (item.partner_id) {
      acc[item.equipment_id].partners.push({
        id: item.partner_id,
        name: item.partner_name,
        ownership_type: item.ownership_type,
        registration_number: item.registration_number,
        fleet_active: item.fleet_active
      });
    }
    
    return acc;
  }, {});

  const equipmentList = Object.values(groupedEquipment) as any[];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-kamsen-blue">{equipmentList.length}</p>
              <p className="text-sm text-kamsen-gray">Équipements Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {equipmentList.filter(eq => eq.partners.length > 0).length}
              </p>
              <p className="text-sm text-kamsen-gray">Avec Propriétaires</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {equipmentList.filter(eq => eq.partners.length === 0).length}
              </p>
              <p className="text-sm text-kamsen-gray">Sans Propriétaire</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {equipmentList.map((eq: any) => (
        <Card key={eq.id} className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Information équipement */}
              <div className="lg:col-span-1">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-lg">{eq.name}</h4>
                  <Badge 
                    className={eq.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  >
                    {eq.is_available ? 'Disponible' : 'Indisponible'}
                  </Badge>
                </div>
                <p className="text-sm text-kamsen-gray mb-2">{eq.category}</p>
                <div className="flex items-center gap-2 text-sm text-kamsen-gray mb-2">
                  <MapPin className="h-4 w-4" />
                  {eq.location}
                </div>
                <p className="font-bold text-orange-600">{formatPriceLocal(eq.price_per_day)}/jour</p>
              </div>

              {/* Propriétaires */}
              <div className="lg:col-span-2">
                <h5 className="font-medium text-kamsen-blue mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Propriétaires ({eq.partners.length})
                </h5>
                {eq.partners.length > 0 ? (
                  <div className="space-y-3">
                    {eq.partners.map((partner: any, index: number) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h6 className="font-semibold text-kamsen-blue">{partner.name}</h6>
                          <Badge 
                            variant="outline" 
                            className={
                              partner.ownership_type === 'owned' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-orange-50 text-orange-700 border-orange-200'
                            }
                          >
                            {partner.ownership_type === 'owned' ? 'Propriétaire' : 'En Location'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Immatriculation:</span>
                            <p className="text-kamsen-gray">{partner.registration_number}</p>
                          </div>
                          <div>
                            <span className="font-medium">Statut:</span>
                            <p className={partner.fleet_active ? 'text-green-600' : 'text-red-600'}>
                              {partner.fleet_active ? 'Actif' : 'Inactif'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-700 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Aucun propriétaire assigné - Équipement Kamsen Direct
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
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
                    className={eq.isAvailable ? 'bg-kamsen-blue-light text-green-800' : 'bg-red-100 text-red-800'}
                  >
                    {eq.isAvailable ? 'Disponible' : 'Indisponible'}
                  </Badge>
                </div>
                <p className="text-sm text-kamsen-gray mb-2">{eq.category}</p>
                <div className="flex items-center gap-2 text-sm text-kamsen-gray mb-2">
                  <MapPin className="h-4 w-4" />
                  {eq.location}
                </div>
                <p className="font-bold text-orange-600">{formatPriceWithPrefix(eq.pricePerDay)}/jour</p>
              </div>

              {/* Informations partenaire */}
              <div className="lg:col-span-1">
                <h5 className="font-medium text-kamsen-blue mb-3 flex items-center gap-2">
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
                      <span className="text-kamsen-gray">{formatDate(eq.partnerInfo.lastUpdate)}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-kamsen-gray">Aucune information partenaire</p>
                )}
              </div>

              {/* Périodes d'indisponibilité */}
              <div className="lg:col-span-1">
                <h5 className="font-medium text-kamsen-blue mb-3 flex items-center gap-2">
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
                        <p className="text-xs text-kamsen-gray mb-1">
                          Du {format(new Date(period.startDate), 'dd MMM', { locale: fr })} au {format(new Date(period.endDate), 'dd MMM yyyy', { locale: fr })}
                        </p>
                        <p className="text-xs text-kamsen-blue">{period.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-kamsen-gray">Aucune indisponibilité prévue</p>
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
    kamsenEarnings: 0,
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
      
      // Use real API data instead of mock data
      console.log("Loading real admin data from APIs");

      // Load real bookings from admin API
      const bookingsResponse = await fetch("/api/admin/bookings");
      let bookingsData: any[] = [];
      if (bookingsResponse.ok) {
        bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      } else {
        console.error("Failed to load bookings from admin API");
        // Fallback to regular bookings API
        const fallbackResponse = await fetch("/api/bookings");
        if (fallbackResponse.ok) {
          bookingsData = await fallbackResponse.json();
          setBookings(bookingsData);
        }
      }

      // Load equipment
      const equipmentResponse = await fetch("/api/equipment");
      let equipmentData: any[] = [];
      if (equipmentResponse.ok) {
        equipmentData = await equipmentResponse.json();
        setEquipment(equipmentData);
      }

      // Load real stats from admin API
      const statsResponse = await fetch("/api/admin/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          totalBookings: statsData.totalBookings || 0,
          totalRevenue: statsData.totalRevenue || 0,
          kamsenEarnings: statsData.kamsenEarnings || 0,
          pendingBookings: statsData.pendingBookings || 0,
          confirmedBookings: statsData.confirmedBookings || 0,
          totalEquipment: statsData.totalEquipment || 0,
          availableEquipment: statsData.availableEquipment || 0,
          partnerRequests: statsData.partnerRequests || { total: 0, pending: 0, approved: 0, rejected: 0 }
        });
      } else {
        // Fallback to calculated stats if API fails
        if (bookingsData && equipmentData) {
          const totalRevenue = bookingsData
            .filter((b: any) => b.status === 'confirmed' || b.status === 'completed')
            .reduce((sum: number, b: any) => sum + b.totalPrice, 0);

          setStats({
            totalBookings: bookingsData.length,
            totalRevenue,
            kamsenEarnings: totalRevenue * 0.15, // 15% commission
            pendingBookings: bookingsData.filter((b: any) => b.status === 'pending').length,
            confirmedBookings: bookingsData.filter((b: any) => b.status === 'confirmed').length,
            totalEquipment: equipmentData.length,
            availableEquipment: equipmentData.filter((e: any) => e.isAvailable).length,
            partnerRequests: { total: 0, pending: 0, approved: 0, rejected: 0 }
          });
        }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header avec logo Kamsen */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/images/kamsen-logo-new.svg" 
                alt="Kamsen - Des charges en moins" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-kamsen-blue">Dashboard Administrateur</h1>
                <p className="text-sm text-kamsen-gray">Gestion complète de la plateforme Kamsen</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-kamsen-gray">
              <span>Connecté en tant qu'administrateur</span>
              <a 
                href="/" 
                className="bg-kamsen-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Voir le Site
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-kamsen-blue mb-2">
            Vue d'Ensemble
          </h2>
          <p className="text-kamsen-gray">
            Statistiques et gestion de la plateforme de location d'équipements
          </p>
        </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-kamsen-gray">Total Réservations</p>
                <p className="text-3xl font-bold text-kamsen-blue">{stats.totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-kamsen-gray">Chiffre d'Affaires</p>
                <p className="text-2xl font-bold text-kamsen-blue">{formatPriceLocal(stats.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-kamsen-gray">Gains Kamsen (15%)</p>
                <p className="text-2xl font-bold text-kamsen-orange">{formatPriceLocal(stats.kamsenEarnings)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-kamsen-orange" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-kamsen-gray">En Attente</p>
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
                <p className="text-sm font-medium text-kamsen-gray">Demandes Partenaires</p>
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
                <p className="text-sm font-medium text-kamsen-gray">Équipements Actifs</p>
                <p className="text-3xl font-bold text-kamsen-blue">{stats.availableEquipment}/{stats.totalEquipment}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu par onglets */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="equipment">Équipements</TabsTrigger>
          <TabsTrigger value="owners">Propriétaires</TabsTrigger>
          <TabsTrigger value="partners">Partenaires</TabsTrigger>
          <TabsTrigger value="tracking">Suivi GPS</TabsTrigger>
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
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-kamsen-blue-light rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-sm text-kamsen-gray">{booking.equipmentName || `Équipement #${booking.equipmentId}`}</p>
                        <p className="text-sm text-kamsen-gray">{formatDate(booking.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            booking.status === 'confirmed' ? 'bg-kamsen-blue-light text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'completed' ? 'bg-kamsen-blue-light text-blue-800' :
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
                    <div key={equipment.id} className="flex items-center justify-between p-3 bg-kamsen-blue-light rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{equipment.name}</p>
                        <p className="text-sm text-kamsen-gray">{equipment.category}</p>
                        <div className="flex items-center gap-2 text-sm text-kamsen-gray">
                          <MapPin className="h-3 w-3" />
                          {equipment.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{equipment.bookingCount} réservations</p>
                        <p className="text-xs text-kamsen-gray">{formatPriceWithPrefix(equipment.pricePerDay)}/jour</p>
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
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Gestion Complète des Réservations ({bookings.length})
                </CardTitle>
                <Button 
                  onClick={loadDashboardData}
                  variant="outline"
                  size="sm"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BookingManagementList bookings={bookings} onStatusUpdate={updateBookingStatus} onRefresh={loadDashboardData} />
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

        <TabsContent value="owners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Propriétaires d'Équipements
              </CardTitle>
              <p className="text-sm text-kamsen-gray">Visualisez les propriétaires de chaque équipement et leurs quantités respectives</p>
            </CardHeader>
            <CardContent>
              <EquipmentOwnersViewer />
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
                    <p className="text-2xl font-bold text-kamsen-blue">{stats.partnerRequests?.total || 15}</p>
                    <p className="text-sm text-kamsen-gray">Total Partenaires</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-kamsen-blue">{(stats.partnerRequests?.total || 15) - (stats.partnerRequests?.pending || 2)}</p>
                    <p className="text-sm text-kamsen-gray">Partenaires Actifs</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{stats.partnerRequests?.pending || 2}</p>
                    <p className="text-sm text-kamsen-gray">En Attente</p>
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
                  <div className="flex items-center justify-between p-3 bg-kamsen-blue-light rounded-lg">
                    <div>
                      <p className="font-medium">Transport Express Dakar</p>
                      <p className="text-sm text-kamsen-gray">Dakar - Transport routier</p>
                    </div>
                    <Badge className="bg-kamsen-blue-light text-green-800">Vérifié</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-kamsen-blue-light rounded-lg">
                    <div>
                      <p className="font-medium">Logistique Sénégal Pro</p>
                      <p className="text-sm text-kamsen-gray">Thiès - Logistique</p>
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
                  <div className="flex items-center justify-between p-3 bg-kamsen-blue-light rounded-lg">
                    <div>
                      <p className="font-medium">Transport Express Dakar</p>
                      <p className="text-sm text-kamsen-gray">Note: 4.8/5 - 45 commandes</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-kamsen-blue">95%</span>
                      <p className="text-xs text-kamsen-gray">Taux de réussite</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-kamsen-blue-light rounded-lg">
                    <div>
                      <p className="font-medium">Camions Sahel</p>
                      <p className="text-sm text-kamsen-gray">Note: 4.6/5 - 32 commandes</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-kamsen-blue">92%</span>
                      <p className="text-xs text-kamsen-gray">Taux de réussite</p>
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
                      <p className="text-sm text-kamsen-gray">Logistique Sénégal Pro - en attente</p>
                    </div>
                    <Button size="sm" className="bg-kamsen-blue hover:bg-kamsen-blue/90">
                      Examiner
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Réservation litigieuse</p>
                      <p className="text-sm text-kamsen-gray">Commande #4521 - client mécontent</p>
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
                            className="h-2 bg-kamsen-blue rounded" 
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
            {/* Gestion des Partenaires */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gestion des Partenaires
                  </CardTitle>
                  <Button 
                    className="bg-kamsen-blue hover:bg-kamsen-blue/90"
                    onClick={() => window.open('/partners/register', '_blank')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Partenaire
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <PartnerManagementList />
              </CardContent>
            </Card>

            {/* Demandes de Partenariat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
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
                          <p className="text-sm text-kamsen-gray">En Attente</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-kamsen-blue">{stats.partnerRequests?.approved || 0}</p>
                          <p className="text-sm text-kamsen-gray">Approuvées</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{stats.partnerRequests?.rejected || 0}</p>
                          <p className="text-sm text-kamsen-gray">Rejetées</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Liste des demandes */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-kamsen-blue">Demandes Récentes</h4>
                    <PartnerRequestsList />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Suivi GPS des Équipements en Temps Réel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrackingDashboard userType="admin" />
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
              onClick={() => {
                const bookingsTab = document.querySelector('[data-value="bookings"]') as HTMLElement;
                if (bookingsTab) bookingsTab.click();
              }}
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
    </div>
  );
}

// Composant pour la gestion complète des réservations
function BookingManagementList({ bookings, onStatusUpdate, onRefresh }: { 
  bookings: any[], 
  onStatusUpdate: (id: number, status: string) => void,
  onRefresh: () => void
}) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const deleteBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast({
          title: 'Réservation supprimée',
          description: 'La réservation a été supprimée avec succès.',
        });
        onRefresh();
        setDeleteModalOpen(false);
        setBookingToDelete(null);
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">En Attente</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Terminée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-kamsen-gray">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-kamsen-blue/50" />
        <h3 className="font-semibold text-lg mb-2">Aucune réservation</h3>
        <p className="text-sm">Les nouvelles réservations apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {bookings.filter(b => b.status === 'confirmed').length}
          </p>
          <p className="text-sm text-green-700">Confirmées</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
          <p className="text-sm text-orange-700">En Attente</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {bookings.filter(b => b.status === 'completed').length}
          </p>
          <p className="text-sm text-blue-700">Terminées</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-600">
            {bookings.filter(b => b.status === 'cancelled').length}
          </p>
          <p className="text-sm text-red-700">Annulées</p>
        </div>
      </div>
      
      {bookings.map((booking) => (
        <Card key={booking.id} className="border-l-4 border-l-kamsen-blue">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Informations client */}
              <div>
                <h5 className="font-semibold text-kamsen-blue mb-2">Client</h5>
                <p className="font-medium">{booking.customerName}</p>
                <p className="text-sm text-kamsen-gray">{booking.customerEmail}</p>
                <p className="text-sm text-kamsen-gray">{booking.customerPhone}</p>
              </div>

              {/* Informations équipement */}
              <div>
                <h5 className="font-semibold text-kamsen-blue mb-2">Équipement</h5>
                <p className="font-medium">{booking.equipmentName || `Équipement #${booking.equipmentId}`}</p>
                <p className="text-sm text-kamsen-gray">{booking.equipmentCategory}</p>
                <p className="text-sm text-kamsen-gray">
                  {calculateDuration(booking.startDate, booking.endDate)} jour(s)
                </p>
              </div>

              {/* Dates et prix */}
              <div>
                <h5 className="font-semibold text-kamsen-blue mb-2">Période & Prix</h5>
                <p className="text-sm font-medium">
                  Du {format(new Date(booking.startDate), 'dd MMM', { locale: fr })}
                </p>
                <p className="text-sm text-kamsen-gray">
                  au {format(new Date(booking.endDate), 'dd MMM yyyy', { locale: fr })}
                </p>
                <p className="font-bold text-lg">{formatPriceLocal(booking.totalPrice)}</p>
                <div className="mt-2">
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h5 className="font-semibold text-kamsen-blue mb-2">Actions</h5>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setDetailsModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir Détails
                  </Button>
                  
                  {booking.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => onStatusUpdate(booking.id, 'confirmed')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmer
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                        onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                    </>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <Button 
                      size="sm" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => onStatusUpdate(booking.id, 'completed')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Terminer
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setBookingToDelete(booking.id);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Modal détails réservation */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la Réservation</DialogTitle>
            <DialogDescription>
              Informations complètes sur la réservation sélectionnée.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kamsen-blue mb-2">Informations Client</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nom:</span> {selectedBooking.customerName}</p>
                      <p><span className="font-medium">Email:</span> {selectedBooking.customerEmail}</p>
                      <p><span className="font-medium">Téléphone:</span> {selectedBooking.customerPhone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-kamsen-blue mb-2">Période de Location</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Début:</span> {format(new Date(selectedBooking.startDate), 'dd MMMM yyyy', { locale: fr })}</p>
                      <p><span className="font-medium">Fin:</span> {format(new Date(selectedBooking.endDate), 'dd MMMM yyyy', { locale: fr })}</p>
                      <p><span className="font-medium">Durée:</span> {calculateDuration(selectedBooking.startDate, selectedBooking.endDate)} jour(s)</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kamsen-blue mb-2">Équipement</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nom:</span> {selectedBooking.equipmentName || `Équipement #${selectedBooking.equipmentId}`}</p>
                      <p><span className="font-medium">Catégorie:</span> {selectedBooking.equipmentCategory}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-kamsen-blue mb-2">Facturation</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Prix total:</span> {formatPriceLocal(selectedBooking.totalPrice)}</p>
                      <p><span className="font-medium">Statut:</span> {getStatusBadge(selectedBooking.status)}</p>
                      <p><span className="font-medium">Paiement:</span> {selectedBooking.paymentStatus || 'À la livraison'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedBooking.notes && (
                <div>
                  <h4 className="font-semibold text-kamsen-blue mb-2">Notes</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedBooking.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal confirmation suppression */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={() => bookingToDelete && deleteBooking(bookingToDelete)}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant pour gérer la liste des partenaires
function PartnerManagementList() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/partners');
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
      } else {
        console.error('Failed to fetch partners:', response.status);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des partenaires:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const deletePartner = async (partnerId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) return;
    
    try {
      const response = await fetch(`/api/partners/${partnerId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast({
          title: 'Partenaire supprimé',
          description: 'Le partenaire a été supprimé avec succès.',
        });
        fetchPartners();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">En Attente</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Chargement des partenaires...</div>;
  }

  if (partners.length === 0) {
    return (
      <div className="text-center py-8 text-kamsen-gray">
        Aucun partenaire enregistré
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-kamsen-blue">Partenaires Actifs ({partners.length})</h4>
      </div>
      
      {partners.map((partner) => (
        <Card key={partner.id} className="border-l-4 border-l-kamsen-blue">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h5 className="font-semibold text-lg">{partner.companyName}</h5>
                  {getStatusBadge(partner.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Contact:</span>
                    <p className="text-kamsen-gray">{partner.firstName} {partner.lastName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p className="text-kamsen-gray">{partner.email}</p>
                  </div>
                  <div>
                    <span className="font-medium">Téléphone:</span>
                    <p className="text-kamsen-gray">{partner.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium">Type d'entreprise:</span>
                    <p className="text-kamsen-gray">{partner.businessType}</p>
                  </div>
                  <div>
                    <span className="font-medium">Commission:</span>
                    <p className="text-kamsen-gray">{partner.commissionRate}%</p>
                  </div>
                  <div>
                    <span className="font-medium">Inscrit le:</span>
                    <p className="text-kamsen-gray">{format(new Date(partner.createdAt), 'dd MMM yyyy', { locale: fr })}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPartner(partner);
                    setEditModalOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                  onClick={() => deletePartner(partner.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Modal d'édition partenaire */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le Partenaire</DialogTitle>
            <DialogDescription>
              Modifiez les informations du partenaire sélectionné.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPartner && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom de l'entreprise</Label>
                  <p className="text-sm text-kamsen-gray mt-1">{selectedPartner.companyName}</p>
                </div>
                <div>
                  <Label>Statut</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedPartner.status)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-kamsen-gray mt-1">{selectedPartner.email}</p>
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <p className="text-sm text-kamsen-gray mt-1">{selectedPartner.phone}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  className="bg-kamsen-blue hover:bg-kamsen-blue/90"
                  onClick={() => {
                    toast({
                      title: 'Fonctionnalité en développement',
                      description: 'La modification des partenaires sera bientôt disponible.',
                    });
                    setEditModalOpen(false);
                  }}
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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