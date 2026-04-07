import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { CITIES } from "@/lib/constants";

export default function Hero() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [startDate, setStartDate] = useState("");

  const equipmentCategories = [
    "Camions et Transport",
    "BTP et Construction",
    "Électricité et Énergie", 
    "Pompage et Irrigation",
    "Équipement Agricole",
    "Équipement Spécialisé",
    "Manutention"
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedCity) params.append("location", selectedCity);
    
    setLocation(`/equipements?${params.toString()}`);
  };

  return (
    <section className="bg-hero-gradient text-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
            Location de camions et d'équipements<br />
            <span className="text-white font-extrabold">Professionnels</span> au Sénégal
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-white font-medium">
            Des centaines d'équipements disponibles partout au Sénégal
          </p>
          
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 border border-kamsen-orange">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-kamsen-blue mb-2">
                  Que cherchez-vous ?
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="text-kamsen-blue">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-kamsen-blue mb-2">
                  Ville
                </label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="text-kamsen-blue">
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-kamsen-blue mb-2">
                  Date de début
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-kamsen-blue"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch}
                  className="w-full bg-kamsen-blue hover:bg-kamsen-blue/90 text-white font-semibold"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
          
          {/* Bouton Demander un devis */}
          <div className="mt-8 text-center">
            <Link href="/devis">
              <Button className="bg-kamsen-orange hover:bg-kamsen-orange-dark text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105">
                Demander un devis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
