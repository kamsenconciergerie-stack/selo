import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Truck } from "lucide-react";
import { useState } from "react";
import logoPath from "@assets/Screenshot_20250727_142246_Samsung Internet - Edited - Edited_20250727_142800_0000_1753631575213.jpg";

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
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-kamsen-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <img 
              src={logoPath} 
              alt="Kamsen - Des charges en moins" 
              className="h-10 w-auto"
            />
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-kamsen-blue"
                    : "text-kamsen-gray hover:text-kamsen-orange"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <a href="tel:+221710188989" className="hidden sm:flex items-center text-kamsen-gray hover:text-kamsen-blue transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              <span>+221 71 018 89 89</span>
            </a>
            <Link href="/devis">
              <Button className="bg-kamsen-orange hover:bg-kamsen-orange-dark-dark text-white">
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
                          ? "text-kamsen-blue"
                          : "text-kamsen-blue hover:text-kamsen-blue"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <a href="tel:+221710188989" className="flex items-center text-kamsen-blue pt-4 hover:text-kamsen-orange transition-colors">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>+221 71 018 89 89</span>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
