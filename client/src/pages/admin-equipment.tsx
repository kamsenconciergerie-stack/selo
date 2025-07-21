import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import { Truck, Edit, Trash2, Plus, Upload, Image as ImageIcon, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Equipment {
  id: number;
  name: string;
  description: string;
  category: string;
  pricePerDay: number;
  location: string;
  imageUrl: string;
  specifications: string[];
  isAvailable: boolean;
  weight?: string;
  fuelType?: string;
  power?: string;
}

const categories = [
  "Camions et Transport",
  "Équipement Agricole", 
  "BTP et Construction",
  "Manutention",
  "Équipement Spécialisé"
];

const locations = [
  "Dakar",
  "Thiès", 
  "Saint-Louis",
  "Kaolack",
  "Ziguinchor",
  "Diourbel",
  "Tambacounda",
  "Fatick"
];

function AdminEquipmentContent() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    pricePerDay: "",
    location: "",
    specifications: "",
    weight: "",
    fuelType: "",
    power: "",
    isAvailable: true
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ["/api/equipment"],
  });

  const addEquipmentMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/admin/equipment", {
        method: "POST",
        body: data,
      });
      if (!response.ok) throw new Error("Erreur lors de l'ajout");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Équipement ajouté",
        description: "L'équipement a été ajouté avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'équipement.",
        variant: "destructive",
      });
    },
  });

  const updateEquipmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await fetch(`/api/admin/equipment/${id}`, {
        method: "PUT",
        body: data,
      });
      if (!response.ok) throw new Error("Erreur lors de la modification");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      setIsDialogOpen(false);
      setIsEditing(false);
      resetForm();
      toast({
        title: "Équipement modifié",
        description: "L'équipement a été modifié avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'équipement.",
        variant: "destructive",
      });
    },
  });

  const deleteEquipmentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/equipment/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      toast({
        title: "Équipement supprimé",
        description: "L'équipement a été supprimé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'équipement.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      pricePerDay: "",
      location: "",
      specifications: "",
      weight: "",
      fuelType: "",
      power: "",
      isAvailable: true
    });
    setImageFile(null);
    setImagePreview("");
    setSelectedEquipment(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setFormData({
      name: equipment.name,
      description: equipment.description,
      category: equipment.category,
      pricePerDay: equipment.pricePerDay.toString(),
      location: equipment.location,
      specifications: equipment.specifications.join(", "),
      weight: equipment.weight || "",
      fuelType: equipment.fuelType || "",
      power: equipment.power || "",
      isAvailable: equipment.isAvailable
    });
    setImagePreview(equipment.imageUrl);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("category", formData.category);
    submitData.append("pricePerDay", formData.pricePerDay);
    submitData.append("location", formData.location);
    submitData.append("specifications", JSON.stringify(formData.specifications.split(", ").filter(s => s.trim())));
    submitData.append("weight", formData.weight);
    submitData.append("fuelType", formData.fuelType);
    submitData.append("power", formData.power);
    submitData.append("isAvailable", formData.isAvailable.toString());
    
    if (imageFile) {
      submitData.append("image", imageFile);
    }

    if (isEditing && selectedEquipment) {
      updateEquipmentMutation.mutate({ id: selectedEquipment.id, data: submitData });
    } else {
      addEquipmentMutation.mutate(submitData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet équipement ?")) {
      deleteEquipmentMutation.mutate(id);
    }
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Équipements</h1>
            <p className="text-gray-600 mt-1">Ajouter, modifier et supprimer les équipements</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsEditing(false); }}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un équipement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Modifier l'équipement" : "Ajouter un équipement"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom de l'équipement</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pricePerDay">Prix par jour (XOF)</Label>
                    <Input
                      id="pricePerDay"
                      type="number"
                      value={formData.pricePerDay}
                      onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Localisation</Label>
                    <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une ville" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(loc => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="specifications">Spécifications (séparées par des virgules)</Label>
                  <Input
                    id="specifications"
                    value={formData.specifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
                    placeholder="Ex: Capacité 15T, Manuel, Diesel"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="weight">Poids</Label>
                    <Input
                      id="weight"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="Ex: 15T"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fuelType">Carburant</Label>
                    <Input
                      id="fuelType"
                      value={formData.fuelType}
                      onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value }))}
                      placeholder="Ex: Diesel"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="power">Puissance</Label>
                    <Input
                      id="power"
                      value={formData.power}
                      onChange={(e) => setFormData(prev => ({ ...prev, power: e.target.value }))}
                      placeholder="Ex: 150CV"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Image de l'équipement</Label>
                  <div className="mt-2">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-orange file:text-white hover:file:bg-orange-600"
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="w-32 h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                      className="mr-2"
                    />
                    <span>Disponible</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                  <Button type="submit" disabled={addEquipmentMutation.isPending || updateEquipmentMutation.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? "Modifier" : "Ajouter"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {equipment.map((item: Equipment) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-gray-600 mb-3">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">{item.category}</Badge>
                          <Badge variant={item.isAvailable ? "default" : "destructive"}>
                            {item.isAvailable ? "Disponible" : "Indisponible"}
                          </Badge>
                          <Badge variant="outline">{item.location}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Prix:</span> {item.pricePerDay.toLocaleString()} XOF/jour
                          </div>
                          {item.weight && (
                            <div>
                              <span className="font-medium">Poids:</span> {item.weight}
                            </div>
                          )}
                          {item.fuelType && (
                            <div>
                              <span className="font-medium">Carburant:</span> {item.fuelType}
                            </div>
                          )}
                          {item.power && (
                            <div>
                              <span className="font-medium">Puissance:</span> {item.power}
                            </div>
                          )}
                        </div>

                        {item.specifications.length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium text-sm text-gray-700">Spécifications:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.specifications.map((spec, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminEquipment() {
  return (
    <ProtectedAdminRoute>
      <AdminEquipmentContent />
    </ProtectedAdminRoute>
  );
}