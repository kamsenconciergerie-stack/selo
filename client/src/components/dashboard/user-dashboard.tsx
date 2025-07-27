import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Package, Star, Clock } from "lucide-react";
import { formatPrice } from "@/lib/constants";

interface UserDashboardProps {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("bookings");

  // Fetch user's bookings
  const { data: bookings = [] } = useQuery({
    queryKey: ['/api/bookings/user', user.id],
  });

  // Fetch user's reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['/api/reviews/user', user.id],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-kamsen-light text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-kamsen-light text-blue-800';
      default: return 'bg-kamsen-light text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-kamsen-light text-green-800';
      case 'pending': return 'bg-kamsen-light text-orange-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-kamsen-light text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-kamsen-dark">
          Bonjour, {user.firstName} !
        </h1>
        <p className="text-kamsen-medium">
          Gérez vos réservations et consultez votre historique
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Réservations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations Actives</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dépensé</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(bookings.reduce((sum, booking) => sum + booking.totalPrice, 0))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avis Donnés</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bookings">Mes Réservations</TabsTrigger>
          <TabsTrigger value="reviews">Mes Avis</TabsTrigger>
          <TabsTrigger value="profile">Mon Profil</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <div className="grid gap-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="mx-auto h-12 w-12 text-kamsen-light mb-4" />
                  <h3 className="text-lg font-medium text-kamsen-dark mb-2">
                    Aucune réservation
                  </h3>
                  <p className="text-kamsen-medium mb-4">
                    Vous n'avez pas encore fait de réservation
                  </p>
                  <Button asChild>
                    <a href="/equipment">Explorer les équipements</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking: any) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Réservation #{booking.id}
                        </CardTitle>
                        <CardDescription>
                          {booking.equipment?.name}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <div>Du {new Date(booking.startDate).toLocaleDateString()}</div>
                          <div>Au {new Date(booking.endDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{booking.equipment?.location}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {formatPrice(booking.totalPrice)}
                        </div>
                        {booking.paymentMethod && (
                          <div className="text-sm text-muted-foreground">
                            via {booking.paymentMethod}
                          </div>
                        )}
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="mt-4 p-3 bg-kamsen-light rounded-md">
                        <p className="text-sm text-kamsen-dark">{booking.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <div className="grid gap-4">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="mx-auto h-12 w-12 text-kamsen-light mb-4" />
                  <h3 className="text-lg font-medium text-kamsen-dark mb-2">
                    Aucun avis donné
                  </h3>
                  <p className="text-kamsen-medium">
                    Vos avis sur les équipements loués apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review: any) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {review.equipment?.name}
                        </CardTitle>
                        <CardDescription>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-kamsen-light'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  {review.comment && (
                    <CardContent>
                      <p className="text-kamsen-dark">{review.comment}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations du Profil</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-kamsen-dark">Prénom</label>
                  <div className="mt-1 p-2 bg-kamsen-light rounded-md">
                    {user.firstName}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-kamsen-dark">Nom</label>
                  <div className="mt-1 p-2 bg-kamsen-light rounded-md">
                    {user.lastName}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-kamsen-dark">Email</label>
                  <div className="mt-1 p-2 bg-kamsen-light rounded-md">
                    {user.email}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-kamsen-dark">Rôle</label>
                  <div className="mt-1 p-2 bg-kamsen-light rounded-md">
                    <Badge>{user.role}</Badge>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button>Modifier le Profil</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}