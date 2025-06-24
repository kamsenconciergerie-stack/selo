export const CITIES = [
  "Dakar",
  "Thiès", 
  "Saint-Louis",
  "Kaolack",
  "Ziguinchor",
  "Diourbel",
  "Tambacounda",
  "Fatick"
];

export const CATEGORIES = [
  "Outils à Main",
  "Engins de Chantier",
  "Équipement Électrique", 
  "Sécurité & EPI"
];

export const SERVICE_AREAS = [
  {
    city: "Dakar",
    description: "Zone principale - Livraison gratuite",
    deliveryTime: "Livraison le jour même",
    cost: 0
  },
  {
    city: "Thiès", 
    description: "Livraison sous 24h",
    deliveryTime: "Livraison sous 24h",
    cost: 15000
  },
  {
    city: "Saint-Louis",
    description: "Livraison sous 48h", 
    deliveryTime: "Livraison sous 48h",
    cost: 25000
  },
  {
    city: "Kaolack",
    description: "Livraison sous 48h",
    deliveryTime: "Livraison sous 48h", 
    cost: 20000
  }
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
