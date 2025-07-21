import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SimpleAdmin() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Admin Header */}
      <section className="bg-aywa-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Dashboard Administrateur Aywa
            </h1>
            <p className="text-xl text-blue-100">
              Gestion des équipements et des images - En cours de développement
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card>
            <CardContent className="p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dashboard Administrateur
              </h2>
              <p className="text-gray-600 mb-8">
                Cette page permettra de gérer tous les équipements et leurs photos directement sur Replit.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">📷 Gestion des Images</h3>
                    <p className="text-gray-600 text-sm">
                      Upload et gestion des photos d'équipements
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">⚙️ Gestion des Équipements</h3>
                    <p className="text-gray-600 text-sm">
                      Ajouter, modifier et supprimer des équipements
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibent text-gray-900 mb-2">📊 Statistiques</h3>
                    <p className="text-gray-600 text-sm">
                      Voir les performances et les réservations
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8">
                <Button className="bg-primary-orange hover:bg-primary-orange/90">
                  Fonctionnalités bientôt disponibles
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}