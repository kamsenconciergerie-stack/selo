import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Truck } from "lucide-react";
import { useState } from "react";
import logoPath from "@assets/Screenshot_20250624_164242_Canva_1750783591400.jpg";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Équipements", href: "/equipements" },
    { name: "Services", href: "/services" },
    { name: "Devenir partenaire", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <div className="flex items-center bg-aywa-gradient rounded-lg p-2 mr-3">
              <Truck className="text-primary-orange h-6 w-6" />
            </div>
            <div className="flex items-center">
              <span className="font-bold text-2xl">
                <span className="text-aywa-blue">AY</span>
                <span className="text-primary-orange">WA</span>
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary-orange"
                    : "text-gray-700 hover:text-primary-orange"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center text-gray-700 hover:text-primary-orange">
              <Phone className="h-4 w-4 mr-2" />
              <span>+221 78 606 70 13</span>
            </div>
            <Link href="/devis">
              <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white">
                Demande de devis
              </Button>
            </Link>
            
            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link 
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`font-medium text-lg transition-colors ${
                        isActive(item.href)
                          ? "text-primary-orange"
                          : "text-gray-700 hover:text-primary-orange"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="flex items-center text-gray-700 pt-4">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>+221 78 606 70 13</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
