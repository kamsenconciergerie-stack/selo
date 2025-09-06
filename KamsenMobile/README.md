# Kamsen Mobile - Application React Native

Application mobile native pour la plateforme de location d'équipement Kamsen au Sénégal.

## 🚀 Fonctionnalités

- **Catalogue d'équipements** : Parcourir tous les équipements disponibles
- **Recherche et filtres** : Trouver rapidement l'équipement souhaité
- **Réservation mobile** : Réserver directement depuis l'application
- **Interface optimisée** : Design adapté aux utilisateurs sénégalais
- **Hors ligne** : Fonctionnement partiellement hors ligne

## 📱 Déploiement

### Option 1: Test en développement
```bash
# Installer les dépendances
npm install

# Démarrer l'application
npm run start

# Scanner le QR code avec Expo Go
```

### Option 2: Build pour Google Play Store
```bash
# Build Android
npx expo build:android

# Ou utiliser EAS Build (recommandé)
npm install -g @expo/cli
npx expo install --fix
npx eas build --platform android
```

### Option 3: APK de test
```bash
# Générer un APK
npx expo export:embed
npx expo run:android --variant release
```

## 🔧 Configuration

### Variables d'environnement
L'API URL est configurée dans `app.json` :
```json
"extra": {
  "apiUrl": "https://kamsenlogistic.com/api"
}
```

### Permissions Android
- `INTERNET` : Connexion API
- `ACCESS_NETWORK_STATE` : État réseau
- `ACCESS_FINE_LOCATION` : Géolocalisation
- `ACCESS_COARSE_LOCATION` : Position approximative

## 📦 Package Info

- **Package** : `com.ytech.kamsen`
- **Version** : `1.0.0`
- **Nom** : `Kamsen - Location d'Équipement`

## 🎨 Design

- **Couleurs principales** : Orange (#f97316) et gris
- **Police** : System default
- **Icons** : Expo Vector Icons
- **Layout** : Mobile-first responsive

## 🔄 API Integration

L'application se connecte à l'API Kamsen :
- `GET /api/equipment` - Liste des équipements
- `POST /api/bookings` - Créer une réservation
- `GET /api/categories` - Catégories disponibles

## 📋 Prochaines étapes

1. **Intégration API complète** : Connecter à l'API de production
2. **Authentification** : Système de login utilisateur
3. **Push notifications** : Notifications de réservation
4. **Paiement mobile** : Orange Money / Wave
5. **Géolocalisation** : Localiser équipements proches
6. **Mode hors ligne** : Cache local des données

## 🏪 Publication Google Play Store

1. Créer un compte développeur Google Play (25$ une fois)
2. Générer le bundle avec `npx eas build --platform android`
3. Télécharger et publier sur Google Play Console
4. Remplir les métadonnées (description, screenshots, etc.)
5. Soumettre pour review

## 📞 Support

- **Email** : contact@kamsenlogistic.com  
- **Téléphone** : +221 78 606 70 13
- **Site web** : https://kamsenlogistic.com

---
*Un produit de YTech - Développé pour le marché sénégalais*