import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Users, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Building,
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Star,
  TrendingUp,
  Calendar,
  Award,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

interface Partner {
  id: number;
  userId: number;
  companyName: string;
  businessType: string;
  businessDescription: string;
  taxId: string;
  businessLicense: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  websiteUrl?: string;
  fleetSize: number;
  experienceYears: number;
  serviceAreas: string[];
  equipmentTypes: string[];
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  totalBookings: number;
  joinedAt: string;
  lastActive: string;
  documents: any[];
  bankDetails: any;
  emergencyContact: any;
}

interface PartnerStats {
  totalPartners: number;
  verifiedPartners: number;
  pendingVerification: number;
  totalRevenue: number;
  averageRating: number;
}

function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-FR')} FCFA`;
}

const verificationStatusConfig = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  verified: { label: "Vérifié", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejeté", color: "bg-red-100 text-red-800", icon: XCircle }
};

function AdminPartnersContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const { toast } = useToast();

  // Load partners and stats on mount
  useEffect(() => {
    loadPartners();
    loadStats();
  }, []);

  const loadPartners = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/partners");
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des partenaires:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/partners/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  const verifyPartnerMutation = useMutation({
    mutationFn: async ({ partnerId, status }: { partnerId: number; status: string }) => {
      const response = await fetch(`/api/admin/partners/${partnerId}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: status })
      });
      if (!response.ok) throw new Error("Erreur lors de la vérification");
      return response.json();
    },
    onSuccess: () => {
      loadPartners();
      loadStats();
      toast({
        title: "Partenaire mis à jour",
        description: "Le statut de vérification a été modifié avec succès.",
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

  const deletePartnerMutation = useMutation({
    mutationFn: async (partnerId: number) => {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
    },
    onSuccess: () => {
      loadPartners();
      loadStats();
      toast({
        title: "Partenaire supprimé",
        description: "Le partenaire a été supprimé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur", 
        description: "Impossible de supprimer le partenaire.",
        variant: "destructive",
      });
    },
  });

  // Filter partners
  const filteredPartners = partners.filter((partner: Partner) => {
    const matchesSearch = 
      partner.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.businessType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || partner.verificationStatus === statusFilter;
    const matchesCity = cityFilter === "all" || partner.city === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
  });

  // Get unique cities for filter
  const uniqueCities = [...new Set(partners.map(p => p.city))].sort();

  // Export partners data to CSV
  const exportPartnersData = () => {
    const csvData = filteredPartners.map(partner => ({
      'Nom entreprise': partner.companyName,
      'Email': partner.email,
      'Téléphone': partner.phone,
      'Ville': partner.city,
      'Type activité': partner.businessType,
      'Statut': verificationStatusConfig[partner.verificationStatus].label,
      'Note': partner.rating,
      'Flotte': partner.fleetSize,
      'Expérience (ans)': partner.experienceYears,
      'Inscrit le': new Date(partner.joinedAt).toLocaleDateString('fr-FR')
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
    link.setAttribute('download', `partenaires-aywa-${new Date().toLocaleDateString('fr-FR')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: `${filteredPartners.length} partenaires exportés en CSV`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Users className="h-8 w-8" />
            Réseau de Partenaires
          </h1>
          <p className="text-gray-600">
            Gérez et supervisez tous les partenaires de la plateforme Aywa
          </p>
        </div>

        {/* Statistiques générales */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Partenaires</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPartners}</p>
                  </div>
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vérifiés</p>
                    <p className="text-2xl font-bold text-green-600">{stats.verifiedPartners}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">En attente</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingVerification}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.averageRating.toFixed(1)}/5</p>
                  </div>
                  <Star className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenus générés</p>
                    <p className="text-2xl font-bold text-primary-orange">
                      {formatPrice(stats.totalRevenue)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
                  placeholder="Rechercher par nom, email, ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut de vérification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="verified">Vérifiés</SelectItem>
                  <SelectItem value="rejected">Rejetés</SelectItem>
                </SelectContent>
              </Select>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {uniqueCities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2" onClick={() => exportPartnersData()}>
                  <Download className="h-4 w-4" />
                  Exporter CSV
                </Button>
                <Button variant="outline" className="flex items-center gap-2" onClick={() => window.open('/admin/partners/analytics', '_blank')}>
                  <TrendingUp className="h-4 w-4" />
                  Analyses
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des partenaires */}
        <div className="space-y-4">
          {filteredPartners.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun partenaire trouvé
                </h3>
                <p className="text-gray-600">
                  Aucun partenaire ne correspond aux critères de recherche.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPartners.map((partner: Partner) => {
              const StatusIcon = verificationStatusConfig[partner.verificationStatus].icon;
              
              return (
                <Card key={partner.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                      {/* Informations entreprise */}
                      <div className="lg:col-span-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="font-bold text-lg">{partner.companyName}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <Briefcase className="h-4 w-4 inline mr-2" />
                          {partner.businessType}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{partner.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{partner.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{partner.city}</span>
                        </div>
                      </div>

                      {/* Statistiques partenaire */}
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-gray-500">Flotte:</span>
                          <span className="font-medium ml-2">{partner.fleetSize} véhicules</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Expérience:</span>
                          <span className="font-medium ml-2">{partner.experienceYears} ans</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Note:</span>
                          <div className="flex items-center gap-1 ml-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{partner.rating}/5</span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Réservations:</span>
                          <span className="font-medium ml-2">{partner.totalBookings}</span>
                        </div>
                      </div>

                      {/* Zones et équipements */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Zones de service:</p>
                          <div className="flex flex-wrap gap-1">
                            {partner.serviceAreas?.slice(0, 3).map((area, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {area}
                              </Badge>
                            )) || <span className="text-xs text-gray-500">Non spécifié</span>}
                            {partner.serviceAreas && partner.serviceAreas.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{partner.serviceAreas.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Équipements:</p>
                          <div className="flex flex-wrap gap-1">
                            {partner.equipmentTypes?.slice(0, 2).map((type, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            )) || <span className="text-xs text-gray-500">Non spécifié</span>}
                            {partner.equipmentTypes && partner.equipmentTypes.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{partner.equipmentTypes.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions et statut */}
                      <div className="flex flex-col gap-3">
                        <Badge className={verificationStatusConfig[partner.verificationStatus].color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {verificationStatusConfig[partner.verificationStatus].label}
                        </Badge>

                        <div className="flex flex-col gap-2">
                          {partner.verificationStatus === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => verifyPartnerMutation.mutate({ 
                                  partnerId: partner.id, 
                                  status: 'verified' 
                                })}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approuver
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => verifyPartnerMutation.mutate({ 
                                  partnerId: partner.id, 
                                  status: 'rejected' 
                                })}
                                className="text-red-600 border-red-200"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejeter
                              </Button>
                            </>
                          )}

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPartner(partner)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Détails
                              </Button>
                            </DialogTrigger>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePartnerMutation.mutate(partner.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 border-t pt-2">
                      <span>Inscrit le {format(new Date(partner.joinedAt), "dd/MM/yyyy", { locale: fr })}</span>
                      <span className="mx-2">•</span>
                      <span>Dernière activité: {format(new Date(partner.lastActive), "dd/MM/yyyy", { locale: fr })}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Modal détails partenaire */}
        {selectedPartner && (
          <Dialog open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Détails du partenaire: {selectedPartner.companyName}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-6">
                {/* Informations générales */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Informations entreprise</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nom:</strong> {selectedPartner.companyName}</p>
                      <p><strong>Type d'activité:</strong> {selectedPartner.businessType}</p>
                      <p><strong>Description:</strong> {selectedPartner.businessDescription}</p>
                      <p><strong>Numéro fiscal:</strong> {selectedPartner.taxId}</p>
                      <p><strong>Licence:</strong> {selectedPartner.businessLicense}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Contact</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> {selectedPartner.email}</p>
                      <p><strong>Téléphone:</strong> {selectedPartner.phone}</p>
                      <p><strong>Adresse:</strong> {selectedPartner.address}</p>
                      <p><strong>Ville:</strong> {selectedPartner.city}</p>
                      {selectedPartner.websiteUrl && (
                        <p><strong>Site web:</strong> 
                          <a href={selectedPartner.websiteUrl} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 ml-1">{selectedPartner.websiteUrl}</a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Zones de service et équipements */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Zones de service</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPartner.serviceAreas.map((area, index) => (
                        <Badge key={index} variant="secondary">{area}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Types d'équipements</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPartner.equipmentTypes.map((type, index) => (
                        <Badge key={index} variant="outline">{type}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="font-medium mb-2">Documents soumis</h4>
                  <div className="text-sm text-gray-600">
                    {selectedPartner.documents.length > 0 ? (
                      <p>{selectedPartner.documents.length} document(s) téléchargé(s)</p>
                    ) : (
                      <p>Aucun document téléchargé</p>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default function AdminPartners() {
  return (
    <ProtectedAdminRoute>
      <AdminPartnersContent />
    </ProtectedAdminRoute>
  );
}