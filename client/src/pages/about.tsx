import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Clock, Award, Target, Heart } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const stats = [
    {
      icon: Users,
      number: "500+",
      label: "Clients satisfaits",
      description: "Entreprises et particuliers nous font confiance"
    },
    {
      icon: MapPin,
      number: "8",
      label: "Villes couvertes",
      description: "Présence dans tout le Sénégal"
    },
    {
      icon: Clock,
      number: "5+",
      label: "Années d'expérience",
      description: "Expertise dans la location d'équipement"
    },
    {
      icon: Award,
      number: "98%",
      label: "Taux de satisfaction",
      description: "Clients recommandent nos services"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "Nous nous engageons à fournir des équipements de la plus haute qualité et un service irréprochable."
    },
    {
      icon: Heart,
      title: "Confiance",
      description: "La transparence et l'honnêteté sont au cœur de toutes nos relations avec nos clients."
    },
    {
      icon: Users,
      title: "Proximité",
      description: "Nous privilégions une approche personnalisée et un contact direct avec nos clients."
    }
  ];

  const team = [
    {
      name: "Amadou Diallo",
      role: "Directeur Général",
      description: "15 ans d'expérience dans le secteur de la construction au Sénégal",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
    },
    {
      name: "Fatou Sow",
      role: "Directrice Commerciale",
      description: "Spécialisée dans la relation client et le développement commercial",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b2bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
    },
    {
      name: "Moussa Kane",
      role: "Responsable Technique",
      description: "Expert en maintenance et réparation d'équipements lourds",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-hero-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                À Propos d'Aywa
              </h1>
              <p className="text-xl text-orange-100 mb-8">
                Depuis 2020, Aywa accompagne les professionnels et les particuliers 
                dans leurs projets en fournissant des équipements de qualité et 
                un service personnalisé partout au Sénégal.
              </p>
              <Link href="/contact">
                <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white px-8 py-3 text-lg">
                  Nous contacter
                </Button>
              </Link>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Équipe Aywa"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="text-center">
                  <CardContent className="p-6">
                    <div className="bg-primary-orange/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary-orange" />
                    </div>
                    <div className="text-3xl font-bold text-aywa-blue mb-2">
                      {stat.number}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      {stat.label}
                    </div>
                    <p className="text-sm text-gray-600">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Mission Aywa"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Chez Aywa, notre mission est de démocratiser l'accès aux équipements 
                professionnels au Sénégal. Nous croyons que chaque projet, qu'il soit 
                grand ou petit, mérite d'avoir accès aux meilleurs outils.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Nous nous engageons à offrir un service de qualité, des prix 
                compétitifs et un accompagnement personnalisé pour garantir 
                la réussite de vos projets.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {values.map((value) => {
                  const Icon = value.icon;
                  return (
                    <div key={value.title} className="text-center">
                      <div className="bg-aywa-blue/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon className="h-6 w-6 text-aywa-blue" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une équipe passionnée et expérimentée à votre service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <Card key={member.name} className="text-center">
                <CardContent className="p-6">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-orange font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-aywa-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Rejoignez nos clients satisfaits
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Découvrez pourquoi plus de 500 clients nous font confiance pour leurs projets
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/equipements">
              <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white px-8 py-3 text-lg">
                Voir nos équipements
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-aywa-blue px-8 py-3 text-lg">
                Demander un devis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}