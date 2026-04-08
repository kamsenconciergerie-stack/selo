import Header from "@/components/header";
import Footer from "@/components/footer";
import EquipmentCard from "@/components/equipment-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { CITIES, CATEGORIES } from "@/lib/constants";

export default function EquipmentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  
  // Get URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    const search = urlParams.get("search");
    const location = urlParams.get("location");
    
    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
    if (location) setSelectedLocation(location);
  }, []);

  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment", { 
      category: selectedCategory && selectedCategory !== "all" ? selectedCategory : undefined,
      search: searchQuery || undefined,
      location: selectedLocation && selectedLocation !== "all" ? selectedLocation : undefined,
    }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      if (selectedLocation && selectedLocation !== "all") params.append("location", selectedLocation);
      
      const response = await fetch(`/api/equipment?${params.toString()}`);
      if (!response.ok) throw new Error("Erreur lors du chargement des équipements");
      return response.json();
    },
  });

  const handleSearch = () => {
    // Force refetch with current filters
    window.location.search = new URLSearchParams({
      ...(selectedCategory && selectedCategory !== "all" && { category: selectedCategory }),
      ...(searchQuery && { search: searchQuery }),
      ...(selectedLocation && selectedLocation !== "all" && { location: selectedLocation }),
    }).toString();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    window.location.search = "";
  };

  return (
    <div className="min-h-screen bg-kamsen-blue-light">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-kamsen-gradient text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Notre Flotte de Véhicules
            </h1>
            <p className="text-xl text-orange-100">
              Voitures, 4x4, Bus, Berlines — louez le véhicule qu'il vous faut
            </p>
          </div>
        </div>
      </section>

      {/* Moyens de Paiement */}
      <section className="py-6 bg-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Moyens de Paiement Acceptés
            </h3>
            <div className="flex justify-center items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8.5 16L12 13.5 15.5 16 12 18.5 8.5 16z"/>
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Orange Money</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 17h18c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2z"/>
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Wave</span>
              </div>
              <span className="text-sm text-green-600 font-medium">
                ✓ Paiement 100% sécurisé
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Rechercher un équipement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:col-span-2"
            />
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les villes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="bg-kamsen-blue hover:bg-kamsen-blue/90">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Effacer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-kamsen-blue">
              {equipment.length} équipement{equipment.length !== 1 ? 's' : ''} trouvé{equipment.length !== 1 ? 's' : ''}
            </h2>
            {(selectedCategory && selectedCategory !== "all" || searchQuery || selectedLocation && selectedLocation !== "all") && (
              <Button variant="ghost" onClick={clearFilters}>
                Voir tous les équipements
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : equipment.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {equipment.map((item) => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-kamsen-blue mb-4">
                  Aucun équipement trouvé
                </h3>
                <p className="text-kamsen-gray mb-6">
                  Essayez de modifier vos critères de recherche ou consultez toutes nos catégories.
                </p>
                <Button onClick={clearFilters} className="bg-kamsen-blue hover:bg-kamsen-blue/90">
                  Voir tous les équipements
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
