import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Trash2,
  Filter,
  Search,
  History,
  Eye,
  ChevronDown,
  ChevronUp,
  Clock,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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

interface BookingHistoryEntry {
  id: number;
  bookingId: number;
  field: string;
  oldValue: string;
  newValue: string;
  modifiedBy: string;
  reason?: string;
  createdAt: string;
}

function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-FR')} FCFA`;
}

const statusConfig = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  confirmed: { label: "Confirmée", color: "bg-green-100 text-green-800", icon: CheckCircle },
  completed: { label: "Terminée", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  cancelled: { label: "Annulée", color: "bg-red-100 text-red-800", icon: XCircle }
};

export default function AdminReservations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedBookings, setExpandedBookings] = useState<Set<number>>(new Set());
  const [bookingHistories, setBookingHistories] = useState<Record<number, BookingHistoryEntry[]>>({});
  const { toast } = useToast();

  // Load bookings on mount
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBookingHistory = async (bookingId: number) => {
    try {
      const response = await fetch(`/api/admin/booking-history/${bookingId}`);
      if (response.ok) {
        const history = await response.json();
        setBookingHistories(prev => ({
          ...prev,
          [bookingId]: history
        }));
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
    }
  };

  const toggleBookingExpansion = async (bookingId: number) => {
    const newExpanded = new Set(expandedBookings);
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId);
    } else {
      newExpanded.add(bookingId);
      // Load history if not already loaded
      if (!bookingHistories[bookingId]) {
        await loadBookingHistory(bookingId);
      }
    }
    setExpandedBookings(newExpanded);
  };

  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: number; status: string }) => {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      return response.json();
    },
    onSuccess: () => {
      loadBookings();
      toast({
        title: "Réservation mise à jour",
        description: "Le statut a été modifié avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
    },
    onSuccess: () => {
      loadBookings();
      toast({
        title: "Réservation supprimée",
        description: "La réservation a été supprimée avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur", 
        description: "Impossible de supprimer la réservation.",
        variant: "destructive",
      });
    },
  });

  const updateBookingStatus = async (bookingId: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        // Reload bookings after update
        loadBookings();
        alert("Statut mis à jour avec succès");
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const deleteBooking = async (bookingId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        // Reload bookings after deletion
        loadBookings();
        alert("Réservation supprimée avec succès");
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking: Booking) => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerPhone.includes(searchTerm) ||
      (booking.equipmentName && booking.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    let matchesDate = true;
    if (dateFilter === "today") {
      const today = new Date().toISOString().split('T')[0];
      matchesDate = booking.startDate === today;
    } else if (dateFilter === "upcoming") {
      matchesDate = new Date(booking.startDate) > new Date();
    } else if (dateFilter === "past") {
      matchesDate = new Date(booking.endDate) < new Date();
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "ID",
      "Client",
      "Email",
      "Téléphone", 
      "Équipement",
      "Date début",
      "Date fin",
      "Prix total",
      "Statut",
      "Paiement",
      "Créée le"
    ];

    const csvData = filteredBookings.map((booking: Booking) => [
      booking.id,
      booking.customerName,
      booking.customerEmail,
      booking.customerPhone,
      booking.equipmentName || `Équipement #${booking.equipmentId}`,
      booking.startDate,
      booking.endDate,
      booking.totalPrice,
      statusConfig[booking.status].label,
      booking.paymentStatus || "Non spécifié",
      format(new Date(booking.createdAt), "dd/MM/yyyy HH:mm")
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map((cell: any) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reservations_aywa_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Administration des Réservations
        </h1>
        <p className="text-gray-600">
          Gérez toutes les réservations de la plateforme Kamsen
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter((b: Booking) => b.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmées</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter((b: Booking) => b.status === 'confirmed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(bookings
                    .filter((b: Booking) => b.status === 'confirmed' || b.status === 'completed')
                    .reduce((sum: number, b: Booking) => sum + b.totalPrice, 0)
                  )}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmées</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="upcoming">À venir</SelectItem>
                <SelectItem value="past">Passées</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={exportToCSV}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des réservations */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune réservation trouvée
              </h3>
              <p className="text-gray-600">
                Aucune réservation ne correspond aux critères de recherche.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking: Booking) => {
            const StatusIcon = statusConfig[booking.status].icon;
            
            return (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Informations client */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{booking.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{booking.customerEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{booking.customerPhone}</span>
                      </div>
                    </div>

                    {/* Informations équipement et dates */}
                    <div className="space-y-2">
                      <div className="font-medium">
                        {booking.equipmentName || `Équipement #${booking.equipmentId}`}
                      </div>
                      {booking.equipmentCategory && (
                        <div className="text-sm text-gray-600">
                          {booking.equipmentCategory}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(booking.startDate), "dd MMM", { locale: fr })} - {" "}
                          {format(new Date(booking.endDate), "dd MMM yyyy", { locale: fr })}
                        </span>
                      </div>
                    </div>

                    {/* Prix et statut */}
                    <div className="space-y-2">
                      <div className="text-lg font-bold text-primary-orange">
                        {formatPrice(booking.totalPrice)}
                      </div>
                      <Badge className={statusConfig[booking.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[booking.status].label}
                      </Badge>
                      {booking.paymentStatus && (
                        <div className="text-sm text-gray-600">
                          Paiement: {booking.paymentStatus}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Select
                        value={booking.status}
                        onValueChange={(newStatus) => 
                          updateBookingMutation.mutate({ 
                            bookingId: booking.id, 
                            status: newStatus 
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="confirmed">Confirmée</SelectItem>
                          <SelectItem value="completed">Terminée</SelectItem>
                          <SelectItem value="cancelled">Annulée</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBookingExpansion(booking.id)}
                        className="flex items-center gap-2"
                      >
                        <History className="h-4 w-4" />
                        {expandedBookings.has(booking.id) ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                        Historique
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteBookingMutation.mutate(booking.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    </div>
                  )}

                  {/* Historique des modifications */}
                  {expandedBookings.has(booking.id) && (
                    <div className="mt-4 border-t pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <History className="h-4 w-4 text-gray-500" />
                        <h4 className="font-medium text-gray-900">Historique des modifications</h4>
                      </div>
                      
                      {bookingHistories[booking.id]?.length > 0 ? (
                        <div className="space-y-2">
                          {bookingHistories[booking.id].map((entry: BookingHistoryEntry) => (
                            <div key={entry.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-900">
                                  {entry.field === 'startDate' ? 'Date de début' :
                                   entry.field === 'endDate' ? 'Date de fin' :
                                   entry.field === 'totalPrice' ? 'Prix total' :
                                   entry.field === 'status' ? 'Statut' :
                                   entry.field}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {entry.modifiedBy === 'client' ? 'Client' : 'Admin'}
                                </Badge>
                              </div>
                              
                              <div className="text-gray-600 mb-1">
                                <span className="line-through text-red-600">{entry.oldValue}</span>
                                {' → '}
                                <span className="text-green-600">{entry.newValue}</span>
                              </div>
                              
                              {entry.reason && (
                                <p className="text-gray-500 italic text-xs mb-1">
                                  Raison: {entry.reason}
                                </p>
                              )}
                              
                              <p className="text-xs text-gray-400">
                                {new Date(entry.createdAt).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                          <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Aucune modification enregistrée pour cette réservation</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 text-xs text-gray-500">
                    Créée le {format(new Date(booking.createdAt), "dd/MM/yyyy à HH:mm", { locale: fr })}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}