import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  AlertTriangle,
  Clock,
  Settings,
  Truck
} from "lucide-react";

interface EquipmentUnavailability {
  id: number;
  partnerId: number;
  equipmentId: number;
  equipmentName: string;
  startDate: string;
  endDate: string;
  reason: 'maintenance' | 'rented_externally' | 'personal_use' | 'repair' | 'other';
  description: string;
  isRecurring: boolean;
  recurringPattern?: string;
  createdAt: string;
}

interface Equipment {
  id: number;
  name: string;
  category: string;
}

interface EquipmentUnavailabilityManagerProps {
  partnerId: number;
}

export function EquipmentUnavailabilityManager({ partnerId }: EquipmentUnavailabilityManagerProps) {
  const [unavailabilityPeriods, setUnavailabilityPeriods] = useState<EquipmentUnavailability[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<EquipmentUnavailability | null>(null);
  const [formData, setFormData] = useState({
    equipmentId: '',
    startDate: '',
    endDate: '',
    reason: 'maintenance' as const,
    description: '',
    isRecurring: false,
    recurringPattern: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [partnerId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch unavailability periods
      const unavailabilityResponse = await fetch(`/api/partners/${partnerId}/equipment-unavailability`);
      if (unavailabilityResponse.ok) {
        const unavailabilityData = await unavailabilityResponse.json();
        setUnavailabilityPeriods(unavailabilityData);
      }

      // Fetch equipment list
      const equipmentResponse = await fetch('/api/equipment');
      if (equipmentResponse.ok) {
        const equipmentData = await equipmentResponse.json();
        setEquipment(equipmentData.slice(0, 10)); // Mock partner equipment
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.equipmentId || !formData.startDate || !formData.endDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast({
        title: "Erreur",
        description: "La date de fin doit être postérieure à la date de début",
        variant: "destructive"
      });
      return;
    }

    try {
      const selectedEquipment = equipment.find(eq => eq.id === parseInt(formData.equipmentId));
      const payload = {
        equipmentId: parseInt(formData.equipmentId),
        equipmentName: selectedEquipment?.name || '',
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        description: formData.description,
        isRecurring: formData.isRecurring,
        recurringPattern: formData.recurringPattern
      };

      let response;
      if (editingPeriod) {
        response = await fetch(`/api/partners/${partnerId}/equipment-unavailability/${editingPeriod.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`/api/partners/${partnerId}/equipment-unavailability`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        toast({
          title: "Succès",
          description: editingPeriod ? "Période d'indisponibilité modifiée" : "Période d'indisponibilité ajoutée"
        });
        await fetchData();
        resetForm();
        setIsModalOpen(false);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la période d'indisponibilité",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette période d\'indisponibilité ?')) return;

    try {
      const response = await fetch(`/api/partners/${partnerId}/equipment-unavailability/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Période d'indisponibilité supprimée"
        });
        await fetchData();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la période d'indisponibilité",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (period: EquipmentUnavailability) => {
    setEditingPeriod(period);
    setFormData({
      equipmentId: period.equipmentId.toString(),
      startDate: period.startDate.split('T')[0],
      endDate: period.endDate.split('T')[0],
      reason: period.reason,
      description: period.description,
      isRecurring: period.isRecurring,
      recurringPattern: period.recurringPattern || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingPeriod(null);
    setFormData({
      equipmentId: '',
      startDate: '',
      endDate: '',
      reason: 'maintenance',
      description: '',
      isRecurring: false,
      recurringPattern: ''
    });
  };

  const getReasonLabel = (reason: string) => {
    const labels = {
      maintenance: 'Maintenance',
      rented_externally: 'Loué ailleurs',
      personal_use: 'Usage personnel',
      repair: 'Réparation',
      other: 'Autre'
    };
    return labels[reason as keyof typeof labels] || reason;
  };

  const getReasonColor = (reason: string) => {
    const colors = {
      maintenance: 'bg-kamsen-light text-blue-800',
      rented_externally: 'bg-kamsen-light text-green-800',
      personal_use: 'bg-purple-100 text-purple-800',
      repair: 'bg-red-100 text-red-800',
      other: 'bg-kamsen-light text-gray-800'
    };
    return colors[reason as keyof typeof colors] || 'bg-kamsen-light text-gray-800';
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Indisponibilités</h2>
          <p className="text-kamsen-medium">Définissez les périodes où vos équipements ne sont pas disponibles à la location</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Période
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPeriod ? 'Modifier la Période' : 'Nouvelle Période d\'Indisponibilité'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Équipement *</label>
                <Select value={formData.equipmentId} onValueChange={(value) => setFormData({...formData, equipmentId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un équipement" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment.map((eq) => (
                      <SelectItem key={eq.id} value={eq.id.toString()}>
                        {eq.name} - {eq.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date de début *</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date de fin *</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Raison *</label>
                <Select value={formData.reason} onValueChange={(value: any) => setFormData({...formData, reason: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="rented_externally">Loué ailleurs</SelectItem>
                    <SelectItem value="personal_use">Usage personnel</SelectItem>
                    <SelectItem value="repair">Réparation</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Détails sur l'indisponibilité..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                  className="h-4 w-4"
                />
                <label className="text-sm">Période récurrente</label>
              </div>

              {formData.isRecurring && (
                <div>
                  <label className="block text-sm font-medium mb-2">Fréquence</label>
                  <Select value={formData.recurringPattern} onValueChange={(value) => setFormData({...formData, recurringPattern: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la fréquence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                      <SelectItem value="yearly">Annuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingPeriod ? 'Modifier' : 'Ajouter'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {unavailabilityPeriods.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="h-12 w-12 text-kamsen-light mx-auto mb-4" />
              <h3 className="text-lg font-medium text-kamsen-dark mb-2">Aucune période d'indisponibilité</h3>
              <p className="text-kamsen-medium">Cliquez sur "Nouvelle Période" pour définir quand vos équipements ne sont pas disponibles.</p>
            </CardContent>
          </Card>
        ) : (
          unavailabilityPeriods.map((period) => (
            <Card key={period.id} className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-4 w-4 text-kamsen-medium" />
                      <h3 className="font-semibold">{period.equipmentName}</h3>
                      <Badge className={getReasonColor(period.reason)}>
                        {getReasonLabel(period.reason)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-kamsen-medium mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Du {new Date(period.startDate).toLocaleDateString('fr-FR')} au {new Date(period.endDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {period.isRecurring && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Récurrent ({period.recurringPattern})</span>
                        </div>
                      )}
                    </div>

                    {period.description && (
                      <p className="text-sm text-kamsen-dark">{period.description}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(period)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(period.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}