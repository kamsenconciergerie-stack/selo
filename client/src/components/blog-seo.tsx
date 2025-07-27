import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Calendar, User, ArrowRight } from "lucide-react";

const blogArticles = [
  {
    id: 1,
    title: "Guide Complet: Location de Pelleteuse au Sénégal 2025",
    excerpt: "Découvrez tout ce qu'il faut savoir pour louer une pelleteuse au Sénégal : tarifs, conseils, zones de livraison et équipements disponibles.",
    date: "2025-01-27",
    author: "Équipe Kamsen",
    category: "Engins de Chantier",
    slug: "/blog/location-pelleteuse-senegal-guide-2025",
    keywords: "location pelleteuse Sénégal, tarif pelleteuse Dakar, location engins chantier"
  },
  {
    id: 2,
    title: "Tracteur vs Location: Quel Choix pour Votre Exploitation Agricole ?",
    excerpt: "Analyse comparative entre l'achat et la location de tracteurs pour les agriculteurs sénégalais. Coûts, avantages et recommandations.",
    date: "2025-01-26",
    author: "Équipe Kamsen",
    category: "Agriculture",
    slug: "/blog/achat-vs-location-tracteur-senegal",
    keywords: "location tracteur Sénégal, achat tracteur agriculture, coût tracteur fermier"
  },
  {
    id: 3,
    title: "Top 10 des Équipements Indispensables pour le BTP au Sénégal",
    excerpt: "Liste des équipements de construction les plus demandés au Sénégal avec tarifs de location et conseils d'utilisation.",
    date: "2025-01-25",
    author: "Équipe Kamsen",
    category: "BTP",
    slug: "/blog/top-equipements-btp-senegal-2025",
    keywords: "équipement BTP Sénégal, matériel construction Dakar, location BTP"
  },
  {
    id: 4,
    title: "Générateur Électrique: Comment Choisir la Bonne Puissance",
    excerpt: "Guide pratique pour choisir la puissance de générateur adaptée à vos besoins au Sénégal. Calculs et recommandations.",
    date: "2025-01-24",
    author: "Équipe Kamsen", 
    category: "Électrique",
    slug: "/blog/choisir-puissance-generateur-senegal",
    keywords: "générateur électrique Sénégal, groupe électrogène Dakar, puissance générateur"
  }
];

export default function BlogSEO() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Guides et Conseils Location d'Équipement
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos guides experts pour optimiser la location de vos équipements au Sénégal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-kamsen-blue to-blue-700 h-48 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <span className="bg-kamsen-orange px-3 py-1 rounded-full text-sm font-semibold">
                      {article.category}
                    </span>
                    <h3 className="text-xl font-bold mt-4 line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                    <User className="h-4 w-4 mr-1" />
                    <span>{article.author}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Mots-clés: {article.keywords}
                    </span>
                    <Link href={article.slug}>
                      <button className="flex items-center text-kamsen-blue hover:text-kamsen-orange font-semibold text-sm">
                        Lire plus
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Besoin de conseils personnalisés pour votre projet au Sénégal ?
          </p>
          <Link href="/contact">
            <button className="bg-kamsen-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Contactez Nos Experts
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}