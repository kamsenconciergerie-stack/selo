import LocalSEO from "./local-seo";
import BlogSEO from "./blog-seo";

export default function SEOContent() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Location de Voitures au Sénégal — SELOV
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            SELOV est votre partenaire de confiance pour la location de voitures au Sénégal. 
            Nous couvrons Dakar, Thiès, Saint-Louis, Kaolack et toutes les régions du pays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Location de Voitures à Dakar
            </h3>
            <p className="text-gray-600">
              Berlines, SUV et véhicules de tourisme disponibles pour vos déplacements 
              à Dakar et sa banlieue. Avec ou sans chauffeur, tarifs compétitifs.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              4x4 et Pick-up Tout Terrain au Sénégal
            </h3>
            <p className="text-gray-600">
              Véhicules robustes pour missions terrain, ONG, chantiers et zones difficiles 
              d'accès au Sénégal. Service fiable et chauffeurs expérimentés disponibles.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Bus et Mini Bus — Transport de Groupe
            </h3>
            <p className="text-gray-600">
              Location de bus et mini bus pour excursions, événements, sorties scolaires 
              et déplacements de groupe partout au Sénégal. De 15 à 60 passagers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Pourquoi Choisir SELOV pour Votre Location de Voiture ?
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-kamsen-orange font-bold mr-2">✓</span>
                Flotte complète de véhicules disponibles dans tout le Sénégal
              </li>

              <li className="flex items-start">
                <span className="text-kamsen-orange font-bold mr-2">✓</span>
                Tarifs transparents et devis gratuit en 24h
              </li>

              <li className="flex items-start">
                <span className="text-kamsen-orange font-bold mr-2">✓</span>
                Véhicules récents, assurés et régulièrement entretenus
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Nos Zones d'Intervention au Sénégal
            </h3>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Région de Dakar</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Dakar Centre</li>
                  <li>• Pikine</li>
                  <li>• Guédiawaye</li>
                  <li>• Rufisque</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Autres Régions</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Thiès</li>
                  <li>• Saint-Louis</li>
                  <li>• Kaolack</li>
                  <li>• Ziguinchor</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-kamsen-blue text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">
            Besoin d'un Devis?
          </h3>
          <p className="text-lg mb-6">
            Location de voitures, 4x4, bus et berlines partout au Sénégal. 
            Contactez-nous pour un devis personnalisé gratuit en 24h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+221338275726" 
              className="bg-kamsen-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Appeler +221 33 827 57 26
            </a>
            <a 
              href="/contact" 
              className="bg-white text-kamsen-blue hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Demander un Devis En Ligne
            </a>
          </div>
        </div>
      </div>

      {/* Local SEO Section */}
      <LocalSEO />
    </section>
  );
}