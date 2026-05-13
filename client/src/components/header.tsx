import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone } from "lucide-react";
import { useState } from "react";
import logoPath from "@assets/Screenshot_20260407_132036_Chrome_1775568074315.jpg";

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
    <header className="bg-kamsen-blue shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <img 
              src={logoPath} 
              alt="SELOV" 
              className="h-12 w-auto"
            />
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-kamsen-orange"
                    : "text-white hover:text-kamsen-orange"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <a href="tel:+221338275726" className="hidden sm:flex items-center text-white hover:text-kamsen-orange transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              <span>+221 33 827 57 26</span>
            </a>
            <Link href="/devis">
              <Button className="bg-kamsen-orange hover:bg-kamsen-orange-dark text-kamsen-blue-dark font-semibold">
                Demande de devis
              </Button>
            </Link>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-white hover:text-kamsen-orange hover:bg-kamsen-blue-dark">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-kamsen-blue border-kamsen-blue-dark">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link 
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`font-medium text-lg transition-colors ${
                        isActive(item.href)
                          ? "text-kamsen-orange"
                          : "text-white hover:text-kamsen-orange"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <a href="tel:+221338275726" className="flex items-center text-white pt-4 hover:text-kamsen-orange transition-colors">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>+221 33 827 57 26</span>
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
