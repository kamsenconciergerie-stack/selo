import { Truck } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-kamsen-blue text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="flex items-center bg-kamsen-blue rounded-lg p-2 mr-3">
                <Truck className="text-white h-6 w-6" />
              </div>
              <span className="font-bold text-2xl text-white">
                KAMSEN
              </span>
            </div>
            <p className="text-white mb-4">
              Votre partenaire de confiance pour la location d'équipement professionnel au Sénégal.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-kamsen-orange">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-kamsen-orange">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-kamsen-orange">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-white hover:text-kamsen-orange">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/equipements" className="text-white hover:text-kamsen-orange">Location d'équipement</Link></li>
              <li><Link href="/services" className="text-white hover:text-kamsen-orange">Livraison</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Équipements</h3>
            <ul className="space-y-2">
              <li><Link href="/equipements-populaires" className="text-white hover:text-kamsen-orange">Plus demandés</Link></li>
              <li><Link href="/equipements?category=Engins de Chantier" className="text-white hover:text-kamsen-orange">Engins de chantier</Link></li>
              <li><Link href="/equipements?category=Équipement Électrique" className="text-white hover:text-kamsen-orange">Équipement électrique</Link></li>
              <li><Link href="/equipements?category=Sécurité & EPI" className="text-white hover:text-kamsen-orange">Sécurité & EPI</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Entreprise</h3>
            <ul className="space-y-2">
              <li><Link href="/a-propos" className="text-white hover:text-kamsen-orange">À propos</Link></li>
              <li><Link href="/services" className="text-white hover:text-kamsen-orange">Nos services</Link></li>
              <li><a href="#" className="text-white hover:text-kamsen-orange">Nos APIs</a></li>
              <li><a href="#" className="text-white hover:text-kamsen-orange">Conditions de location</a></li>
              <li><Link href="/contact" className="text-white hover:text-kamsen-orange">Nous contacter</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-kamsen-orange/30 mt-8 pt-8 text-center text-white">
          <p className="mb-2">Votre ville n'est pas listée ? Contactez-nous pour un devis personnalisé</p>
          <p className="text-kamsen-orange font-bold text-xl mb-4">+221 71 018 89 89</p>
          
          <a 
            href="/contact" 
            className="inline-block bg-kamsen-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-6"
          >
            Demandez un devis
          </a>
          
          <div>
            <p>&copy; 2025 Kamsen. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
