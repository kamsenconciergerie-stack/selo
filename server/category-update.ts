import { db } from '../shared/db';
import { equipment } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Mapping des équipements vers les nouvelles catégories (basé sur les vrais noms PostgreSQL)
const categoryMapping = {
  // Camions et Transport
  "Camions et Transport": [
    "🚛 Camion Porteur Iveco Daily",
    "🚚 Tracteur Scania R450 + Remorque",
    "🛻 Fourgon Renault Master", 
    "🛻 Mercedes Sprinter 316",
    "🏗️ Camion Benne Renault Kerax",
    "🏗️ Camion Benne MAN TGS",
    "Camion-Citerne 10 000L",
    "Camion Grue 25 Tonnes"
  ],

  // BTP et Construction
  "BTP et Construction": [
    "Pelleteuse 20 Tonnes",
    "Chargeuse sur Pneus",
    "Bétonnière 350L Professionnelle",
    "Foreuse à Eau Mobile",
    "🏗️ Échafaudage Mobile Aluminium",
    "Échafaudage Mobile Aluminium",
    "🔨 Marteau-Piqueur Électrique"
  ],

  // Électricité et Énergie
  "Électricité et Énergie": [
    "Groupe Électrogène 100 KVA",
    "⚡ Groupe Électrogène Silencieux 20KVA",
    "Groupe Électrogène Solaire 50 KVA",
    "Compresseur 500L",
    "Compresseur d'Air 500L",
    "💨 Compresseur d'Air Mobile 500L"
  ],

  // Manutention
  "Manutention": [
    "🔧 Perceuse à Colonne Professionnelle"
  ],

  // Pompage et Irrigation
  "Pompage et Irrigation": [
    "Motopompe Haute Pression",
    "🌊 Motopompe Eau Claire 6 Pouces",
    "Station de Lavage Mobile"
  ],

  // Équipement Agricole
  "Équipement Agricole": [
    "Tracteur Agricole 85 CV"
  ],

  // Équipement Spécialisé
  "Équipement Spécialisé": [
    "Système de Sonorisation 5000W"
  ],

  // Excavation (pour équipements futurs)
  "Excavation": [],

  // Levage et Grutage (pour équipements futurs)
  "Levage et Grutage": [],

  // Compactage (pour équipements futurs)
  "Compactage": [],

  // Nettoyage et Entretien (pour équipements futurs)
  "Nettoyage et Entretien": []
};

export async function updateEquipmentCategories() {
  console.log('🔄 Mise à jour des catégories d\'équipements...');
  
  try {
    // Get all equipment
    const allEquipment = await db.select().from(equipment);
    console.log(`📋 ${allEquipment.length} équipements trouvés`);

    let updatedCount = 0;
    
    for (const [newCategory, equipmentNames] of Object.entries(categoryMapping)) {
      console.log(`\n📂 Traitement catégorie: ${newCategory}`);
      
      for (const equipmentName of equipmentNames) {
        // Find equipment by name
        const equipmentItem = allEquipment.find(eq => eq.name === equipmentName);
        
        if (equipmentItem) {
          // Update category
          await db
            .update(equipment)
            .set({ category: newCategory })
            .where(eq(equipment.id, equipmentItem.id));
          
          console.log(`  ✅ ${equipmentName} → ${newCategory}`);
          updatedCount++;
        } else {
          console.log(`  ⚠️ ${equipmentName} introuvable`);
        }
      }
    }

    console.log(`\n✨ Mise à jour terminée: ${updatedCount} équipements mis à jour`);
    
    // Afficher le résumé par catégorie
    console.log('\n📊 Résumé par catégorie:');
    const updatedEquipment = await db.select().from(equipment);
    
    const categorySummary = updatedEquipment.reduce((acc, eq) => {
      acc[eq.category] = (acc[eq.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(categorySummary)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count} équipement${count > 1 ? 's' : ''}`);
      });

    return { success: true, updated: updatedCount };
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    return { success: false, error };
  }
}

// Fonction pour vérifier le mapping
export async function verifyCategoryMapping() {
  const allEquipment = await db.select().from(equipment);
  const allNames = allEquipment.map(eq => eq.name);
  
  console.log('\n🔍 Vérification du mapping...');
  
  // Équipements mappés
  const mappedEquipment: string[] = [];
  Object.values(categoryMapping).forEach(names => {
    mappedEquipment.push(...names);
  });
  
  // Équipements non mappés
  const unmappedEquipment = allNames.filter(name => !mappedEquipment.includes(name));
  
  if (unmappedEquipment.length > 0) {
    console.log('\n⚠️ Équipements non mappés:');
    unmappedEquipment.forEach(name => console.log(`  - ${name}`));
  } else {
    console.log('✅ Tous les équipements sont mappés');
  }
  
  // Équipements mappés mais introuvables
  const nonExistentEquipment = mappedEquipment.filter(name => !allNames.includes(name));
  
  if (nonExistentEquipment.length > 0) {
    console.log('\n⚠️ Équipements mappés mais introuvables:');
    nonExistentEquipment.forEach(name => console.log(`  - ${name}`));
  }
}

// Auto-execute when run directly
async function main() {
  await verifyCategoryMapping();
  await updateEquipmentCategories();
}

main().catch(console.error);