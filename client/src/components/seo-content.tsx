import LocalSEO from "./local-seo";
import BlogSEO from "./blog-seo";

export default function SEOContent() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Location d'Équipement Professionnel au Sénégal
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Kamsen est votre partenaire de confiance pour la location d'équipement professionnel 
            dans tout le Sénégal. Nous couvrons Dakar, Thiès, Saint-Louis, Kaolack et toutes les régions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Location de Pelleteuses à Dakar
            </h3>
            <p className="text-gray-600">
              Pelleteuses hydrauliques, mini-pelles et engins de terrassement disponibles 
              pour vos chantiers à Dakar et sa banlieue. Livraison rapide et tarifs compétitifs.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Location de Camions au Sénégal
            </h3>
            <p className="text-gray-600">
              Camions bennes, camions plateaux et véhicules utilitaires pour vos transports 
              de marchandises et matériaux dans tout le Sénégal.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Location de Générateurs Électriques
            </h3>
            <p className="text-gray-600">
              Groupes électrogènes et générateurs de toutes puissances pour événements, 
              chantiers et urgences. Maintenance incluse.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Pourquoi Choisir Kamsen pour Votre Location d'Équipement ?
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-kamsen-orange font-bold mr-2">✓</span>
                Plus de 500 équipements disponibles dans tout le Sénégal
              </li>
              <li className="flex items-start">
                <span className="text-kamsen-orange font-bold mr-2">✓</span>
                Livraison et installation par nos techniciens qualifiés
              </li>
              <li className="flex items-start">
                <span className="text-kamsen-orange font-bold mr-2">✓</span>
                Tarifs transparents et devis gratuit en 24h
              </li>
              <li className="flex items-start">
                <span className="text-kamsen-orange font-bold mr-2">✓</span>
                Support technique 24h/7j et maintenance incluse
              </li>
              <li className="flex items-start">
                <span className="text-kamsen-orange font-bold mr-2">✓</span>
                Équipements neufs et régulièrement entretenus
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
            besoin d un devis?
          </h3>
          <p className="text-lg mb-6">
            Contactez-nous dès maintenant pour obtenir un devis personnalisé 
            et gratuit pour la location de vos équipements professionnels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+221786067013" 
              className="bg-kamsen-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Appeler +221 78 606 70 13
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

      {/* Blog SEO Section */}
      <BlogSEO />
    </section>
  );
}