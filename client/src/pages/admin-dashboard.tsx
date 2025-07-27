import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Equipment } from "@shared/schema";
import { Plus, Edit, Trash2, Upload, Image as ImageIcon, Eye } from "lucide-react";

const equipmentSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  category: z.string().min(1, "Catégorie requise"),
  pricePerDay: z.number().min(0, "Prix requis"),
  description: z.string().min(10, "Description requise"),
  specifications: z.array(z.string()).optional(),
  location: z.string().min(1, "Localisation requise"),
  imageUrl: z.string().default("/placeholder-equipment.jpg"),
  isAvailable: z.boolean().default(true),
  weight: z.string().optional(),
  fuelType: z.string().optional(),
  power: z.string().optional()
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

export default function AdminDashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  const addForm = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: "",
      category: "",
      pricePerDay: 0,
      description: "",
      specifications: [],
      location: "",
      imageUrl: "/placeholder-equipment.jpg",
      isAvailable: true,
      weight: "",
      fuelType: "",
      power: ""
    }
  });

  const editForm = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: "",
      category: "",
      pricePerDay: 0,
      description: "",
      specifications: [],
      location: "",
      imageUrl: "/placeholder-equipment.jpg",
      isAvailable: true,
      weight: "",
      fuelType: "",
      power: ""
    }
  });

  const equipmentCategories = [
    "Camion porteur",
    "Camion semi-remorque", 
    "Camionnette / Fourgon",
    "Camion benne",
    "Engins de Chantier",
    "Outils à Main",
    "Équipement Électrique",
    "Sécurité & EPI"
  ];

  const locations = [
    "Dakar", "Thiès", "Saint-Louis", "Kaolack", "Ziguinchor", 
    "Diourbel", "Tambacounda", "Kolda", "Fatick"
  ];

  const addMutation = useMutation({
    mutationFn: async (data: EquipmentFormData) => {
      return await apiRequest('/api/admin/equipment', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      toast({
        title: "Équipement ajouté",
        description: "L'équipement a été ajouté avec succès.",
      });
      addForm.reset();
      setIsAddModalOpen(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout.",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: EquipmentFormData & { id: number }) => {
      return await apiRequest(`/api/admin/equipment/${data.id}`, 'PUT', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      toast({
        title: "Équipement modifié",
        description: "L'équipement a été modifié avec succès.",
      });
      editForm.reset();
      setIsEditModalOpen(false);
      setEditingEquipment(null);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification.",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/equipment/${id}`, 'DELETE');
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
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive"
      });
    }
  });

  const uploadImagesMutation = useMutation({
    mutationFn: async ({ equipmentId, files }: { equipmentId: number, files: FileList }) => {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });
      
      const response = await fetch(`/api/admin/equipment/${equipmentId}/images`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      toast({
        title: "Images ajoutées",
        description: "Les images ont été uploadées avec succès.",
      });
      setSelectedImages(null);
      setUploadingImages(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'upload des images.",
        variant: "destructive"
      });
      setUploadingImages(false);
    }
  });

  const handleEdit = (eq: Equipment) => {
    setEditingEquipment(eq);
    editForm.reset({
      name: eq.name,
      category: eq.category,
      pricePerDay: eq.pricePerDay,
      description: eq.description || "",
      specifications: eq.specifications || [],
      location: eq.location,
      imageUrl: eq.imageUrl,
      isAvailable: eq.isAvailable,
      weight: eq.weight || "",
      fuelType: eq.fuelType || "",
      power: eq.power || ""
    });
    setIsEditModalOpen(true);
  };

  const handleImageUpload = (equipmentId: number) => {
    if (selectedImages && selectedImages.length > 0) {
      setUploadingImages(true);
      uploadImagesMutation.mutate({ equipmentId, files: selectedImages });
    }
  };

  const onAddSubmit = (data: EquipmentFormData) => {
    addMutation.mutate(data);
  };

  const onEditSubmit = (data: EquipmentFormData) => {
    if (editingEquipment) {
      updateMutation.mutate({ ...data, id: editingEquipment.id });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Admin Header */}
      <section className="bg-kamsen-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                Dashboard Administrateur
              </h1>
              <p className="text-xl text-blue-100">
                Gestion des équipements et des images
              </p>
            </div>
            
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary-orange hover:bg-primary-orange/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un équipement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel équipement</DialogTitle>
                </DialogHeader>
                
                <Form {...addForm}>
                  <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de l'équipement *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Pelleteuse Caterpillar 320" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Catégorie *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une catégorie" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {equipmentCategories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="pricePerDay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prix par jour (XOF) *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Ex: 75000" 
                                {...field} 
                                onChange={e => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Localisation *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une ville" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {locations.map((location) => (
                                  <SelectItem key={location} value={location}>
                                    {location}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={addForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Description détaillée de l'équipement..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="specifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spécifications techniques (optionnel)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Poids, dimensions, puissance, capacité..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        disabled={addMutation.isPending}
                        className="flex-1 bg-primary-orange hover:bg-primary-orange/90"
                      >
                        {addMutation.isPending ? "Ajout en cours..." : "Ajouter l'équipement"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddModalOpen(false)}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Equipment Management */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestion des équipements</h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-blue-700">
                <strong>Total:</strong> {equipment.length} équipements • 
                <strong> Disponibles:</strong> {equipment.filter(eq => eq.isAvailable).length} • 
                <strong> Non disponibles:</strong> {equipment.filter(eq => !eq.isAvailable).length}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment.map((eq) => (
                <Card key={eq.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{eq.name}</h3>
                        <Badge variant={eq.isAvailable ? "default" : "secondary"} className="mb-2">
                          {eq.isAvailable ? "Disponible" : "Non disponible"}
                        </Badge>
                        <p className="text-sm text-gray-600 mb-2">{eq.category}</p>
                        <p className="text-sm font-medium text-primary-orange">
                          {eq.pricePerDay.toLocaleString()} XOF/jour
                        </p>
                        <p className="text-xs text-gray-500 mt-1">📍 {eq.location}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Image Upload */}
                      <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => setSelectedImages(e.target.files)}
                          className="hidden"
                          id={`upload-${eq.id}`}
                        />
                        <label
                          htmlFor={`upload-${eq.id}`}
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Cliquer pour ajouter des images
                          </span>
                        </label>
                        
                        {selectedImages && selectedImages.length > 0 && (
                          <Button
                            onClick={() => handleImageUpload(eq.id)}
                            disabled={uploadingImages}
                            className="mt-2 w-full bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {uploadingImages ? "Upload..." : `Upload ${selectedImages.length} image(s)`}
                          </Button>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(eq)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Modifier
                        </Button>
                        <Button
                          onClick={() => deleteMutation.mutate(eq.id)}
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Supprimer
                        </Button>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(`/equipements/${eq.id}`, '_blank')}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Voir la page
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'équipement</DialogTitle>
          </DialogHeader>
          
          {editingEquipment && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'équipement *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {equipmentCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="pricePerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix par jour (XOF) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localisation *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="specifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spécifications techniques</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                    className="flex-1 bg-primary-orange hover:bg-primary-orange/90"
                  >
                    {updateMutation.isPending ? "Modification en cours..." : "Modifier l'équipement"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}