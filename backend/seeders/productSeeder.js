const mongoose = require('mongoose');
const Product = require('../models/Product');

// Sample products data based on your ShopPage.jsx and Homepage shop section
const productsData = [
  {
    nameEn: "1 Mukhi Rudraksha",
    nameHi: "एक मुखी रुद्राक्ष",
    descriptionEn: "Original 1 Mukhi Rudraksha for Lord Shiva blessings, spiritual growth, and peace of mind. Certified authentic with natural surface.",
    descriptionHi: "भगवान शिव की कृपा और आध्यात्मिक विकास के लिए प्रामाणिक एक मुखी रुद्राक्ष। प्रमाणित और प्राकृतिक।",
    price: 12000,
    originalPrice: 15000,
    category: "rudraksha",
    icon: "🔮",
    isFeatured: true,
    inStock: true,
    stockQuantity: 5,
    rating: 4.8,
    reviewCount: 156,
    salesCount: 89,
    spiritualBenefits: ["Peace of mind", "Spiritual growth", "Lord Shiva's blessings", "Meditation enhancement"],
    rulingPlanet: "Sun",
    chakra: "Crown Chakra",
    specifications: {
      material: "Natural Rudraksha",
      size: "18-22mm",
      origin: "Nepal",
      certification: "Authentic Certificate",
      weight: "2-3 grams"
    },
    usageInstructions: {
      en: "Wear on Monday after offering prayers to Lord Shiva. Can be worn as pendant or kept during meditation.",
      hi: "सोमवार को भगवान शिव की पूजा के बाद धारण करें। लॉकेट के रूप में पहनें या ध्यान के दौरान रखें।"
    },
    tags: ["rudraksha", "1-mukhi", "shiva", "meditation", "spiritual"],
    sortOrder: 1
  },
  {
    nameEn: "5 Mukhi Rudraksha",
    nameHi: "पांच मुखी रुद्राक्ष",
    descriptionEn: "Powerful 5 Mukhi Rudraksha for health, wealth, and overall well-being. Most popular and effective Rudraksha bead.",
    descriptionHi: "स्वास्थ्य, धन और समृद्धि के लिए अत्यंत प्रभावशाली पांच मुखी रुद्राक्ष। सबसे लोकप्रिय रुद्राक्ष।",
    price: 500,
    originalPrice: 800,
    category: "rudraksha",
    icon: "🌿",
    isFeatured: true,
    inStock: true,
    stockQuantity: 50,
    rating: 4.9,
    reviewCount: 892,
    salesCount: 567,
    spiritualBenefits: ["Health improvement", "Wealth attraction", "Mental peace", "Overall well-being"],
    rulingPlanet: "Jupiter",
    chakra: "Throat Chakra",
    specifications: {
      material: "Natural Rudraksha",
      size: "12-18mm",
      origin: "Nepal",
      certification: "Lab Certified",
      weight: "1-2 grams"
    },
    usageInstructions: {
      en: "Can be worn daily. Best worn as mala or single bead pendant. Very beneficial for students and professionals.",
      hi: "रोज पहन सकते हैं। माला या एकल लॉकेट के रूप में श्रेष्ठ। छात्रों और व्यापारियों के लिए अत्यंत लाभकारी।"
    },
    tags: ["rudraksha", "5-mukhi", "health", "wealth", "popular"],
    sortOrder: 2
  },
  {
    nameEn: "Blue Sapphire (Neelam)",
    nameHi: "नीलम रत्न",
    descriptionEn: "Original Blue Sapphire gemstone for Saturn planet. Helps with career, business success, and removes obstacles from life path.",
    descriptionHi: "शनि ग्रह के लिए प्रामाणिक नीलम रत्न। करियर, व्यापार की सफलता और जीवन की बाधाओं के निवारण के लिए।",
    price: 8500,
    originalPrice: 12000,
    category: "gemstone",
    icon: "💎",
    isFeatured: true,
    inStock: true,
    stockQuantity: 8,
    rating: 4.7,
    reviewCount: 234,
    salesCount: 145,
    spiritualBenefits: ["Career advancement", "Business success", "Obstacle removal", "Saturn planet benefits"],
    rulingPlanet: "Saturn",
    chakra: "Third Eye Chakra",
    specifications: {
      material: "Natural Blue Sapphire",
      weight: "3-7 carats",
      origin: "Kashmir/Ceylon",
      certification: "Gemological Certificate",
      purity: "Natural untreated"
    },
    usageInstructions: {
      en: "Consult astrologer before wearing. Usually worn on middle finger of right hand on Saturday.",
      hi: "पहनने से पहले ज्योतिषी की सलाह लें। सामान्यतः शनिवार को दाएं हाथ की मध्यमा अंगुली में पहनते हैं।"
    },
    careInstructions: {
      en: "Clean with soft brush and mild soap. Store separately to avoid scratches.",
      hi: "मुलायम ब्रश और हल्के साबुन से साफ करें। खरोंच से बचने के लिए अलग रखें।"
    },
    tags: ["gemstone", "neelam", "sapphire", "saturn", "career"],
    sortOrder: 3
  },
  {
    nameEn: "Yellow Sapphire (Pukhraj)",
    nameHi: "पुखराज रत्न",
    descriptionEn: "Natural Yellow Sapphire for Jupiter planet. Brings wisdom, wealth, prosperity, and good fortune in life and marriage.",
    descriptionHi: "बृहस्पति ग्रह के लिए प्राकृतिक पुखराज। बुद्धि, धन, समृद्धि और जीवन में सौभाग्य प्रदान करता है।",
    price: 6500,
    originalPrice: 9000,
    category: "gemstone",
    icon: "💛",
    isFeatured: true,
    inStock: true,
    stockQuantity: 12,
    rating: 4.6,
    reviewCount: 178,
    salesCount: 98,
    spiritualBenefits: ["Wisdom enhancement", "Wealth attraction", "Marriage prospects", "Jupiter's blessings"],
    rulingPlanet: "Jupiter",
    chakra: "Solar Plexus Chakra",
    specifications: {
      material: "Natural Yellow Sapphire",
      weight: "3-6 carats",
      origin: "Ceylon/Bangkok",
      certification: "Certified Authentic",
      purity: "Eye clean natural"
    },
    usageInstructions: {
      en: "Wear on Thursday morning after prayers. Best worn on index finger of right hand.",
      hi: "गुरुवार सुबह पूजा के बाद धारण करें। दाएं हाथ की तर्जनी अंगुली में पहनना श्रेष्ठ।"
    },
    tags: ["gemstone", "pukhraj", "jupiter", "wisdom", "prosperity"],
    sortOrder: 4
  },
  {
    nameEn: "Ruby (Manik)",
    nameHi: "माणिक्य रत्न",
    descriptionEn: "Genuine Ruby gemstone for Sun planet. Enhances leadership qualities, confidence, and removes health issues related to heart.",
    descriptionHi: "सूर्य ग्रह के लिए प्रामाणिक माणिक्य रत्न। नेतृत्व क्षमता, आत्मविश्वास बढ़ाता है और हृदय संबंधी स्वास्थ्य लाभ देता है।",
    price: 7800,
    originalPrice: 11000,
    category: "gemstone",
    icon: "♦️",
    inStock: false,
    stockQuantity: 0,
    rating: 4.8,
    reviewCount: 145,
    salesCount: 76,
    spiritualBenefits: ["Leadership enhancement", "Confidence boost", "Heart health", "Sun planet benefits"],
    rulingPlanet: "Sun",
    chakra: "Heart Chakra",
    specifications: {
      material: "Natural Ruby",
      weight: "2-5 carats",
      origin: "Myanmar/Thailand",
      certification: "Gemological Report",
      purity: "Natural pigeon blood"
    },
    usageInstructions: {
      en: "Wear on Sunday morning. Usually worn on ring finger of right hand after proper energization.",
      hi: "रविवार सुबह धारण करें। उचित प्राण प्रतिष्ठा के बाद दाएं हाथ की अनामिका में पहनें।"
    },
    tags: ["gemstone", "ruby", "manik", "sun", "leadership"],
    sortOrder: 5
  },
  {
    nameEn: "Gomed (Hessonite)",
    nameHi: "गोमेद रत्न",
    descriptionEn: "Natural Hessonite garnet for Rahu planet. Protects from negative energies, black magic, and brings success in competitive fields.",
    descriptionHi: "राहु ग्रह के लिए प्राकृतिक गोमेद रत्न। नकारात्मक ऊर्जा और काला जादू से सुरक्षा, प्रतियोगिता में सफलता दिलाता है।",
    price: 3200,
    originalPrice: 4500,
    category: "gemstone",
    icon: "🟤",
    inStock: true,
    stockQuantity: 15,
    rating: 4.5,
    reviewCount: 267,
    salesCount: 189,
    spiritualBenefits: ["Protection from negativity", "Rahu planet pacification", "Success in competition", "Spiritual protection"],
    rulingPlanet: "Rahu",
    chakra: "Root Chakra",
    specifications: {
      material: "Natural Hessonite Garnet",
      weight: "4-8 carats",
      origin: "Ceylon/India",
      certification: "Authenticated",
      purity: "Natural honey colored"
    },
    usageInstructions: {
      en: "Wear on Saturday. Usually worn on middle finger after consulting with astrologer for Rahu position.",
      hi: "शनिवार को धारण करें। राहु की स्थिति के लिए ज्योतिषी से सलाह लेकर मध्यमा अंगुली में पहनें।"
    },
    tags: ["gemstone", "gomed", "rahu", "protection", "hessonite"],
    sortOrder: 6
  },
  {
    nameEn: "Sphatik Mala",
    nameHi: "स्फटिक माला",
    descriptionEn: "Pure Crystal (Sphatik) prayer beads mala for meditation, concentration, and spiritual practices. 108 beads with guru bead.",
    descriptionHi: "ध्यान, एकाग्रता और आध्यात्मिक साधना के लिए शुद्ध स्फटिक की माला। 108 मोती गुरु मोती के साथ।",
    price: 800,
    originalPrice: 1200,
    category: "mala",
    icon: "📿",
    isFeatured: true,
    inStock: true,
    stockQuantity: 25,
    rating: 4.7,
    reviewCount: 342,
    salesCount: 234,
    spiritualBenefits: ["Enhanced meditation", "Mental clarity", "Spiritual growth", "Divine connection"],
    rulingPlanet: "Moon",
    chakra: "Crown Chakra",
    specifications: {
      material: "Pure Crystal (Sphatik)",
      beadCount: "108 + 1 Guru bead",
      size: "6-8mm beads",
      origin: "India",
      weight: "50-70 grams"
    },
    usageInstructions: {
      en: "Hold during meditation and chanting. Can be worn or kept at meditation place. Clean with pure water regularly.",
      hi: "ध्यान और जप के समय धारण करें। पहन सकते हैं या पूजा स्थान पर रख सकते हैं। शुद्ध पानी से नियमित सफाई करें।"
    },
    tags: ["mala", "sphatik", "crystal", "meditation", "108-beads"],
    sortOrder: 7
  },
  {
    nameEn: "Shree Yantra",
    nameHi: "श्री यंत्र",
    descriptionEn: "Sacred geometric yantra for wealth, prosperity, and spiritual growth. Handcrafted with precise measurements according to ancient texts.",
    descriptionHi: "धन, समृद्धि और आध्यात्मिक उन्नति के लिए पवित्र ज्यामितीय यंत्र। प्राचीन शास्त्रों के अनुसार सटीक माप में हस्तनिर्मित।",
    price: 2500,
    originalPrice: 3500,
    category: "yantra",
    icon: "🔶",
    isFeatured: true,
    inStock: true,
    stockQuantity: 18,
    rating: 4.6,
    reviewCount: 198,
    salesCount: 123,
    spiritualBenefits: ["Wealth attraction", "Prosperity enhancement", "Spiritual progress", "Divine grace"],
    rulingPlanet: "Venus",
    chakra: "Heart Chakra",
    specifications: {
      material: "Copper/Brass",
      size: "3x3 inches",
      weight: "100-150 grams",
      finish: "Gold plated",
      craftsmanship: "Hand engraved"
    },
    usageInstructions: {
      en: "Place in northeast corner of home or office. Offer prayers daily with incense and flowers.",
      hi: "घर या ऑफिस के ईशान कोण में स्थापित करें। रोज धूप-दीप और फूल चढ़ाकर पूजा करें।"
    },
    mantra: "ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद श्रीं ह्रीं श्रीं ॐ महालक्ष्म्यै नमः",
    tags: ["yantra", "shree-yantra", "wealth", "prosperity", "sacred-geometry"],
    sortOrder: 8
  },
  {
    nameEn: "Navgraha Yantra",
    nameHi: "नवग्रह यंत्र",
    descriptionEn: "Complete set of nine planetary yantras for cosmic harmony and planetary peace. Balances all nine planets' energies in life.",
    descriptionHi: "ब्रह्मांडीय सामंजस्य और ग्रह शांति के लिए नौ ग्रहों के यंत्रों का संपूर्ण सेट। जीवन में सभी नौ ग्रहों की ऊर्जा संतुलित करता है।",
    price: 4500,
    originalPrice: 6000,
    category: "yantra",
    icon: "⭐",
    inStock: true,
    stockQuantity: 10,
    rating: 4.8,
    reviewCount: 87,
    salesCount: 56,
    spiritualBenefits: ["Planetary peace", "Cosmic harmony", "Obstacle removal", "Overall life balance"],
    rulingPlanet: "All Nine Planets",
    chakra: "All Chakras",
    specifications: {
      material: "Pure Copper",
      size: "Set of 9 yantras, 2x2 inches each",
      weight: "300-400 grams total",
      finish: "Traditional engraving",
      packaging: "Wooden box included"
    },
    usageInstructions: {
      en: "Install all nine yantras as per Vastu directions. Perform regular puja especially on respective planetary days.",
      hi: "वास्तु दिशाओं के अनुसार नौों यंत्र स्थापित करें। संबंधित ग्रह के दिन विशेष पूजा करें।"
    },
    tags: ["yantra", "navgraha", "nine-planets", "cosmic-harmony", "vastu"],
    sortOrder: 9
  },
  {
    nameEn: "Tulsi Mala",
    nameHi: "तुलसी माला",
    descriptionEn: "Sacred Tulsi wood prayer beads for Krishna devotion and spiritual purification. Removes sins and brings divine blessings.",
    descriptionHi: "भगवान कृष्ण की भक्ति और आध्यात्मिक शुद्धता के लिए पवित्र तुलसी की माला। पापों का नाश और दिव्य आशीर्वाद दिलाती है।",
    price: 600,
    originalPrice: 900,
    category: "mala",
    icon: "🌱",
    inStock: true,
    stockQuantity: 35,
    rating: 4.5,
    reviewCount: 456,
    salesCount: 289,
    spiritualBenefits: ["Krishna's blessings", "Spiritual purification", "Sin removal", "Divine protection"],
    rulingPlanet: "Krishna/Vishnu",
    chakra: "Heart Chakra",
    specifications: {
      material: "Sacred Tulsi wood",
      beadCount: "108 + 1 Guru bead",
      size: "5-7mm beads",
      origin: "Vrindavan/Mathura",
      weight: "25-35 grams"
    },
    usageInstructions: {
      en: "Ideal for chanting Krishna mantras. Wear while doing bhajan-kirtan. Very sacred for Vaishnavas.",
      hi: "कृष्ण मंत्र जप के लिए उत्तम। भजन-कीर्तन के समय धारण करें। वैष्णवों के लिए अत्यंत पवित्र।"
    },
    tags: ["mala", "tulsi", "krishna", "devotion", "sacred-wood"],
    sortOrder: 10
  },
  {
    nameEn: "Parad Shivling",
    nameHi: "पारद शिवलिंग",
    descriptionEn: "Sacred Mercury Shivling for Lord Shiva worship. Highly auspicious for achieving moksha and material prosperity both.",
    descriptionHi: "भगवान शिव की पूजा के लिए पवित्र पारद शिवलिंग। मोक्ष और भौतिक समृद्धि दोनों के लिए अत्यंत शुभ।",
    price: 15000,
    originalPrice: 20000,
    category: "spiritual-items",
    icon: "🕉️",
    inStock: true,
    stockQuantity: 3,
    rating: 5.0,
    reviewCount: 23,
    salesCount: 12,
    spiritualBenefits: ["Lord Shiva's blessings", "Moksha attainment", "Prosperity", "Spiritual elevation"],
    rulingPlanet: "Shiva",
    chakra: "Crown Chakra",
    specifications: {
      material: "Pure Mercury (Parad)",
      weight: "50-100 grams",
      size: "2-3 inches height",
      purity: "Solidified mercury",
      authenticity: "Certified genuine"
    },
    usageInstructions: {
      en: "Place in clean puja room. Offer daily prayers with milk, water, and bilva leaves. Handle with utmost care.",
      hi: "स्वच्छ पूजा गृह में स्थापित करें। दूध, जल और बिल्व पत्र से नित्य पूजा करें। अत्यधिक सावधानी से रखें।"
    },
    tags: ["parad", "shivling", "mercury", "shiva", "moksha"],
    sortOrder: 11
  },
  {
    nameEn: "Gomti Chakra Set",
    nameHi: "गोमती चक्र सेट",
    descriptionEn: "Natural Gomti Chakra shells for Lakshmi puja and wealth attraction. Set of 11 pieces for maximum benefit and prosperity.",
    descriptionHi: "लक्ष्मी पूजा और धन आकर्षण के लिए प्राकृतिक गोमती चक्र। अधिकतम लाभ और समृद्धि के लिए 11 पीस का सेट।",
    price: 450,
    originalPrice: 700,
    category: "spiritual-items",
    icon: "🐚",
    inStock: true,
    stockQuantity: 40,
    rating: 4.4,
    reviewCount: 312,
    salesCount: 198,
    spiritualBenefits: ["Wealth attraction", "Lakshmi's blessings", "Business growth", "Protection from evil eye"],
    rulingPlanet: "Venus",
    chakra: "Solar Plexus Chakra",
    specifications: {
      material: "Natural sea shells",
      quantity: "Set of 11 pieces",
      size: "15-25mm diameter",
      origin: "Gomti River, Dwarka",
      weight: "30-50 grams"
    },
    usageInstructions: {
      en: "Use in Lakshmi puja on Fridays. Keep in cash box or worship place. Can be carried in wallet for wealth.",
      hi: "शुक्रवार को लक्ष्मी पूजा में प्रयोग करें। तिजोरी या पूजा स्थान में रखें। धन के लिए बटुए में रख सकते हैं।"
    },
    tags: ["gomti-chakra", "lakshmi", "wealth", "shells", "prosperity"],
    sortOrder: 12
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB (adjust connection string as needed)
    await mongoose.connect('mongodb://localhost:27017/astro-satya', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    const createdProducts = await Product.insertMany(productsData);
    console.log(`Created ${createdProducts.length} products`);
    
    console.log('Product seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts, productsData };