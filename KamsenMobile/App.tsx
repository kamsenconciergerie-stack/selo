import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';

interface Equipment {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  availability: string;
}

export default function App() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    'all', 'Camion porteur', 'Camion semi-remorque', 'Camion citerne', 
    'Pelleteuse', 'Chargeuse', 'Générateur', 'Autres équipements'
  ];

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      // En attendant l'API, utilisons des données de démonstration
      const demoEquipment: Equipment[] = [
        {
          id: 1,
          name: "PowerMax Pro 3000",
          category: "Générateur",
          price: 25000,
          description: "Générateur diesel haute performance",
          availability: "available"
        },
        {
          id: 2,
          name: "TitanMax Excavator",
          category: "Pelleteuse",
          price: 45000,
          description: "Pelleteuse hydraulique 20 tonnes",
          availability: "available"
        },
        {
          id: 3,
          name: "CargoMax Transport",
          category: "Camion porteur",
          price: 35000,
          description: "Camion porteur 15 tonnes",
          availability: "rented"
        }
      ];
      setEquipment(demoEquipment);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setLoading(false);
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleBookEquipment = (equipment: Equipment) => {
    Alert.alert(
      'Réserver équipement',
      `Voulez-vous réserver ${equipment.name}?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Réserver', onPress: () => bookEquipment(equipment) }
      ]
    );
  };

  const bookEquipment = (equipment: Equipment) => {
    // Ici nous implémenterons la logique de réservation
    Alert.alert(
      'Réservation confirmée',
      `Votre demande de réservation pour ${equipment.name} a été envoyée. Un agent vous contactera bientôt.`
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement des équipements...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#f97316" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kamsen</Text>
        <Text style={styles.headerSubtitle}>Location d'Équipement</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un équipement..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category === 'all' ? 'Tout' : category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Equipment List */}
      <ScrollView style={styles.equipmentList} showsVerticalScrollIndicator={false}>
        {filteredEquipment.map((item) => (
          <View key={item.id} style={styles.equipmentCard}>
            <View style={styles.equipmentImagePlaceholder}>
              <Text style={styles.equipmentImageText}>{item.category}</Text>
            </View>
            
            <View style={styles.equipmentInfo}>
              <Text style={styles.equipmentName}>{item.name}</Text>
              <Text style={styles.equipmentCategory}>{item.category}</Text>
              <Text style={styles.equipmentDescription}>{item.description}</Text>
              
              <View style={styles.equipmentFooter}>
                <View style={styles.priceContainer}>
                  <Text style={styles.pricePrefix}>À partir de</Text>
                  <Text style={styles.equipmentPrice}>{formatPrice(item.price)} XOF/jour</Text>
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.bookButton,
                    item.availability !== 'available' && styles.disabledButton
                  ]}
                  onPress={() => handleBookEquipment(item)}
                  disabled={item.availability !== 'available'}
                >
                  <Text style={styles.bookButtonText}>
                    {item.availability === 'available' ? 'Réserver' : 'Indisponible'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>📞 +221 71 018 89 89</Text>
        <Text style={styles.footerText}>📧 contact@kamsenlogistic.com</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 18,
    color: '#64748b',
  },
  header: {
    backgroundColor: '#f97316',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedCategory: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  categoryText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  equipmentList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  equipmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  equipmentImagePlaceholder: {
    height: 120,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  equipmentImageText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  equipmentCategory: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '600',
    marginBottom: 6,
  },
  equipmentDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  equipmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  pricePrefix: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  equipmentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  bookButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
});