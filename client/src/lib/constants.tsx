export const CITIES = [
  "Dakar",
  "Thiès", 
  "Saint-Louis",
  "Kaolack",
  "Ziguinchor",
  "Diourbel",
  "Tambacounda",
  "Fatick",
  "Kolda",
  "Matam",
  "Kédougou",
  "Sédhiou",
  "Kaffrine",
  "Louga"
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
    description: "Livraison sous 24h - à partir de 15 000 XOF",
    deliveryTime: "Livraison sous 24h - à partir de 15 000 XOF",
    cost: 15000
  },
  {
    city: "Saint-Louis",
    description: "Livraison sous 48h - à partir de 25 000 XOF", 
    deliveryTime: "Livraison sous 48h - à partir de 25 000 XOF",
    cost: 25000
  },
  {
    city: "Kaolack",
    description: "Livraison sous 48h - à partir de 20 000 XOF",
    deliveryTime: "Livraison sous 48h - à partir de 20 000 XOF", 
    cost: 20000
  },
  {
    city: "Ziguinchor",
    description: "Livraison sous 72h - à partir de 35 000 XOF",
    deliveryTime: "Livraison sous 72h - à partir de 35 000 XOF", 
    cost: 35000
  },
  {
    city: "Diourbel",
    description: "Livraison sous 24h - à partir de 18 000 XOF",
    deliveryTime: "Livraison sous 24h - à partir de 18 000 XOF", 
    cost: 18000
  },
  {
    city: "Tambacounda",
    description: "Livraison sous 72h - à partir de 40 000 XOF",
    deliveryTime: "Livraison sous 72h - à partir de 40 000 XOF", 
    cost: 40000
  },
  {
    city: "Fatick",
    description: "Livraison sous 48h - à partir de 22 000 XOF",
    deliveryTime: "Livraison sous 48h - à partir de 22 000 XOF", 
    cost: 22000
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
