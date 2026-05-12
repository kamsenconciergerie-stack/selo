import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Clock, Shield, Wrench, Headphones, Award, Package, Car } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  const services = [
    {
      icon: Package,
      title: "📦 Envois de Colis",
      description: "Service d'envoi et de livraison de colis dans tout le Sénégal avec nos véhicules professionnels",
      features: [
        "Livraison rapide 24-48h",
        "Suivi en temps réel",
        "Assurance colis incluse",
        "Pickup à domicile disponible"
      ],
      bgColor: "bg-kamsen-blue-light",
      iconColor: "text-kamsen-blue"
    },
    {
      icon: Truck,
      title: "🚛 Location de Camion",
      description: "Location de camions porteurs, semi-remorques et camions bennes pour tous vos besoins de transport",
      features: [
        "Camions de 3.5T à 40T",
        "Avec ou sans chauffeur",
        "Assurance tous risques",
        "Maintenance incluse"
      ],
      bgColor: "bg-kamsen-blue-light", 
      iconColor: "text-kamsen-blue"
    },
    {
      icon: Car,
      title: "🛻 Fourgonnettes et Location d'Utilitaires",
      description: "Location de fourgons Renault Master, Mercedes Sprinter et véhicules utilitaires pour professionnels",
      features: [
        "Véhicules récents et entretenus",
        "Capacité 1.5T à 3.5T",
        "Idéal e-commerce et artisans",
        "Tarifs dégressifs longue durée"
      ],
      bgColor: "bg-kamsen-blue-light",
      iconColor: "text-kamsen-blue"
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
    <div className="min-h-screen bg-kamsen-blue-light">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-kamsen-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            🚛 Nos Services de Transport et Location
          </h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Envoi de colis, location de camions et véhicules utilitaires au Sénégal
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                        <h3 className="text-2xl font-bold text-kamsen-blue mb-3">
                          {service.title}
                        </h3>
                        <p className="text-kamsen-gray mb-4">
                          {service.description}
                        </p>
                        <ul className="space-y-2">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-kamsen-blue">
                              <div className="w-2 h-2 bg-kamsen-blue rounded-full mr-3"></div>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-kamsen-blue mb-4">
              Nos Garanties
            </h2>
            <p className="text-xl text-kamsen-gray">
              Votre satisfaction est notre priorité
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guarantees.map((guarantee) => {
              const Icon = guarantee.icon;
              return (
                <Card key={guarantee.title} className="text-center">
                  <CardContent className="p-8">
                    <div className="bg-kamsen-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-kamsen-blue" />
                    </div>
                    <h3 className="text-xl font-semibold text-kamsen-blue mb-4">
                      {guarantee.title}
                    </h3>
                    <p className="text-kamsen-gray">
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
      <section className="py-16 bg-kamsen-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Prêt à commencer votre projet ?
          </h2>
          <p className="text-xl text-kamsen-gray mb-8 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour un devis personnalisé et gratuit
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/devis">
              <Button className="bg-kamsen-blue hover:bg-kamsen-blue/90 text-white px-8 py-3 text-lg">
                Demander un devis
              </Button>
            </Link>
            <Link href="/equipements">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-kamsen-blue px-8 py-3 text-lg">
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