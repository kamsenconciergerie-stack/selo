import { Truck } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-aywa-blue text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="flex items-center bg-primary-orange rounded-lg p-2 mr-3">
                <Truck className="text-white h-6 w-6" />
              </div>
              <span className="font-bold text-2xl">
                <span className="text-white">AY</span>
                <span className="text-primary-orange">WA</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Votre partenaire de confiance pour la location d'équipement professionnel au Sénégal.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-orange">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-orange">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-orange">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-orange">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/equipements" className="hover:text-primary-orange">Location d'équipement</Link></li>
              <li><Link href="/services" className="hover:text-primary-orange">Livraison</Link></li>
              <li><Link href="/services" className="hover:text-primary-orange">Maintenance</Link></li>
              <li><Link href="/services" className="hover:text-primary-orange">Formation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Équipements</h3>
            <ul className="space-y-2">
              <li><Link href="/equipements-populaires" className="hover:text-primary-orange">Plus demandés</Link></li>
              <li><Link href="/equipements?category=Engins de Chantier" className="hover:text-primary-orange">Engins de chantier</Link></li>
              <li><Link href="/equipements?category=Équipement Électrique" className="hover:text-primary-orange">Équipement électrique</Link></li>
              <li><Link href="/equipements?category=Sécurité & EPI" className="hover:text-primary-orange">Sécurité & EPI</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Société</h3>
            <ul className="space-y-2">
              <li><Link href="/a-propos" className="hover:text-primary-orange">À propos</Link></li>
              <li><Link href="/services" className="hover:text-primary-orange">Nos services</Link></li>
              <li><a href="#" className="hover:text-primary-orange">Conditions de location</a></li>
              <li><Link href="/contact" className="hover:text-primary-orange">Nous contacter</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; 2025 Aywa. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
