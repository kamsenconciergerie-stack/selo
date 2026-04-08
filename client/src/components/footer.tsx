import { Link } from "wouter";
import logoPath from "@assets/Screenshot_20260407_132036_Chrome_1775568074315.jpg";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-kamsen-blue text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + description */}
          <div>
            <div className="flex items-center mb-4">
              <img src={logoPath} alt="SELOV" className="h-12 w-auto" />
            </div>
            <p className="text-white mb-4">
              N°1 dans la location de voitures au Sénégal. Véhicules de tourisme, 4x4, bus et berlines disponibles partout au Sénégal.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/selov.sn" target="_blank" rel="noopener noreferrer" className="text-white hover:text-kamsen-orange">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-kamsen-orange">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white hover:text-kamsen-orange">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Nos Services</h3>
            <ul className="space-y-2">
              <li><Link href="/equipements?category=Véhicules de tourisme" className="text-white hover:text-kamsen-orange">Véhicules de tourisme</Link></li>
              <li><Link href="/equipements?category=Bus" className="text-white hover:text-kamsen-orange">Bus & Mini Bus</Link></li>
              <li><Link href="/equipements?category=4/4 tout terrain" className="text-white hover:text-kamsen-orange">4x4 tout terrain</Link></li>
              <li><Link href="/equipements?category=Pick up" className="text-white hover:text-kamsen-orange">Pick up</Link></li>
              <li><Link href="/equipements?category=Berlines" className="text-white hover:text-kamsen-orange">Berlines</Link></li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h3 className="font-semibold text-white mb-4">Entreprise</h3>
            <ul className="space-y-2">
              <li><Link href="/a-propos" className="text-white hover:text-kamsen-orange">À propos de SELOV</Link></li>
              <li><Link href="/services" className="text-white hover:text-kamsen-orange">Nos services</Link></li>
              <li><Link href="/devis" className="text-white hover:text-kamsen-orange">Demander un devis</Link></li>
              <li><a href="#" className="text-white hover:text-kamsen-orange">Conditions de location</a></li>
              <li><Link href="/contact" className="text-white hover:text-kamsen-orange">Nous contacter</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-1 text-kamsen-orange shrink-0" />
                <a href="tel:+221338275726" className="text-white hover:text-kamsen-orange">
                  +221 33 827 57 26
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-1 text-kamsen-orange shrink-0" />
                <a href="mailto:selov@selov.sn" className="text-white hover:text-kamsen-orange">
                  selov@selov.sn
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-kamsen-orange shrink-0" />
                <span className="text-white">Dakar, Sénégal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre du bas */}
        <div className="border-t border-kamsen-orange/30 mt-8 pt-8 text-center text-white">
          <p className="mb-2">Vous avez besoin d'un véhicule ? Contactez-nous pour un devis gratuit</p>
          <a href="tel:+221338275726" className="text-kamsen-orange font-bold text-xl mb-4 hover:text-orange-600 transition-colors block">
            +221 33 827 57 26
          </a>

          <a
            href="/contact"
            className="inline-block bg-kamsen-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-6"
          >
            Demandez un devis
          </a>

          <div className="text-sm text-white/70">
            <p>&copy; 2025 SELOV. Tous droits réservés.</p>
            <p className="mt-1 text-xs">un produit de ytech</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
