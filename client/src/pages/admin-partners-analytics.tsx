import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  Award,
  AlertTriangle,
  Building,
  Star,
  Download,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

const COLORS = ['#FF8800', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function AdminPartnersAnalyticsContent() {
  const [timeRange, setTimeRange] = useState("30d");
  const [analyticsData, setAnalyticsData] = useState({
    partnerGrowth: [],
    performanceMetrics: [],
    geographicDistribution: [],
    businessTypeDistribution: [],
    monthlyRevenue: [],
    verificationTrends: []
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    // Mock analytics data - replace with actual API calls
    const mockData = {
      partnerGrowth: [
        { month: "Sep 2024", nouveaux: 2, total: 8 },
        { month: "Oct 2024", nouveaux: 3, total: 11 },
        { month: "Nov 2024", nouveaux: 4, total: 15 },
        { month: "Déc 2024", nouveaux: 5, total: 20 },
        { month: "Jan 2025", nouveaux: 4, total: 24 }
      ],
      performanceMetrics: [
        { partenaire: "Transport Express", note: 4.8, locations: 156, revenus: 2500000 },
        { partenaire: "Logistics Pro", note: 4.6, locations: 124, revenus: 1800000 },
        { partenaire: "Camions du Fleuve", note: 4.5, locations: 98, revenus: 1400000 },
        { partenaire: "Sud Transport", note: 4.2, locations: 67, revenus: 950000 }
      ],
      geographicDistribution: [
        { name: "Dakar", value: 8, percentage: 33 },
        { name: "Thiès", value: 5, percentage: 21 },
        { name: "Saint-Louis", value: 4, percentage: 17 },
        { name: "Kaolack", value: 3, percentage: 12 },
        { name: "Autres", value: 4, percentage: 17 }
      ],
      businessTypeDistribution: [
        { name: "Transport routier", value: 12, percentage: 50 },
        { name: "Logistique", value: 6, percentage: 25 },
        { name: "Location équipements", value: 4, percentage: 17 },
        { name: "Services connexes", value: 2, percentage: 8 }
      ],
      monthlyRevenue: [
        { month: "Sep", revenus: 4200000, commissions: 420000 },
        { month: "Oct", revenus: 5800000, commissions: 580000 },
        { month: "Nov", revenus: 6500000, commissions: 650000 },
        { month: "Déc", revenus: 7200000, commissions: 720000 },
        { month: "Jan", revenus: 6800000, commissions: 680000 }
      ],
      verificationTrends: [
        { semaine: "S1", verifies: 2, attente: 1, rejetes: 0 },
        { semaine: "S2", verifies: 3, attente: 2, rejetes: 1 },
        { semaine: "S3", verifies: 1, attente: 3, rejetes: 0 },
        { semaine: "S4", verifies: 2, attente: 1, rejetes: 1 }
      ]
    };
    
    setAnalyticsData(mockData);
  };

  const formatPrice = (price: number) => {
    return `${(price / 1000000).toFixed(1)}M FCFA`;
  };

  const exportAnalytics = () => {
    // Create comprehensive analytics export
    const exportData = {
      generated_at: new Date().toISOString(),
      time_range: timeRange,
      summary: {
        total_partners: 24,
        verified_partners: 18,
        total_revenue: 32500000,
        avg_rating: 4.5
      },
      performance_metrics: analyticsData.performanceMetrics,
      geographic_data: analyticsData.geographicDistribution,
      growth_data: analyticsData.partnerGrowth
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `aywa-partners-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <TrendingUp className="h-8 w-8" />
                Analyses du Réseau de Partenaires
              </h1>
              <p className="text-gray-600">
                Insights et métriques détaillées de performance
              </p>
            </div>
            <div className="flex gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                  <SelectItem value="90d">3 derniers mois</SelectItem>
                  <SelectItem value="1y">Dernière année</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportAnalytics} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </div>

        {/* Croissance des partenaires */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Croissance du Réseau
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.partnerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="nouveaux" stroke="#FF8800" name="Nouveaux" strokeWidth={3} />
                  <Line type="monotone" dataKey="total" stroke="#00C49F" name="Total" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Distribution géographique */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Répartition Géographique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.geographicDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                    >
                      {analyticsData.geographicDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {analyticsData.geographicDistribution.map((item, index) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.value}</span>
                      <Badge variant="secondary">{item.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Types d'activité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Types d'Activité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.businessTypeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#FF8800" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance des partenaires */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Performances Détaillées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Partenaire</th>
                    <th className="text-center p-3">Note</th>
                    <th className="text-center p-3">Locations</th>
                    <th className="text-right p-3">Revenus générés</th>
                    <th className="text-center p-3">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.performanceMetrics.map((partner, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{partner.partenaire}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{partner.note}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-medium">{partner.locations}</td>
                      <td className="p-3 text-right font-medium">{formatPrice(partner.revenus)}</td>
                      <td className="p-3 text-center">
                        <Badge className={
                          partner.note >= 4.5 ? 'bg-green-100 text-green-800' :
                          partner.note >= 4.0 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {partner.note >= 4.5 ? 'Excellent' :
                           partner.note >= 4.0 ? 'Très bon' : 'Bon'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Revenus mensuels */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Évolution des Revenus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatPrice(value)} />
                  <Tooltip formatter={(value) => formatPrice(Number(value))} />
                  <Bar dataKey="revenus" fill="#FF8800" name="Revenus totaux" />
                  <Bar dataKey="commissions" fill="#00C49F" name="Commissions Aywa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tendances de vérification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Processus de Vérification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.verificationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semaine" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="verifies" fill="#00C49F" name="Vérifiés" />
                  <Bar dataKey="attente" fill="#FFBB28" name="En attente" />
                  <Bar dataKey="rejetes" fill="#FF8042" name="Rejetés" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminPartnersAnalytics() {
  return (
    <ProtectedAdminRoute>
      <AdminPartnersAnalyticsContent />
    </ProtectedAdminRoute>
  );
}