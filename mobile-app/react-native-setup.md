# Guide de développement - Application Mobile Aywa

## Étapes pour créer l'application React Native

### 1. Installation de l'environnement de développement

#### Prérequis système
```bash
# Node.js 18+
node --version

# Installation React Native CLI
npm install -g react-native-cli

# Pour Android
# - Android Studio
# - Java 11 JDK
# - Android SDK

# Pour iOS (Mac seulement)
# - Xcode 14+
# - CocoaPods
```

### 2. Création du projet

```bash
# Créer le projet React Native
npx react-native init AywaApp --template react-native-template-typescript

cd AywaApp

# Installation des dépendances essentielles
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @tanstack/react-query
npm install react-native-vector-icons
npm install react-native-maps
npm install @react-native-async-storage/async-storage
npm install react-native-paper
npm install axios
npm install react-hook-form
npm install @hookform/resolvers
npm install zod

# Pour iOS
cd ios && pod install && cd ..
```

### 3. Structure de l'application

```typescript
// src/types/index.ts
export interface Equipment {
  id: number;
  name: string;
  description: string;
  category: string;
  pricePerDay: number;
  location: string;
  imageUrl: string;
  specifications: string[];
  isAvailable: boolean;
  weight?: string;
  fuelType?: string;
  power?: string;
}

export interface Booking {
  id: number;
  equipmentId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  notes?: string;
}
```

```typescript
// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://votre-domaine-aywa.replit.app/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const equipmentApi = {
  getAll: () => apiClient.get<Equipment[]>('/equipment'),
  getById: (id: number) => apiClient.get<Equipment>(`/equipment/${id}`),
  search: (query: string, location?: string) => 
    apiClient.get<Equipment[]>('/equipment', { 
      params: { query, location } 
    }),
};

export const bookingApi = {
  create: (booking: Omit<Booking, 'id' | 'status'>) => 
    apiClient.post<Booking>('/bookings', booking),
};
```

### 4. Composants principaux

```typescript
// src/components/EquipmentCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Equipment } from '../types';

interface EquipmentCardProps {
  equipment: Equipment;
  onPress: () => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ 
  equipment, 
  onPress 
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={{ margin: 8, elevation: 3 }}>
        <Image 
          source={{ uri: equipment.imageUrl }} 
          style={{ height: 200, width: '100%' }}
          resizeMode="cover"
        />
        <Card.Content>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' }}>
            {equipment.name}
          </Text>
          <Text style={{ color: '#6b7280', marginVertical: 4 }}>
            {equipment.location}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#ea580c' }}>
            {equipment.pricePerDay.toLocaleString()} XOF/jour
          </Text>
          <View style={{ 
            backgroundColor: equipment.isAvailable ? '#10b981' : '#ef4444',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            alignSelf: 'flex-start',
            marginTop: 8
          }}>
            <Text style={{ color: 'white', fontSize: 12 }}>
              {equipment.isAvailable ? 'Disponible' : 'Loué'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};
```

### 5. Écrans principaux

```typescript
// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const categories = [
    'Engins de Chantier',
    'Équipement Électrique',
    'Outils à Main',
    'Sécurité & EPI'
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView>
        {/* Header */}
        <View style={{ padding: 16, backgroundColor: 'white' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1e3a8a' }}>
            AYWA
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            Puissance et confiance sur la route
          </Text>
          <Text style={{ fontSize: 16, marginTop: 8 }}>
            Bonjour ! Que recherchez-vous aujourd'hui ?
          </Text>
        </View>

        {/* Catégories */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
            Nos catégories
          </Text>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={{
                backgroundColor: 'white',
                padding: 16,
                marginBottom: 8,
                borderRadius: 8,
                elevation: 2
              }}
              onPress={() => navigation.navigate('Catalog', { category })}
            >
              <Text style={{ fontSize: 16 }}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions rapides */}
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ea580c',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center'
            }}
            onPress={() => navigation.navigate('Catalog')}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Voir tous les équipements
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
```

### 6. Navigation

```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { HomeScreen } from '../screens/HomeScreen';
import { CatalogScreen } from '../screens/CatalogScreen';
import { EquipmentDetailScreen } from '../screens/EquipmentDetailScreen';
import { BookingsScreen } from '../screens/BookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Catalog':
            iconName = 'search';
            break;
          case 'Bookings':
            iconName = 'bookmark';
            break;
          case 'Profile':
            iconName = 'person';
            break;
          default:
            iconName = 'home';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#ea580c',
      tabBarInactiveTintColor: '#6b7280',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
    <Tab.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Catalogue' }} />
    <Tab.Screen name="Bookings" component={BookingsScreen} options={{ title: 'Mes réservations' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={TabNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="EquipmentDetail" 
        component={EquipmentDetailScreen}
        options={{ title: 'Détail équipement' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
```

### 7. Configuration des couleurs

```typescript
// src/theme/colors.ts
export const colors = {
  primary: {
    blue: '#1e3a8a',
    orange: '#ea580c',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    600: '#6b7280',
  },
  white: '#ffffff',
  green: '#10b981',
  red: '#ef4444',
};
```

### 8. Prochaines étapes

1. **Authentification** - Ajouter login/register
2. **Réservations** - Implémenter le processus de booking
3. **Paiements** - Intégrer Orange Money/Wave
4. **Notifications** - Firebase Cloud Messaging
5. **Géolocalisation** - Maps et navigation
6. **Tests** - Jest et Detox
7. **Déploiement** - Build et publication stores

Cette structure vous donne une base solide pour développer l'application mobile Aywa. Le code utilise les mêmes types et API que votre application web existante pour assurer la cohérence.