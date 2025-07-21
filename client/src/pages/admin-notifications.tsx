import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import { Bell, Check, Eye, AlertTriangle, Info, Clock, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdminNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  bookingId?: number;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'reservation_modified': return <AlertTriangle className="h-4 w-4" />;
    case 'new_booking': return <Info className="h-4 w-4" />;
    case 'cancellation': return <Clock className="h-4 w-4" />;
    default: return <Bell className="h-4 w-4" />;
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function AdminNotificationsContent() {
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["/api/admin/notifications"],
  });

  const { data: bookingHistory = [] } = useQuery({
    queryKey: ["/api/admin/booking-history", selectedBookingId],
    enabled: !!selectedBookingId
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/notifications/${id}/read`, {
        method: "PUT",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/admin/notifications/mark-all-read", {
        method: "PUT",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
      toast({
        title: "Notifications marquées",
        description: "Toutes les notifications ont été marquées comme lues.",
      });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
      toast({
        title: "Notification supprimée",
        description: "La notification a été supprimée avec succès.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n: AdminNotification) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-8 w-8" />
              Notifications & Alertes
            </h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : "Toutes les notifications sont lues"}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={() => markAllAsReadMutation.mutate()}>
              <Check className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune notification pour le moment</p>
                  </div>
                ) : (
                  notifications.map((notification: AdminNotification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg ${
                        !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900">
                                {notification.title}
                              </h3>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              {!notification.isRead && (
                                <Badge variant="secondary">Nouveau</Badge>
                              )}
                            </div>
                            
                            <p className="text-gray-600 mb-2">{notification.message}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{formatDate(notification.createdAt)}</span>
                              {notification.bookingId && (
                                <span>Réservation #{notification.bookingId}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {notification.bookingId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBookingId(notification.bookingId!)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {!notification.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsReadMutation.mutate(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNotificationMutation.mutate(notification.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {selectedBookingId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Historique des modifications - Réservation #{selectedBookingId}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookingHistory.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Aucune modification enregistrée pour cette réservation
                    </p>
                  ) : (
                    bookingHistory.map((entry: BookingHistoryEntry) => (
                      <div key={entry.id} className="border-l-4 border-blue-200 pl-4 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">
                            {entry.field === 'startDate' ? 'Date de début' :
                             entry.field === 'endDate' ? 'Date de fin' :
                             entry.field === 'totalPrice' ? 'Prix total' :
                             entry.field === 'status' ? 'Statut' :
                             entry.field}
                          </span>
                          <Badge variant="outline">
                            {entry.modifiedBy === 'client' ? 'Client' : 'Admin'}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-1">
                          <span className="line-through text-red-600">{entry.oldValue}</span>
                          {' → '}
                          <span className="text-green-600">{entry.newValue}</span>
                        </div>
                        
                        {entry.reason && (
                          <p className="text-sm text-gray-500 italic">
                            Raison: {entry.reason}
                          </p>
                        )}
                        
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedBookingId(null)}
                  >
                    Fermer l'historique
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminNotifications() {
  return (
    <ProtectedAdminRoute>
      <AdminNotificationsContent />
    </ProtectedAdminRoute>
  );
}