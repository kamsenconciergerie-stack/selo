import { Truck } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-kamsen-blue text-kamsen-gray py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="flex items-center bg-kamsen-blue rounded-lg p-2 mr-3">
                <Truck className="text-white h-6 w-6" />
              </div>
              <span className="font-bold text-2xl">
                <span className="text-white">KAM</span>
                <span className="text-kamsen-blue">SEN</span>
              </span>
            </div>
            <p className="text-kamsen-gray mb-4">
              Votre partenaire de confiance pour la location d'équipement professionnel au Sénégal.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-kamsen-gray hover:text-kamsen-blue">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-kamsen-gray hover:text-kamsen-blue">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-kamsen-gray hover:text-kamsen-blue">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-kamsen-gray hover:text-kamsen-blue">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/equipements" className="hover:text-kamsen-blue">Location d'équipement</Link></li>
              <li><Link href="/services" className="hover:text-kamsen-blue">Livraison</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Équipements</h3>
            <ul className="space-y-2">
              <li><Link href="/equipements-populaires" className="hover:text-kamsen-blue">Plus demandés</Link></li>
              <li><Link href="/equipements?category=Engins de Chantier" className="hover:text-kamsen-blue">Engins de chantier</Link></li>
              <li><Link href="/equipements?category=Équipement Électrique" className="hover:text-kamsen-blue">Équipement électrique</Link></li>
              <li><Link href="/equipements?category=Sécurité & EPI" className="hover:text-kamsen-blue">Sécurité & EPI</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Entreprise</h3>
            <ul className="space-y-2">
              <li><Link href="/a-propos" className="hover:text-kamsen-blue">À propos</Link></li>
              <li><Link href="/services" className="hover:text-kamsen-blue">Nos services</Link></li>
              <li><a href="#" className="hover:text-kamsen-blue">Nos APIs</a></li>
              <li><a href="#" className="hover:text-kamsen-blue">Conditions de location</a></li>
              <li><Link href="/contact" className="hover:text-kamsen-blue">Nous contacter</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-kamsen-blue mt-8 pt-8 text-center">
          <p>&copy; 2025 Kamsen. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
