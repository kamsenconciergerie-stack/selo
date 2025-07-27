import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Phone, 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Award, 
  MapPin, 
  Clock,
  UserCheck,
  UserX,
  Truck,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PartnerDriver {
  id: number;
  partnerId: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  licenseNumber?: string;
  licenseCategory?: string;
  experienceYears?: number;
  specializations?: string[];
  isActive: boolean;
  notes?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

interface DriverAssignment {
  id: number;
  bookingId: number;
  partnerId: number;
  driverId: number;
  equipmentId: number;
  assignedAt: string;
  status: string;
  startTime?: string;
  endTime?: string;
  deliveryInstructions?: string;
  pickupInstructions?: string;
  notes?: string;
  driver?: PartnerDriver;
  equipment?: {
    id: number;
    name: string;
    category: string;
  };
  booking?: {
    id: number;
    customerName: string;
    startDate: string;
    endDate: string;
  };
}

interface DriverManagementProps {
  partnerId: number;
}

export default function DriverManagement({ partnerId }: DriverManagementProps) {
  const [drivers, setDrivers] = useState<PartnerDriver[]>([]);
  const [assignments, setAssignments] = useState<DriverAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showAssignDriver, setShowAssignDriver] = useState(false);
  const [editingDriver, setEditingDriver] = useState<PartnerDriver | null>(null);
  const { toast } = useToast();

  // New driver form state
  const [newDriver, setNewDriver] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    licenseNumber: '',
    licenseCategory: 'B',
    experienceYears: 0,
    specializations: [] as string[],
    notes: ''
  });

  useEffect(() => {
    loadDriversAndAssignments();
  }, [partnerId]);

  const loadDriversAndAssignments = async () => {
    setIsLoading(true);
    try {
      // Load partner drivers
      const driversResponse = await fetch(`/api/partners/${partnerId}/drivers`);
      if (driversResponse.ok) {
        const driversData = await driversResponse.json();
        setDrivers(driversData);
      }

      // Load driver assignments
      const assignmentsResponse = await fetch(`/api/partners/${partnerId}/driver-assignments`);
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        setAssignments(assignmentsData);
      }
    } catch (error) {
      console.error('Error loading drivers data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des chauffeurs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDriver = async () => {
    try {
      const response = await fetch(`/api/partners/${partnerId}/drivers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newDriver,
          partnerId,
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Chauffeur ajouté avec succès",
        });
        setShowAddDriver(false);
        setNewDriver({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          licenseNumber: '',
          licenseCategory: 'B',
          experienceYears: 0,
          specializations: [],
          notes: ''
        });
        loadDriversAndAssignments();
      } else {
        throw new Error('Échec de l\'ajout du chauffeur');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le chauffeur",
        variant: "destructive",
      });
    }
  };

  const toggleDriverStatus = async (driverId: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/partners/${partnerId}/drivers/${driverId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: `Chauffeur ${!isActive ? 'activé' : 'désactivé'} avec succès`,
        });
        loadDriversAndAssignments();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du chauffeur",
        variant: "destructive",
      });
    }
  };

  const getActiveAssignments = () => 
    assignments.filter(a => ['assigned', 'in_progress'].includes(a.status));

  const getCompletedAssignments = () =>
    assignments.filter(a => a.status === 'completed');

  const licenseCategories = [
    { value: 'B', label: 'Permis B - Véhicules légers' },
    { value: 'C', label: 'Permis C - Camions' },
    { value: 'D', label: 'Permis D - Transport en commun' },
    { value: 'E', label: 'Permis E - Remorques lourdes' },
  ];

  const equipmentSpecializations = [
    'Camions bennes',
    'Pelleteuses',
    'Bulldozers',
    'Grues',
    'Matériel agricole',
    'Engins de chantier',
    'Véhicules utilitaires'
  ];

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
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-kamsen-blue">Gestion des Chauffeurs</h3>
          <p className="text-sm text-kamsen-gray">
            {drivers.length} chauffeur{drivers.length > 1 ? 's' : ''} enregistré{drivers.length > 1 ? 's' : ''}
          </p>
        </div>
        <Dialog open={showAddDriver} onOpenChange={setShowAddDriver}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un chauffeur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau chauffeur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={newDriver.firstName}
                    onChange={(e) => setNewDriver({...newDriver, firstName: e.target.value})}
                    placeholder="Prénom du chauffeur"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={newDriver.lastName}
                    onChange={(e) => setNewDriver({...newDriver, lastName: e.target.value})}
                    placeholder="Nom de famille"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                    placeholder="+221 XX XXX XX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newDriver.email}
                    onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
                    placeholder="email@exemple.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="licenseNumber">Numéro de permis</Label>
                  <Input
                    id="licenseNumber"
                    value={newDriver.licenseNumber}
                    onChange={(e) => setNewDriver({...newDriver, licenseNumber: e.target.value})}
                    placeholder="SN-XXXX-XXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="licenseCategory">Catégorie de permis</Label>
                  <Select 
                    value={newDriver.licenseCategory} 
                    onValueChange={(value) => setNewDriver({...newDriver, licenseCategory: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {licenseCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Années d'expérience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    value={newDriver.experienceYears}
                    onChange={(e) => setNewDriver({...newDriver, experienceYears: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div>
                <Label>Spécialisations</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {equipmentSpecializations.map((spec) => (
                    <label key={spec} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newDriver.specializations.includes(spec)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewDriver({
                              ...newDriver,
                              specializations: [...newDriver.specializations, spec]
                            });
                          } else {
                            setNewDriver({
                              ...newDriver,
                              specializations: newDriver.specializations.filter(s => s !== spec)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newDriver.notes}
                  onChange={(e) => setNewDriver({...newDriver, notes: e.target.value})}
                  placeholder="Notes complémentaires sur le chauffeur..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDriver(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleAddDriver}
                disabled={!newDriver.firstName || !newDriver.lastName || !newDriver.phone}
              >
                Ajouter le chauffeur
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="drivers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="drivers">Chauffeurs ({drivers.length})</TabsTrigger>
          <TabsTrigger value="active-assignments">Affectations actives ({getActiveAssignments().length})</TabsTrigger>
          <TabsTrigger value="completed">Missions terminées ({getCompletedAssignments().length})</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="space-y-4">
          {drivers.length === 0 ? (
            <div className="text-center py-8 text-kamsen-gray">
              <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Aucun chauffeur enregistré</p>
              <p className="text-sm mb-4">
                Ajoutez vos chauffeurs pour pouvoir les assigner aux réservations
              </p>
              <Button onClick={() => setShowAddDriver(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter le premier chauffeur
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {drivers.map((driver) => (
                <Card key={driver.id} className={`${!driver.isActive ? 'opacity-60' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-kamsen-blue-light rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-kamsen-blue" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">
                              {driver.firstName} {driver.lastName}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-kamsen-gray">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <a href={`tel:${driver.phone}`} className="hover:underline">
                                  {driver.phone}
                                </a>
                              </div>
                              {driver.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  <a href={`mailto:${driver.email}`} className="hover:underline">
                                    {driver.email}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {driver.licenseCategory && (
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="h-4 w-4 text-kamsen-gray" />
                              <span>Permis {driver.licenseCategory}</span>
                              {driver.licenseNumber && (
                                <span className="text-kamsen-gray">({driver.licenseNumber})</span>
                              )}
                            </div>
                          )}
                          
                          {driver.experienceYears && driver.experienceYears > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-kamsen-gray" />
                              <span>{driver.experienceYears} années d'expérience</span>
                            </div>
                          )}

                          {driver.specializations && driver.specializations.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {driver.specializations.map((spec) => (
                                <Badge key={spec} variant="secondary" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {driver.notes && (
                            <p className="text-sm text-kamsen-gray mt-2 italic">
                              {driver.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={driver.isActive ? "default" : "secondary"}
                          className={driver.isActive ? "bg-kamsen-blue-light text-green-800" : "bg-kamsen-blue-light text-kamsen-gray"}
                        >
                          {driver.isActive ? (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Actif
                            </>
                          ) : (
                            <>
                              <UserX className="h-3 w-3 mr-1" />
                              Inactif
                            </>
                          )}
                        </Badge>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleDriverStatus(driver.id, driver.isActive)}
                        >
                          {driver.isActive ? 'Désactiver' : 'Activer'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingDriver(driver)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active-assignments" className="space-y-4">
          {getActiveAssignments().length === 0 ? (
            <div className="text-center py-8 text-kamsen-gray">
              <Truck className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Aucune affectation active</p>
              <p className="text-sm">
                Les affectations de chauffeurs aux réservations apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {getActiveAssignments().map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-kamsen-blue-light text-blue-800">
                            {assignment.status === 'assigned' ? 'Assigné' : 'En cours'}
                          </Badge>
                          <span className="text-sm text-kamsen-gray">
                            Réservation #{assignment.bookingId}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-kamsen-gray" />
                            <span className="font-medium">
                              {assignment.driver?.firstName} {assignment.driver?.lastName}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-kamsen-gray" />
                            <span>{assignment.equipment?.name}</span>
                          </div>

                          {assignment.deliveryInstructions && (
                            <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                              <strong>Instructions de livraison:</strong> {assignment.deliveryInstructions}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-kamsen-gray">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Assigné le {format(new Date(assignment.assignedAt), "dd/MM/yyyy", { locale: fr })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {getCompletedAssignments().length === 0 ? (
            <div className="text-center py-8 text-kamsen-gray">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Aucune mission terminée</p>
              <p className="text-sm">
                L'historique des missions terminées apparaîtra ici
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {getCompletedAssignments().map((assignment) => (
                <Card key={assignment.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-kamsen-blue-light text-green-800">
                            Terminé
                          </Badge>
                          <span className="text-sm text-kamsen-gray">
                            Réservation #{assignment.bookingId}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          <div>
                            <strong>Chauffeur:</strong> {assignment.driver?.firstName} {assignment.driver?.lastName}
                          </div>
                          <div>
                            <strong>Équipement:</strong> {assignment.equipment?.name}
                          </div>
                          {assignment.startTime && assignment.endTime && (
                            <div>
                              <strong>Durée:</strong> {format(new Date(assignment.startTime), "dd/MM à HH:mm", { locale: fr })} - {format(new Date(assignment.endTime), "dd/MM à HH:mm", { locale: fr })}
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
    </div>
  );
}