import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Clock, Shield, Wrench, Headphones, Award } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  const services = [
    {
      icon: Truck,
      title: "Livraison et Reprise",
      description: "Service de livraison gratuit dans Dakar et tarifs préférentiels dans tout le Sénégal",
      features: [
        "Livraison le jour même à Dakar",
        "Reprise incluse dans le tarif",
        "Équipe de livraison professionnelle",
        "Déchargement sur site"
      ],
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Wrench,
      title: "Maintenance & Réparation",
      description: "Service de maintenance préventive et réparation sur site",
      features: [
        "Maintenance préventive incluse",
        "Intervention rapide en cas de panne",
        "Techniciens qualifiés",
        "Pièces de rechange disponibles"
      ],
      bgColor: "bg-green-100", 
      iconColor: "text-green-600"
    },
    {
      icon: Shield,
      title: "Formation & Sécurité",
      description: "Formation complète à l'utilisation sécuritaire des équipements",
      features: [
        "Formation obligatoire pour gros équipements",
        "Certification sécurité",
        "Manuels d'utilisation en français",
        "Support technique continu"
      ],
      bgColor: "bg-orange-100",
      iconColor: "text-primary-orange"
    },
    {
      icon: Headphones,
      title: "Support 24/7",
      description: "Assistance technique et commerciale disponible à tout moment",
      features: [
        "Ligne d'urgence 24h/24",
        "Chat en ligne",
        "Support technique spécialisé",
        "Suivi de commande en temps réel"
      ],
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  const guarantees = [
    {
      icon: Clock,
      title: "Livraison Garantie",
      description: "Respect des délais de livraison ou remboursement partiel"
    },
    {
      icon: Shield,
      title: "Équipements Certifiés",
      description: "Tous nos équipements sont certifiés et aux normes internationales"
    },
    {
      icon: Award,
      title: "Satisfaction Client",
      description: "98% de taux de satisfaction client depuis 2020"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-hero-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Nos Services
          </h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Des services complets pour accompagner vos projets du début à la fin
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} className="overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className={`${service.bgColor} p-4 rounded-lg`}>
                        <Icon className={`h-8 w-8 ${service.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {service.description}
                        </p>
                        <ul className="space-y-2">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-gray-700">
                              <div className="w-2 h-2 bg-primary-orange rounded-full mr-3"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos Garanties
            </h2>
            <p className="text-xl text-gray-600">
              Votre satisfaction est notre priorité
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guarantees.map((guarantee) => {
              const Icon = guarantee.icon;
              return (
                <Card key={guarantee.title} className="text-center">
                  <CardContent className="p-8">
                    <div className="bg-primary-orange/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-primary-orange" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {guarantee.title}
                    </h3>
                    <p className="text-gray-600">
                      {guarantee.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-aywa-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Prêt à commencer votre projet ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour un devis personnalisé et gratuit
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white px-8 py-3 text-lg">
                Demander un devis
              </Button>
            </Link>
            <Link href="/equipements">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-aywa-blue px-8 py-3 text-lg">
                Voir les équipements
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}