import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { LogOut, Calendar, CreditCard, Star, Phone, Mail, User, Truck, AlertCircle, MapPin } from "lucide-react";
import TrackingCard from "@/components/TrackingCard";

interface UserProfile {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    city?: string;
    role: string;
    profilePicture?: string;
  };
  commercialManager?: {
    id: number;
    name: string;
    phone: string;
    email: string;
    specialization: string;
  };
}

interface Booking {
  id: number;
  equipmentId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  canModify: boolean;
  canCancel: boolean;
  equipment?: {
    id: number;
    name: string;
    category: string;
    imageUrl: string;
    pricePerDay: number;
  };
}

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

interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({
        title: "Accès non autorisé",
        description: "Veuillez vous connecter pour accéder au dashboard",
        variant: "destructive"
      });
      setLocation("/login");
      return;
    }
    setAuthToken(token);
  }, []);

  // User profile query
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      return await apiRequest("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    enabled: !!authToken
  });

  // User bookings query
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/dashboard/bookings"],
    queryFn: async () => {
      return await apiRequest("/api/dashboard/bookings", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    enabled: !!authToken
  });

  // User payments query
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["/api/dashboard/payments"],
    queryFn: async () => {
      return await apiRequest("/api/dashboard/payments", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    enabled: !!authToken
  });

  // User recommendations query
  const { data: recommendations = [] } = useQuery({
    queryKey: ["/api/dashboard/recommendations"],
    queryFn: async () => {
      return await apiRequest("/api/dashboard/recommendations", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    enabled: !!authToken
  });

  // User GPS tracking query
  const { data: userTracking = [] } = useQuery<GpsTracking[]>({
    queryKey: ["/api/tracking/user", profile?.user?.id],
    queryFn: async () => {
      if (!profile?.user?.id) return [];
      return await fetch(`/api/tracking/user/${profile.user.id}`)
        .then(res => res.json())
        .catch(() => []);
    },
    enabled: !!profile?.user?.id
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    onSuccess: () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!"
      });
      setLocation("/");
    },
    onError: () => {
      // Force logout even if API fails
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setLocation("/");
    }
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      return await apiRequest(`/api/dashboard/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/bookings"] });
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'annuler la réservation",
        variant: "destructive"
      });
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCancelBooking = (bookingId: number) => {
    if (confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      cancelBookingMutation.mutate(bookingId);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "En attente" },
      confirmed: { color: "bg-green-100 text-green-800", text: "Confirmée" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Annulée" },
      completed: { color: "bg-blue-100 text-blue-800", text: "Terminée" }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!authToken) {
    return null;
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-2xl font-bold text-orange-600">AYWA</h1>
              </Link>
              <nav className="ml-8 flex space-x-4">
                <Link href="/equipment" className="text-gray-600 hover:text-gray-900">
                  Équipements
                </Link>
                <Link href="/services" className="text-gray-600 hover:text-gray-900">
                  Services
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.user.profilePicture} />
                  <AvatarFallback>
                    {profile?.user.firstName?.[0]}{profile?.user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {profile?.user.firstName} {profile?.user.lastName}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Gérez vos réservations, consultez votre historique et découvrez nos recommandations
          </p>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Réservations
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Suivi GPS
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Paiements
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Recommandations
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
          </TabsList>

          {/* GPS Tracking Tab */}
          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Suivi GPS de mes équipements
                </CardTitle>
                <CardDescription>
                  Suivez la position en temps réel de vos équipements en cours de livraison
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userTracking.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Aucun suivi GPS actif</p>
                    <p className="text-sm text-gray-500">
                      Vos équipements en cours de livraison apparaîtront ici
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userTracking.map((tracking) => (
                      <TrackingCard
                        key={tracking.id}
                        tracking={tracking}
                        showEquipmentInfo={true}
                        showBookingInfo={true}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Mes réservations</CardTitle>
                <CardDescription>
                  Consultez et gérez toutes vos réservations d'équipements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Chargement des réservations...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Aucune réservation pour le moment</p>
                    <Link href="/equipment">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        Découvrir nos équipements
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Équipement</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Prix</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking: Booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={booking.equipment?.imageUrl}
                                  alt={booking.equipment?.name}
                                  className="h-12 w-12 object-cover rounded"
                                />
                                <div>
                                  <div className="font-medium">{booking.equipment?.name}</div>
                                  <div className="text-sm text-gray-500">{booking.equipment?.category}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>Du {formatDate(booking.startDate)}</div>
                                <div>Au {formatDate(booking.endDate)}</div>
                              </div>
                            </TableCell>
                            <TableCell>{formatPrice(booking.totalPrice)}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {booking.canCancel && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelBooking(booking.id)}
                                    disabled={cancelBookingMutation.isPending}
                                  >
                                    Annuler
                                  </Button>
                                )}
                                <Link href={`/equipment/${booking.equipmentId}`}>
                                  <Button variant="outline" size="sm">
                                    Voir l'équipement
                                  </Button>
                                </Link>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Historique des paiements</CardTitle>
                <CardDescription>
                  Consultez tous vos paiements et transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Chargement des paiements...</p>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Aucun paiement pour le moment</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Méthode</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment: Payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.createdAt)}</TableCell>
                            <TableCell>{formatPrice(payment.amount)}</TableCell>
                            <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations personnalisées</CardTitle>
                <CardDescription>
                  Découvrez des équipements adaptés à vos besoins
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune recommandation disponible</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.slice(0, 6).map((equipment: any) => (
                      <Card key={equipment.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <img
                            src={equipment.imageUrl}
                            alt={equipment.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          <h3 className="font-semibold text-lg mb-2">{equipment.name}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{equipment.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-orange-600">
                              {formatPrice(equipment.pricePerDay)}/jour
                            </span>
                            <Link href={`/equipment/${equipment.id}`}>
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                Voir détails
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Vos informations de compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile?.user.profilePicture} />
                      <AvatarFallback className="text-lg">
                        {profile?.user.firstName?.[0]}{profile?.user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {profile?.user.firstName} {profile?.user.lastName}
                      </h3>
                      <p className="text-gray-600">{profile?.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Téléphone</label>
                      <p className="text-gray-900">{profile?.user.phone || "Non renseigné"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Ville</label>
                      <p className="text-gray-900">{profile?.user.city || "Non renseignée"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Adresse</label>
                      <p className="text-gray-900">{profile?.user.address || "Non renseignée"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {profile?.commercialManager && (
                <Card>
                  <CardHeader>
                    <CardTitle>Votre commercial dédié</CardTitle>
                    <CardDescription>
                      Contactez votre commercial pour toute assistance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold">{profile.commercialManager.name}</h3>
                      <p className="text-gray-600 capitalize">
                        Spécialiste {profile.commercialManager.specialization}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <a 
                          href={`tel:${profile.commercialManager.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {profile.commercialManager.phone}
                        </a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <a 
                          href={`mailto:${profile.commercialManager.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {profile.commercialManager.email}
                        </a>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Assistance personnalisée
                          </p>
                          <p className="text-sm text-blue-700">
                            Votre commercial peut vous aider avec vos réservations, 
                            recommandations personnalisées et questions techniques.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}