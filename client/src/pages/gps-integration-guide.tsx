import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  MapPin, 
  Wifi, 
  Truck, 
  Bluetooth, 
  Radio, 
  Satellite,
  Battery,
  Shield,
  Clock,
  DollarSign,
  Zap
} from "lucide-react";

export default function GpsIntegrationGuide() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-kamsen-dark mb-4">
          Solutions de Traçage GPS pour Équipements Kamsen
        </h1>
        <p className="text-lg text-kamsen-medium">
          Guide complet des technologies disponibles pour localiser et suivre vos équipements en temps réel
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="hardware">Matériel GPS</TabsTrigger>
          <TabsTrigger value="mobile">Applications mobiles</TabsTrigger>
          <TabsTrigger value="iot">Capteurs IoT</TabsTrigger>
          <TabsTrigger value="implementation">Mise en œuvre</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-kamsen-dark" />
                  Trackers GPS dédiés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-kamsen-medium mb-4">
                  Boîtiers GPS autonomes fixés directement sur les équipements
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-kamsen-light text-green-800">
                    ✓ Précision maximale
                  </Badge>
                  <Badge variant="secondary" className="bg-kamsen-light text-green-800">
                    ✓ Autonomie longue durée
                  </Badge>
                  <Badge variant="secondary" className="bg-kamsen-light text-green-800">
                    ✓ Résistant aux intempéries
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-orange-600" />
                  Applications chauffeur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-kamsen-medium mb-4">
                  Apps mobiles utilisées par les chauffeurs/opérateurs
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-kamsen-light text-blue-800">
                    ✓ Mise en œuvre rapide
                  </Badge>
                  <Badge variant="secondary" className="bg-kamsen-light text-blue-800">
                    ✓ Coût réduit
                  </Badge>
                  <Badge variant="secondary" className="bg-kamsen-light text-blue-800">
                    ✓ Communication directe
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-purple-600" />
                  Capteurs IoT
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-kamsen-medium mb-4">
                  Capteurs connectés avec données complémentaires
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    ✓ Données enrichies
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    ✓ Maintenance prédictive
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    ✓ Alertes avancées
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hardware" className="space-y-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trackers GPS Recommandés pour le Sénégal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Teltonika FMB125</h3>
                      <Badge>Recommandé</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-green-500" />
                        <span>Autonomie: 3-5 ans</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span>IP67 - Étanche</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-orange-500" />
                        <span>2G/3G/4G compatibles Orange/Tigo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-kamsen-medium" />
                        <span>Prix: 45,000 - 65,000 FCFA</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Queclink GL300W</h3>
                      <Badge variant="secondary">Budget</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-yellow-500" />
                        <span>Autonomie: 2-3 semaines</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span>IP65 - Résistant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-orange-500" />
                        <span>2G/3G Orange/Tigo/Expresso</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-kamsen-medium" />
                        <span>Prix: 25,000 - 35,000 FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Installation recommandée:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Fixation magnétique ou boulonnée dans compartiment protégé</li>
                    <li>• Connexion à la batterie principale pour équipements électriques</li>
                    <li>• Antenne GPS externe pour camions fermés</li>
                    <li>• Carte SIM avec forfait data (minimum 100MB/mois)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Chauffeur Kamsen GPS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Fonctionnalités principales:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span>Géolocalisation automatique toutes les 30 secondes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Horodatage des étapes de livraison</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Smartphone className="h-4 w-4 text-green-500" />
                      <span>Photos de preuve de livraison</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <span>Mode hors ligne avec synchronisation</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Avantages:</h4>
                  <div className="space-y-2 text-sm">
                    <Badge variant="secondary" className="bg-kamsen-light text-green-800 block w-fit">
                      ✓ Aucun coût matériel
                    </Badge>
                    <Badge variant="secondary" className="bg-kamsen-light text-green-800 block w-fit">
                      ✓ Déploiement immédiat
                    </Badge>
                    <Badge variant="secondary" className="bg-kamsen-light text-green-800 block w-fit">
                      ✓ Communication client-chauffeur
                    </Badge>
                    <Badge variant="secondary" className="bg-kamsen-light text-green-800 block w-fit">
                      ✓ Interface intuitive en français
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Considérations:</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Dépend de la coopération du chauffeur</li>
                  <li>• Consomme la batterie du téléphone</li>
                  <li>• Nécessite une connexion internet mobile</li>
                  <li>• Formation requise pour les chauffeurs</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="iot" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Capteurs IoT Intelligents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-kamsen-dark" />
                    <h4 className="font-semibold">Localisation GPS</h4>
                  </div>
                  <p className="text-sm text-kamsen-medium">Position précise en temps réel</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-semibold">État moteur</h4>
                  </div>
                  <p className="text-sm text-kamsen-medium">Marche/arrêt, heures d'utilisation</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Battery className="h-5 w-5 text-kamsen-dark" />
                    <h4 className="font-semibold">Niveau carburant</h4>
                  </div>
                  <p className="text-sm text-kamsen-medium">Suivi consommation</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold">Sécurité</h4>
                  </div>
                  <p className="text-sm text-kamsen-medium">Alertes vol, zone interdite</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold">Maintenance</h4>
                  </div>
                  <p className="text-sm text-kamsen-medium">Diagnostics préventifs</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold">Utilisation</h4>
                  </div>
                  <p className="text-sm text-kamsen-medium">Statistiques d'usage détaillées</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan de Déploiement Recommandé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-l-4 border-l-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-900">Phase 1: Démarrage immédiat (0-2 semaines)</h4>
                    <p className="text-sm text-kamsen-medium mt-1">Application mobile chauffeur</p>
                    <ul className="text-sm text-kamsen-medium mt-2 space-y-1">
                      <li>• Développement app Android/iOS simple</li>
                      <li>• Formation équipe chauffeurs</li>
                      <li>• Test sur 5-10 équipements pilotes</li>
                      <li>• Coût: 500,000 - 800,000 FCFA</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-l-orange-500 pl-4">
                    <h4 className="font-semibold text-orange-900">Phase 2: Équipements critiques (1-2 mois)</h4>
                    <p className="text-sm text-kamsen-medium mt-1">Trackers GPS sur gros équipements</p>
                    <ul className="text-sm text-kamsen-medium mt-2 space-y-1">
                      <li>• Installation trackers sur pelleteuses, grues</li>
                      <li>• Abonnements data Orange/Tigo</li>
                      <li>• Formation équipe technique</li>
                      <li>• Coût: 1,500,000 - 2,500,000 FCFA</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-l-green-500 pl-4">
                    <h4 className="font-semibold text-green-900">Phase 3: Déploiement complet (2-6 mois)</h4>
                    <p className="text-sm text-kamsen-medium mt-1">IoT avancé sur toute la flotte</p>
                    <ul className="text-sm text-kamsen-medium mt-2 space-y-1">
                      <li>• Capteurs IoT sur tous équipements</li>
                      <li>• Tableau de bord analytique avancé</li>
                      <li>• Maintenance prédictive</li>
                      <li>• Coût: 3,000,000 - 5,000,000 FCFA</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Partenaires Techniques Sénégal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold">Matériel GPS</h4>
                    <div className="text-sm text-kamsen-medium space-y-1 mt-2">
                      <p>• <strong>Senegal GPS</strong> - Rue 6 x Corniche, Dakar</p>
                      <p>• <strong>Orange Business</strong> - Solutions IoT</p>
                      <p>• <strong>Tigo Fleet</strong> - Gestion de flotte</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold">Développement Apps</h4>
                    <div className="text-sm text-kamsen-medium space-y-1 mt-2">
                      <p>• <strong>Digital Africa</strong> - Plateau, Dakar</p>
                      <p>• <strong>Jokkolabs</strong> - Écosystème tech</p>
                      <p>• <strong>Équipe interne Kamsen</strong> - Recommandé</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}