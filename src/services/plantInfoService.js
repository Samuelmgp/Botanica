class PlantInfoService {
  constructor() {
    this.plantDatabase = {
      // Vegetables
      'tomato': {
        commonNames: ['tomato', 'tomatoes', 'cherry tomato', 'beefsteak tomato'],
        scientificName: 'Solanum lycopersicum',
        category: 'Vegetable',
        lifecycle: 'annual',
        sunRequirement: 'full-sun',
        wateringFrequency: 2, // days
        feedingFrequency: 14,
        soilType: 'well-draining',
        matureSize: 'medium',
        bloomingSeason: 'summer',
        plantType: 'outdoor', // can be container too
        facts: [
          'Tomatoes are technically fruits, not vegetables',
          'They need 6-8 hours of direct sunlight daily',
          'Rich in lycopene, vitamin C, and potassium',
          'Best grown in warm weather (65-85°F)',
          'Support with stakes or cages as they grow'
        ],
        careNotes: 'Water consistently to prevent blossom end rot. Pinch suckers for better fruit production.'
      },
      'pepper': {
        commonNames: ['pepper', 'bell pepper', 'hot pepper', 'chili pepper', 'jalapeño', 'habanero'],
        scientificName: 'Capsicum annuum',
        category: 'Vegetable',
        lifecycle: 'annual',
        sunRequirement: 'full-sun',
        wateringFrequency: 3,
        feedingFrequency: 14,
        soilType: 'well-draining',
        matureSize: 'medium',
        bloomingSeason: 'summer',
        plantType: 'outdoor',
        facts: [
          'Peppers are rich in vitamin C and antioxidants',
          'Hot peppers get their heat from capsaicin',
          'They prefer warm soil and air temperatures',
          'Can be grown in containers successfully',
          'Harvest regularly to encourage more production'
        ],
        careNotes: 'Avoid overwatering. Mulch around plants to retain moisture and prevent weeds.'
      },
      'lettuce': {
        commonNames: ['lettuce', 'romaine', 'iceberg', 'butter lettuce', 'arugula'],
        scientificName: 'Lactuca sativa',
        category: 'Vegetable',
        lifecycle: 'annual',
        sunRequirement: 'partial',
        wateringFrequency: 1, // needs frequent watering
        feedingFrequency: 10,
        soilType: 'well-draining',
        matureSize: 'small',
        bloomingSeason: 'spring',
        plantType: 'outdoor',
        facts: [
          'Cool-season crop that bolts in hot weather',
          'Can be succession planted every 2-3 weeks',
          'Shallow roots require consistent moisture',
          'Harvest outer leaves for continuous production',
          'Rich in vitamins A and K'
        ],
        careNotes: 'Keep soil consistently moist. Provide afternoon shade in hot climates.'
      },
      
      // Herbs
      'basil': {
        commonNames: ['basil', 'sweet basil', 'thai basil', 'holy basil'],
        scientificName: 'Ocimum basilicum',
        category: 'Herb',
        lifecycle: 'annual',
        sunRequirement: 'full-sun',
        wateringFrequency: 2,
        feedingFrequency: 21,
        soilType: 'well-draining',
        matureSize: 'small',
        bloomingSeason: 'summer',
        plantType: 'outdoor',
        facts: [
          'Pinch flowers to keep leaves tender and flavorful',
          'Contains antioxidants and essential oils',
          'Repels mosquitoes and flies naturally',
          'Can be grown year-round indoors',
          'Harvest regularly to promote bushy growth'
        ],
        careNotes: 'Pinch flower buds to encourage leaf growth. Sensitive to cold temperatures.'
      },
      'mint': {
        commonNames: ['mint', 'peppermint', 'spearmint', 'chocolate mint'],
        scientificName: 'Mentha',
        category: 'Herb',
        lifecycle: 'perennial',
        sunRequirement: 'partial',
        wateringFrequency: 2,
        feedingFrequency: 28,
        soilType: 'well-draining',
        matureSize: 'small',
        bloomingSeason: 'summer',
        plantType: 'outdoor',
        facts: [
          'Spreads aggressively through underground runners',
          'Natural pest deterrent for ants and mice',
          'Can be grown in containers to control spread',
          'Leaves are most flavorful before flowering',
          'Hardy perennial in most climates'
        ],
        careNotes: 'Contain in pots to prevent spreading. Cut back after flowering.'
      },
      'rosemary': {
        commonNames: ['rosemary'],
        scientificName: 'Rosmarinus officinalis',
        category: 'Herb',
        lifecycle: 'perennial',
        sunRequirement: 'full-sun',
        wateringFrequency: 7, // drought tolerant
        feedingFrequency: 60,
        soilType: 'well-draining',
        matureSize: 'medium',
        bloomingSeason: 'spring',
        plantType: 'outdoor',
        facts: [
          'Drought-tolerant Mediterranean herb',
          'Contains compounds that may improve memory',
          'Woody stems can be used as skewers for grilling',
          'Attracts bees and beneficial insects',
          'Can live for many years with proper care'
        ],
        careNotes: 'Avoid overwatering. Prune regularly to maintain shape and prevent woodiness.'
      },
      
      // Succulents
      'aloe': {
        commonNames: ['aloe', 'aloe vera', 'burn plant'],
        scientificName: 'Aloe vera',
        category: 'Succulent',
        lifecycle: 'perennial',
        sunRequirement: 'full-sun',
        wateringFrequency: 14, // very drought tolerant
        feedingFrequency: 90,
        soilType: 'sandy',
        matureSize: 'small',
        bloomingSeason: 'summer',
        plantType: 'indoor',
        facts: [
          'Gel inside leaves has healing properties for burns',
          'Can survive long periods without water',
          'Produces oxygen at night, unlike most plants',
          'Propagates easily through pups (offshoots)',
          'NASA lists it as an air-purifying plant'
        ],
        careNotes: 'Allow soil to dry completely between waterings. Provide bright, indirect light indoors.'
      },
      'jade': {
        commonNames: ['jade plant', 'money tree', 'lucky plant'],
        scientificName: 'Crassula ovata',
        category: 'Succulent',
        lifecycle: 'perennial',
        sunRequirement: 'full-sun',
        wateringFrequency: 10,
        feedingFrequency: 60,
        soilType: 'sandy',
        matureSize: 'small',
        bloomingSeason: 'winter',
        plantType: 'indoor',
        facts: [
          'Symbol of good luck and prosperity in feng shui',
          'Can live for decades with proper care',
          'Thick leaves store water for drought survival',
          'Easy to propagate from leaf or stem cuttings',
          'May bloom with small white or pink flowers'
        ],
        careNotes: 'Water when soil is dry. Rotate plant for even growth towards light.'
      },
      
      // Flowers
      'marigold': {
        commonNames: ['marigold', 'french marigold', 'african marigold'],
        scientificName: 'Tagetes',
        category: 'Flower',
        lifecycle: 'annual',
        sunRequirement: 'full-sun',
        wateringFrequency: 3,
        feedingFrequency: 21,
        soilType: 'well-draining',
        matureSize: 'small',
        bloomingSeason: 'summer',
        plantType: 'outdoor',
        facts: [
          'Natural pest deterrent for nematodes and aphids',
          'Deadhead spent blooms for continuous flowering',
          'Edible flowers with a slightly citrus flavor',
          'Attracts beneficial insects like ladybugs',
          'Easy to grow from seed'
        ],
        careNotes: 'Deadhead regularly. Can tolerate poor soil conditions.'
      },
      'sunflower': {
        commonNames: ['sunflower', 'giant sunflower', 'dwarf sunflower'],
        scientificName: 'Helianthus annuus',
        category: 'Flower',
        lifecycle: 'annual',
        sunRequirement: 'full-sun',
        wateringFrequency: 3,
        feedingFrequency: 14,
        soilType: 'well-draining',
        matureSize: 'large',
        bloomingSeason: 'summer',
        plantType: 'outdoor',
        facts: [
          'Flowers follow the sun throughout the day (heliotropism)',
          'Seeds are rich in healthy fats and protein',
          'Can grow up to 12 feet tall in ideal conditions',
          'Attracts birds, bees, and butterflies',
          'Deep taproot helps improve soil structure'
        ],
        careNotes: 'Provide support for tall varieties. Water deeply but infrequently once established.'
      },
      
      // Houseplants
      'pothos': {
        commonNames: ['pothos', 'devil\'s ivy', 'golden pothos'],
        scientificName: 'Epipremnum aureum',
        category: 'Houseplant',
        lifecycle: 'perennial',
        sunRequirement: 'partial',
        wateringFrequency: 7,
        feedingFrequency: 30,
        soilType: 'well-draining',
        matureSize: 'medium',
        bloomingSeason: '',
        plantType: 'indoor',
        facts: [
          'Nearly impossible to kill - perfect for beginners',
          'Can grow in water or soil',
          'Removes formaldehyde and benzene from air',
          'Trailing vines can grow several feet long',
          'Propagates easily in water from cuttings'
        ],
        careNotes: 'Allow soil to dry between waterings. Trim long vines to encourage bushy growth.'
      },
      'snake plant': {
        commonNames: ['snake plant', 'mother-in-law\'s tongue', 'sansevieria'],
        scientificName: 'Sansevieria trifasciata',
        category: 'Houseplant',
        lifecycle: 'perennial',
        sunRequirement: 'partial',
        wateringFrequency: 14,
        feedingFrequency: 60,
        soilType: 'sandy',
        matureSize: 'medium',
        bloomingSeason: '',
        plantType: 'indoor',
        facts: [
          'Produces oxygen at night, improving sleep quality',
          'Extremely drought tolerant and low maintenance',
          'Can survive in very low light conditions',
          'Propagates through division or leaf cuttings',
          'One of NASA\'s top air-purifying plants'
        ],
        careNotes: 'Water sparingly - overwatering is the main cause of death. Tolerates neglect well.'
      },
      'fiddle leaf fig': {
        commonNames: ['fiddle leaf fig', 'ficus lyrata'],
        scientificName: 'Ficus lyrata',
        category: 'Houseplant',
        lifecycle: 'perennial',
        sunRequirement: 'partial',
        wateringFrequency: 7,
        feedingFrequency: 30,
        soilType: 'well-draining',
        matureSize: 'large',
        bloomingSeason: '',
        plantType: 'indoor',
        facts: [
          'Large, violin-shaped leaves make it a statement plant',
          'Can grow up to 6 feet tall indoors',
          'Sensitive to changes in environment and watering',
          'Prefers consistent care and bright, indirect light',
          'Originally from western Africa'
        ],
        careNotes: 'Keep soil consistently moist but not soggy. Rotate weekly for even growth.'
      }
    };
  }

  searchPlant(plantType) {
    const searchTerm = plantType.toLowerCase().trim();
    
    // Direct match
    if (this.plantDatabase[searchTerm]) {
      return this.plantDatabase[searchTerm];
    }
    
    // Search through common names
    for (const [key, plant] of Object.entries(this.plantDatabase)) {
      if (plant.commonNames.some(name => 
        name.toLowerCase().includes(searchTerm) || 
        searchTerm.includes(name.toLowerCase())
      )) {
        return plant;
      }
    }
    
    // Fuzzy matching for partial matches
    for (const [key, plant] of Object.entries(this.plantDatabase)) {
      if (key.includes(searchTerm) || searchTerm.includes(key)) {
        return plant;
      }
    }
    
    return null; // No match found
  }

  getPlantInfo(plantType, location = 'outdoor') {
    const plantInfo = this.searchPlant(plantType);
    
    if (plantInfo) {
      // Adjust plant type based on user's location preference
      let adjustedPlantType = plantInfo.plantType;
      if (location.toLowerCase() === 'indoor' && plantInfo.plantType === 'outdoor') {
        // Many outdoor plants can be grown in containers indoors
        adjustedPlantType = 'container';
      }
      
      return {
        ...plantInfo,
        plantType: adjustedPlantType,
        found: true
      };
    }
    
    // Return defaults for unknown plants
    return this.getDefaultPlantInfo(location);
  }

  getDefaultPlantInfo(location = 'outdoor') {
    const isIndoor = location.toLowerCase() === 'indoor';
    
    return {
      commonNames: ['unknown plant'],
      scientificName: 'Unknown species',
      category: 'Unknown',
      lifecycle: 'perennial',
      sunRequirement: isIndoor ? 'partial' : 'full-sun',
      wateringFrequency: isIndoor ? 7 : 3,
      feedingFrequency: 30,
      soilType: 'well-draining',
      matureSize: 'medium',
      bloomingSeason: '',
      plantType: isIndoor ? 'indoor' : 'outdoor',
      facts: [
        'This appears to be a plant we don\'t have information about yet',
        'Monitor your plant\'s response to care and adjust as needed',
        'Consider researching your specific plant variety online',
        'Start with moderate watering and bright, indirect light',
        'Most plants prefer well-draining soil and consistent care'
      ],
      careNotes: 'Since we don\'t have specific information about this plant, start with general care practices and observe how your plant responds.',
      found: false
    };
  }

  getAllPlantTypes() {
    const allTypes = [];
    
    for (const [key, plant] of Object.entries(this.plantDatabase)) {
      allTypes.push({
        value: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        category: plant.category,
        commonNames: plant.commonNames
      });
    }
    
    return allTypes.sort((a, b) => a.label.localeCompare(b.label));
  }

  getPlantSuggestions(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const suggestions = [];
    const search = searchTerm.toLowerCase();
    
    for (const [key, plant] of Object.entries(this.plantDatabase)) {
      // Check key match
      if (key.toLowerCase().includes(search)) {
        suggestions.push({
          value: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          category: plant.category
        });
      }
      
      // Check common names
      plant.commonNames.forEach(name => {
        if (name.toLowerCase().includes(search) && 
            !suggestions.find(s => s.value === key)) {
          suggestions.push({
            value: key,
            label: name.charAt(0).toUpperCase() + name.slice(1),
            category: plant.category
          });
        }
      });
    }
    
    return suggestions.slice(0, 8); // Limit to 8 suggestions
  }
}

export default new PlantInfoService();