const mongoose = require('mongoose');
const Service = require('../models/Service');

// Sample services data based on your ServicesPage.jsx
const servicesData = [
  {
    titleEn: "Kundli Reading",
    titleHi: "कुंडली पाठन",
    descriptionEn: "Complete birth chart analysis with detailed predictions about your future, career, relationships, and life path based on planetary positions.",
    descriptionHi: "आपकी जन्म कुंडली का संपूर्ण विश्लेषण और भविष्य की सटीक भविष्यवाणी।",
    price: 1500,
    originalPrice: 2000,
    duration: "45-60 mins",
    category: "Personal",
    icon: "🔮",
    isPopular: true,
    features: ["Birth chart analysis", "Career predictions", "Relationship guidance", "Life path insights"],
    sortOrder: 1,
    metaDescription: "Get detailed Kundli reading with accurate predictions for your future, career, and relationships."
  },
  {
    titleEn: "Business Problems",
    titleHi: "व्यापारिक समस्याएं",
    descriptionEn: "Astrological solutions for business growth, partnership issues, financial problems, and finding auspicious timing for business ventures.",
    descriptionHi: "व्यापार में वृद्धि, साझेदारी की समस्याओं और वित्तीय परेशानियों का समाधान।",
    price: 2000,
    originalPrice: 2500,
    duration: "60 mins",
    category: "Business",
    icon: "💼",
    isPopular: true,
    features: ["Business growth strategies", "Partnership solutions", "Financial guidance", "Auspicious timing"],
    sortOrder: 2,
    metaDescription: "Solve business problems and financial issues with expert astrological guidance."
  },
  {
    titleEn: "Marriage Problems",
    titleHi: "विवाह संबंधी समस्याएं",
    descriptionEn: "Solutions for marriage delays, compatibility issues, marital discord, divorce problems, and finding suitable life partners.",
    descriptionHi: "विवाह में देरी, वैवाहिक कलह, तलाक की समस्याओं और जीवनसाथी की तलाश का समाधान।",
    price: 1800,
    originalPrice: 2200,
    duration: "45 mins",
    category: "Relationship",
    icon: "💕",
    isPopular: true,
    features: ["Marriage delay solutions", "Compatibility analysis", "Marital discord remedies", "Partner finding guidance"],
    sortOrder: 3,
    metaDescription: "Get solutions for marriage problems, delays, and compatibility issues."
  },
  {
    titleEn: "Namkaran Sanskar",
    titleHi: "नामकरण संस्कार",
    descriptionEn: "Traditional Hindu naming ceremony with astrological consultation to choose the most auspicious name for your newborn baby.",
    descriptionHi: "नवजात शिशु के लिए ज्योतिष के अनुसार शुभ नाम का चयन और नामकरण संस्कार।",
    price: 1200,
    originalPrice: 1500,
    duration: "30 mins",
    category: "Ceremonial",
    icon: "👶",
    features: ["Astrological name selection", "Traditional ceremony", "Lucky letter guidance", "Name meaning explanation"],
    sortOrder: 4,
    metaDescription: "Traditional naming ceremony with astrological consultation for your newborn."
  },
  {
    titleEn: "Shani Problems",
    titleHi: "शनि दोष निवारण",
    descriptionEn: "Solutions for Saturn-related problems, Sade Sati effects, Shani Dhaiya, and remedies to reduce malefic effects of Saturn.",
    descriptionHi: "शनि की साढ़े साती, ढैया और शनि दोष के कारण होने वाली समस्याओं का निवारण।",
    price: 1600,
    originalPrice: 2000,
    duration: "50 mins",
    category: "Remedial",
    icon: "🪐",
    isPopular: true,
    features: ["Sade Sati analysis", "Saturn remedies", "Shani Dhaiya solutions", "Protection mantras"],
    sortOrder: 5,
    metaDescription: "Get relief from Saturn problems, Sade Sati effects, and Shani Dhaiya."
  },
  {
    titleEn: "Career Guidance",
    titleHi: "करियर मार्गदर्शन",
    descriptionEn: "Professional career consultation including job changes, promotion timing, suitable career paths, and business opportunities.",
    descriptionHi: "नौकरी में बदलाव, पदोन्नति, उपयुक्त करियर पथ और व्यापारिक अवसरों की जानकारी।",
    price: 1400,
    originalPrice: 1800,
    duration: "40 mins",
    category: "Personal",
    icon: "🎯",
    isPopular: true,
    features: ["Career path analysis", "Job change timing", "Promotion guidance", "Business opportunities"],
    sortOrder: 6,
    metaDescription: "Get expert career guidance and professional consultation for job success."
  },
  {
    titleEn: "Health Issues",
    titleHi: "स्वास्थ्य संबंधी समस्याएं",
    descriptionEn: "Astrological analysis of health problems, chronic diseases, mental health issues, and preventive measures through planetary remedies.",
    descriptionHi: "स्वास्थ्य की समस्याओं, पुरानी बीमारियों और मानसिक स्वास्थ्य का ज्योतिषीय विश्लेषण।",
    price: 1700,
    originalPrice: 2100,
    duration: "45 mins",
    category: "Health",
    icon: "🏥",
    features: ["Health problem analysis", "Chronic disease remedies", "Mental health guidance", "Preventive measures"],
    sortOrder: 7,
    metaDescription: "Astrological solutions for health problems and chronic diseases."
  },
  {
    titleEn: "Property & Real Estate",
    titleHi: "संपत्ति और भूमि संबंधी",
    descriptionEn: "Auspicious timing for property purchase, real estate investments, construction work, and resolving property disputes.",
    descriptionHi: "संपत्ति खरीदने, निर्माण कार्य और भूमि विवादों के लिए शुभ समय और समाधान।",
    price: 1900,
    originalPrice: 2400,
    duration: "50 mins",
    category: "Property",
    icon: "🏠",
    features: ["Property purchase timing", "Real estate investment", "Construction guidance", "Dispute resolution"],
    sortOrder: 8,
    metaDescription: "Get auspicious timing for property purchase and real estate investments."
  },
  {
    titleEn: "Education Problems",
    titleHi: "शिक्षा संबंधी समस्याएं",
    descriptionEn: "Solutions for academic challenges, competitive exam success, higher education abroad, and choosing the right educational path.",
    descriptionHi: "पढ़ाई में कमजोरी, प्रतियोगी परीक्षाओं में सफलता और उच्च शिक्षा की समस्याओं का समाधान।",
    price: 1300,
    originalPrice: 1600,
    duration: "35 mins",
    category: "Education",
    icon: "📚",
    features: ["Academic improvement", "Exam success remedies", "Education abroad guidance", "Study path selection"],
    sortOrder: 9,
    metaDescription: "Get solutions for education problems and academic challenges."
  },
  {
    titleEn: "Love Affairs",
    titleHi: "प्रेम संबंध",
    descriptionEn: "Guidance for love relationships, inter-caste marriage issues, convincing parents, and compatibility between partners.",
    descriptionHi: "प्रेम विवाह, अंतर्जातीय विवाह, परिवार की सहमति और प्रेमी युगल की अनुकूलता की समस्याएं।",
    price: 1500,
    originalPrice: 1900,
    duration: "40 mins",
    category: "Relationship",
    icon: "❤️",
    features: ["Love relationship guidance", "Inter-caste marriage", "Parent convincing", "Compatibility analysis"],
    sortOrder: 10,
    metaDescription: "Get guidance for love relationships and inter-caste marriage issues."
  },
  {
    titleEn: "Foreign Settlement",
    titleHi: "विदेश प्रवास",
    descriptionEn: "Astrological guidance for foreign travel, immigration, work visa, studying abroad, and permanent settlement overseas.",
    descriptionHi: "विदेश जाने, इमिग्रेशन, वर्क वीजा, विदेशी नौकरी और विदेशी निवास की संभावनाओं का विश्लेषण।",
    price: 2200,
    originalPrice: 2800,
    duration: "55 mins",
    category: "Travel",
    icon: "✈️",
    features: ["Foreign travel timing", "Immigration guidance", "Work visa analysis", "Settlement prospects"],
    sortOrder: 11,
    metaDescription: "Astrological guidance for foreign settlement and immigration."
  },
  {
    titleEn: "Gemstone Consultation",
    titleHi: "रत्न परामर्श",
    descriptionEn: "Detailed gemstone recommendation based on your birth chart, proper wearing methods, and gemstone activation rituals.",
    descriptionHi: "आपकी कुंडली के अनुसार उपयुक्त रत्न की सलाह, पहनने की विधि और रत्न प्राण प्रतिष्ठा।",
    price: 1100,
    originalPrice: 1400,
    duration: "30 mins",
    category: "Remedial",
    icon: "💎",
    features: ["Personalized gemstone selection", "Wearing methods", "Activation rituals", "Quality guidance"],
    sortOrder: 12,
    metaDescription: "Get personalized gemstone recommendations based on your birth chart."
  },
  {
    titleEn: "Vastu Consultation",
    titleHi: "वास्तु परामर्श",
    descriptionEn: "Home and office Vastu analysis, corrections for existing structures, and guidance for new construction projects.",
    descriptionHi: "घर और ऑफिस के वास्तु दोष, मौजूदा भवन के सुधार और नए निर्माण के लिए वास्तु सलाह।",
    price: 2500,
    originalPrice: 3200,
    duration: "70 mins",
    category: "Vastu",
    icon: "🏛️",
    isPopular: true,
    features: ["Home Vastu analysis", "Office corrections", "Construction guidance", "Remedial solutions"],
    sortOrder: 13,
    metaDescription: "Complete Vastu consultation for home and office with remedial solutions."
  },
  {
    titleEn: "Muhurat Consultation",
    titleHi: "मुहूर्त परामर्श",
    descriptionEn: "Finding auspicious timing for weddings, business launches, housewarming, vehicle purchase, and important life events.",
    descriptionHi: "विवाह, व्यापार शुरुआत, गृह प्रवेश, वाहन खरीदारी और महत्वपूर्ण कार्यों के लिए शुभ मुहूर्त।",
    price: 800,
    originalPrice: 1200,
    duration: "20 mins",
    category: "Timing",
    icon: "📅",
    features: ["Wedding muhurat", "Business launch timing", "Housewarming dates", "Vehicle purchase timing"],
    sortOrder: 14,
    metaDescription: "Find auspicious timing for weddings, business launches, and important events."
  },
  {
    titleEn: "Mangal Dosha Analysis",
    titleHi: "मंगल दोष विश्लेषण",
    descriptionEn: "Complete analysis of Manglik dosha, its effects on marriage, and effective remedies to neutralize negative impacts.",
    descriptionHi: "मंगलिक दोष का पूर्ण विश्लेषण, विवाह पर इसके प्रभाव और इसके निवारण के उपाय।",
    price: 1400,
    originalPrice: 1800,
    duration: "40 mins",
    category: "Remedial",
    icon: "🔴",
    features: ["Manglik dosha detection", "Marriage impact analysis", "Remedial measures", "Compatibility solutions"],
    sortOrder: 15,
    metaDescription: "Complete Mangal Dosha analysis with effective remedies for marriage."
  }
];

const seedServices = async () => {
  try {
    // Connect to MongoDB (adjust connection string as needed)
    await mongoose.connect('mongodb://localhost:27017/astro-satya', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');
    
    // Insert new services
    const createdServices = await Service.insertMany(servicesData);
    console.log(`Created ${createdServices.length} services`);
    
    console.log('Service seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedServices();
}

module.exports = { seedServices, servicesData };