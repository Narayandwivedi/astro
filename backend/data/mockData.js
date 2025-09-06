// Mock data for Astro Satya - Services and Products

const mockServices = [
  {
    id: 1,
    titleEn: "Kundli Reading",
    titleHi: "कुंडली पाठन",
    description: "Complete birth chart analysis with detailed predictions about your future, career, relationships, and life path based on planetary positions.",
    hindiDesc: "आपकी जन्म कुंडली का संपूर्ण विश्लेषण और भविष्य की सटीक भविष्यवाणी।",
    icon: "🔮",
    price: 1500,
    duration: "45-60 mins",
    category: "Personal",
    features: [
      "Complete birth chart analysis",
      "Planetary positions and their effects",
      "Career and business predictions",
      "Marriage and relationship insights",
      "Health analysis",
      "Remedial measures"
    ],
    hindiFeatures: [
      "संपूर्ण जन्म कुंडली विश्लेषण",
      "ग्रहों की स्थिति और प्रभाव",
      "करियर और व्यापार की भविष्यवाणी",
      "विवाह और रिश्तों की जानकारी",
      "स्वास्थ्य विश्लेषण",
      "उपचारात्मक उपाय"
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 2,
    titleEn: "Business Problems",
    titleHi: "व्यापारिक समस्याएं",
    description: "Astrological solutions for business growth, partnership issues, financial problems, and finding auspicious timing for business ventures.",
    hindiDesc: "व्यापार में वृद्धि, साझेदारी की समस्याओं और वित्तीय परेशानियों का समाधान।",
    icon: "💼",
    price: 2000,
    duration: "60 mins",
    category: "Business",
    features: [
      "Business growth strategies",
      "Partnership compatibility analysis",
      "Financial problem solutions",
      "Auspicious timing for launches",
      "Investment guidance",
      "Market predictions"
    ],
    hindiFeatures: [
      "व्यापारिक विकास रणनीति",
      "साझेदारी अनुकूलता विश्लेषण",
      "वित्तीय समस्या समाधान",
      "शुभ समय की जानकारी",
      "निवेश मार्गदर्शन",
      "बाजार की भविष्यवाणी"
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 3,
    titleEn: "Marriage Problems",
    titleHi: "विवाह संबंधी समस्याएं",
    description: "Solutions for marriage delays, compatibility issues, marital discord, divorce problems, and finding suitable life partners.",
    hindiDesc: "विवाह में देरी, वैवाहिक कलह, तलाक की समस्याओं और जीवनसाथी की तलाश का समाधान।",
    icon: "💕",
    price: 1800,
    duration: "45 mins",
    category: "Relationship",
    features: [
      "Marriage delay analysis",
      "Compatibility matching",
      "Marital discord solutions",
      "Divorce problem resolution",
      "Partner selection guidance",
      "Timing for marriage"
    ],
    hindiFeatures: [
      "विवाह में विलंब का विश्लेषण",
      "अनुकूलता मिलान",
      "वैवाहिक कलह का समाधान",
      "तलाक समस्या निवारण",
      "साथी चयन मार्गदर्शन",
      "विवाह का समय"
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 4,
    titleEn: "Namkaran Sanskar",
    titleHi: "नामकरण संस्कार",
    description: "Traditional Hindu naming ceremony with astrological consultation to choose the most auspicious name for your newborn baby.",
    hindiDesc: "नवजात शिशु के लिए ज्योतिष के अनुसार शुभ नाम का चयन और नामकरण संस्कार।",
    icon: "👶",
    price: 1200,
    duration: "30 mins",
    category: "Ceremonial",
    features: [
      "Astrological name analysis",
      "Lucky letter identification",
      "Name meaning explanation",
      "Ceremonial guidance",
      "Auspicious timing",
      "Traditional rituals"
    ],
    hindiFeatures: [
      "ज्योतिषीय नाम विश्लेषण",
      "भाग्यशाली अक्षर पहचान",
      "नाम का अर्थ स्पष्टीकरण",
      "संस्कार मार्गदर्शन",
      "शुभ समय",
      "पारंपरिक रीति-रिवाज"
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 5,
    titleEn: "Shani Problems",
    titleHi: "शनि दोष निवारण",
    description: "Solutions for Saturn-related problems, Sade Sati effects, Shani Dhaiya, and remedies to reduce malefic effects of Saturn.",
    hindiDesc: "शनि की साढ़े साती, ढैया और शनि दोष के कारण होने वाली समस्याओं का निवारण।",
    icon: "🪐",
    price: 1600,
    duration: "50 mins",
    category: "Remedial",
    features: [
      "Sade Sati analysis",
      "Shani Dhaiya effects",
      "Saturn transit predictions",
      "Remedial measures",
      "Gemstone recommendations",
      "Mantra and prayers"
    ],
    hindiFeatures: [
      "साढ़े साती विश्लेषण",
      "शनि ढैया प्रभाव",
      "शनि गोचर भविष्यवाणी",
      "उपचारात्मक उपाय",
      "रत्न सिफारिशें",
      "मंत्र और प्रार्थनाएं"
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 6,
    titleEn: "Career Guidance",
    titleHi: "करियर मार्गदर्शन",
    description: "Professional career consultation including job changes, promotion timing, suitable career paths, and business opportunities.",
    hindiDesc: "नौकरी में बदलाव, पदोन्नति, उपयुक्त करियर पथ और व्यापारिक अवसरों की जानकारी।",
    icon: "🎯",
    price: 1400,
    duration: "40 mins",
    category: "Business",
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 7,
    titleEn: "Health Issues",
    titleHi: "स्वास्थ्य संबंधी समस्याएं",
    description: "Astrological analysis of health problems, chronic diseases, mental health issues, and preventive measures through planetary remedies.",
    hindiDesc: "स्वास्थ्य की समस्याओं, पुरानी बीमारियों और मानसिक स्वास्थ्य का ज्योतिषीय विश्लेषण।",
    icon: "🏥",
    price: 1700,
    duration: "45 mins",
    category: "Health",
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 8,
    titleEn: "Property & Real Estate",
    titleHi: "संपत्ति और भूमि संबंधी",
    description: "Auspicious timing for property purchase, real estate investments, construction work, and resolving property disputes.",
    hindiDesc: "संपत्ति खरीदने, निर्माण कार्य और भूमि विवादों के लिए शुभ समय और समाधान।",
    icon: "🏠",
    price: 1900,
    duration: "50 mins",
    category: "Property",
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 9,
    titleEn: "Education Problems",
    titleHi: "शिक्षा संबंधी समस्याएं",
    description: "Solutions for academic challenges, competitive exam success, higher education abroad, and choosing the right educational path.",
    hindiDesc: "पढ़ाई में कमजोरी, प्रतियोगी परीक्षाओं में सफलता और उच्च शिक्षा की समस्याओं का समाधान।",
    icon: "📚",
    price: 1300,
    duration: "35 mins",
    category: "Education",
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 10,
    titleEn: "Love Affairs",
    titleHi: "प्रेम संबंध",
    description: "Guidance for love relationships, inter-caste marriage issues, convincing parents, and compatibility between partners.",
    hindiDesc: "प्रेम विवाह, अंतर्जातीय विवाह, परिवार की सहमति और प्रेमी युगल की अनुकूलता की समस्याएं।",
    icon: "❤️",
    price: 1500,
    duration: "40 mins",
    category: "Relationship",
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 11,
    titleEn: "Foreign Settlement",
    titleHi: "विदेश प्रवास",
    description: "Astrological guidance for foreign travel, immigration, work visa, studying abroad, and permanent settlement overseas.",
    hindiDesc: "विदेश जाने, इमिग्रेशन, वर्क वीजा, विदेशी नौकरी और विदेशी निवास की संभावनाओं का विश्लेषण।",
    icon: "✈️",
    price: 2200,
    duration: "55 mins",
    category: "Travel",
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 12,
    titleEn: "Gemstone Consultation",
    titleHi: "रत्न परामर्श",
    description: "Detailed gemstone recommendation based on your birth chart, proper wearing methods, and gemstone activation rituals.",
    hindiDesc: "आपकी कुंडली के अनुसार उपयुक्त रत्न की सलाह, पहनने की विधि और रत्न प्राण प्रतिष्ठा।",
    icon: "💎",
    price: 1100,
    duration: "30 mins",
    category: "Remedial",
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 13,
    titleEn: "Vastu Consultation",
    titleHi: "वास्तु परामर्श",
    description: "Home and office Vastu analysis, corrections for existing structures, and guidance for new construction projects.",
    hindiDesc: "घर और ऑफिस के वास्तु दोष, मौजूदा भवन के सुधार और नए निर्माण के लिए वास्तु सलाह।",
    icon: "🏛️",
    price: 2500,
    duration: "70 mins",
    category: "Vastu",
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 14,
    titleEn: "Muhurat Consultation",
    titleHi: "मुहूर्त परामर्श",
    description: "Finding auspicious timing for weddings, business launches, housewarming, vehicle purchase, and important life events.",
    hindiDesc: "विवाह, व्यापार शुरुआत, गृह प्रवेश, वाहन खरीदारी और महत्वपूर्ण कार्यों के लिए शुभ मुहूर्त।",
    icon: "📅",
    price: 800,
    duration: "20 mins",
    category: "Timing",
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 15,
    titleEn: "Mangal Dosha Analysis",
    titleHi: "मंगल दोष विश्लेषण",
    description: "Complete analysis of Manglik dosha, its effects on marriage, and effective remedies to neutralize negative impacts.",
    hindiDesc: "मंगलिक दोष का पूर्ण विश्लेषण, विवाह पर इसके प्रभाव और इसके निवारण के उपाय।",
    icon: "🔴",
    price: 1400,
    duration: "40 mins",
    category: "Remedial",
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

const mockProducts = [
  {
    id: 1,
    name: "1 Mukhi Rudraksha",
    nameHi: "एक मुखी रुद्राक्ष",
    description: "Rare and powerful 1 Mukhi Rudraksha for spiritual growth and removing obstacles. Blessed by Lord Shiva himself.",
    descriptionHi: "आध्यात्मिक विकास और बाधाओं को दूर करने के लिए दुर्लभ और शक्तिशाली एक मुखी रुद्राक्ष।",
    price: 25000,
    originalPrice: 30000,
    category: "rudraksha",
    images: ["rudraksha-1-mukhi-1.jpg", "rudraksha-1-mukhi-2.jpg"],
    inStock: true,
    stock: 5,
    benefits: [
      "Removes all sins and negative karma",
      "Brings peace and prosperity",
      "Enhances spiritual growth",
      "Protects from evil energies"
    ],
    benefitsHi: [
      "सभी पापों और नकारात्मक कर्मों को दूर करता है",
      "शांति और समृद्धि लाता है",
      "आध्यात्मिक विकास बढ़ाता है",
      "बुरी शक्तियों से सुरक्षा करता है"
    ],
    weight: "2.5 grams",
    origin: "Nepal",
    certification: "Lab Certified",
    isActive: true,
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: "Blue Sapphire (Neelam)",
    nameHi: "नीलम रत्न",
    description: "Premium quality Blue Sapphire gemstone for Saturn planet. Brings wealth, success, and removes Shani dosha.",
    descriptionHi: "शनि ग्रह के लिए उच्च गुणवत्ता वाला नीलम रत्न। धन, सफलता लाता है और शनि दोष को दूर करता है।",
    price: 15000,
    originalPrice: 18000,
    category: "gemstone",
    images: ["neelam-1.jpg", "neelam-2.jpg"],
    inStock: true,
    stock: 12,
    benefits: [
      "Brings wealth and prosperity",
      "Removes Saturn's malefic effects",
      "Enhances career growth",
      "Provides mental peace"
    ],
    benefitsHi: [
      "धन और समृद्धि लाता है",
      "शनि के बुरे प्रभावों को दूर करता है",
      "करियर की वृद्धि करता है",
      "मानसिक शांति प्रदान करता है"
    ],
    weight: "5.25 carats",
    origin: "Sri Lanka",
    certification: "Gemological Certificate",
    isActive: true,
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: "Sphatik Mala (Crystal Rosary)",
    nameHi: "स्फटिक माला",
    description: "108 beads crystal mala for meditation and chanting. Enhances concentration and spiritual power.",
    descriptionHi: "ध्यान और जप के लिए 108 मनकों वाली स्फटिक माला। एकाग्रता और आध्यात्मिक शक्ति बढ़ाती है।",
    price: 800,
    originalPrice: 1200,
    category: "mala",
    images: ["sphatik-mala-1.jpg", "sphatik-mala-2.jpg"],
    inStock: true,
    stock: 25,
    benefits: [
      "Enhances meditation power",
      "Brings mental clarity",
      "Removes negative thoughts",
      "Increases spiritual energy"
    ],
    benefitsHi: [
      "ध्यान की शक्ति बढ़ाती है",
      "मानसिक स्पष्टता लाती है",
      "नकारात्मक विचारों को दूर करती है",
      "आध्यात्मिक ऊर्जा बढ़ाती है"
    ],
    weight: "50 grams",
    beadCount: 108,
    material: "Natural Crystal",
    isActive: true,
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 4,
    name: "Shri Yantra - Brass",
    nameHi: "श्री यंत्र - पीतल",
    description: "Sacred Shri Yantra made of pure brass for wealth, prosperity and spiritual growth. Energized with mantras.",
    descriptionHi: "धन, समृद्धि और आध्यात्मिक विकास के लिए शुद्ध पीतल से बना पवित्र श्री यंत्र। मंत्रों से ऊर्जावान।",
    price: 1200,
    originalPrice: 1500,
    category: "yantra",
    images: ["shri-yantra-1.jpg", "shri-yantra-2.jpg"],
    inStock: true,
    stock: 15,
    benefits: [
      "Attracts wealth and prosperity",
      "Brings good luck",
      "Removes financial problems",
      "Enhances spiritual growth"
    ],
    benefitsHi: [
      "धन और समृद्धि आकर्षित करता है",
      "भाग्य लाता है",
      "वित्तीय समस्याओं को दूर करता है",
      "आध्यात्मिक विकास बढ़ाता है"
    ],
    size: "3x3 inches",
    material: "Pure Brass",
    weight: "200 grams",
    isActive: true,
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 5,
    name: "Gomti Chakra Set",
    nameHi: "गोमती चक्र सेट",
    description: "Set of 11 natural Gomti Chakras for protection from evil eye and negative energies. Brings good fortune.",
    descriptionHi: "बुरी नजर और नकारात्मक ऊर्जाओं से सुरक्षा के लिए 11 प्राकृतिक गोमती चक्रों का सेट। सौभाग्य लाता है।",
    price: 500,
    originalPrice: 700,
    category: "spiritual-items",
    images: ["gomti-chakra-1.jpg", "gomti-chakra-2.jpg"],
    inStock: true,
    stock: 30,
    benefits: [
      "Protects from evil eye",
      "Removes negative energies",
      "Brings good fortune",
      "Enhances positivity"
    ],
    benefitsHi: [
      "बुरी नजर से सुरक्षा करता है",
      "नकारात्मक ऊर्जाओं को दूर करता है",
      "सौभाग्य लाता है",
      "सकारात्मकता बढ़ाता है"
    ],
    quantity: "Set of 11 pieces",
    origin: "Dwarka, Gujarat",
    isActive: true,
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 6,
    name: "Parad Shivling",
    nameHi: "पारद शिवलिंग",
    description: "Sacred Mercury Shivling for worship and removing all doshas. Blessed and energized by experienced pandits.",
    descriptionHi: "पूजा और सभी दोषों को दूर करने के लिए पवित्र पारद शिवलिंग। अनुभवी पंडितों द्वारा आशीर्वादित।",
    price: 3500,
    originalPrice: 4000,
    category: "spiritual-items",
    images: ["parad-shivling-1.jpg", "parad-shivling-2.jpg"],
    inStock: true,
    stock: 8,
    benefits: [
      "Removes all doshas",
      "Brings blessings of Lord Shiva",
      "Enhances spiritual power",
      "Fulfills all wishes"
    ],
    benefitsHi: [
      "सभी दोषों को दूर करता है",
      "भगवान शिव का आशीर्वाद लाता है",
      "आध्यात्मिक शक्ति बढ़ाता है",
      "सभी इच्छाओं को पूरा करता है"
    ],
    weight: "100 grams",
    material: "Pure Mercury (Parad)",
    isActive: true,
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 7,
    name: "Red Coral (Moonga)",
    nameHi: "मूंगा रत्न",
    description: "Natural Red Coral gemstone for Mars planet. Increases confidence, courage, and removes Mangal dosha.",
    descriptionHi: "मंगल ग्रह के लिए प्राकृतिक मूंगा रत्न। आत्मविश्वास, साहस बढ़ाता है और मंगल दोष को दूर करता है।",
    price: 8000,
    originalPrice: 10000,
    category: "gemstone",
    images: ["moonga-1.jpg", "moonga-2.jpg"],
    inStock: true,
    stock: 18,
    benefits: [
      "Increases confidence and courage",
      "Removes Mangal dosha",
      "Enhances leadership qualities",
      "Protects from accidents"
    ],
    benefitsHi: [
      "आत्मविश्वास और साहस बढ़ाता है",
      "मंगल दोष को दूर करता है",
      "नेतृत्व गुणों को बढ़ाता है",
      "दुर्घटनाओं से सुरक्षा करता है"
    ],
    weight: "4.25 carats",
    origin: "Italian Red Sea",
    certification: "Gemological Certificate",
    isActive: true,
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 8,
    name: "Tulsi Mala",
    nameHi: "तुलसी माला",
    description: "Sacred Tulsi wood mala with 108 beads for Krishna worship and daily chanting. Brings peace and devotion.",
    descriptionHi: "कृष्ण पूजा और दैनिक जप के लिए 108 मनकों वाली पवित्र तुलसी की लकड़ी की माला। शांति और भक्ति लाती है।",
    price: 300,
    originalPrice: 500,
    category: "mala",
    images: ["tulsi-mala-1.jpg", "tulsi-mala-2.jpg"],
    inStock: true,
    stock: 40,
    benefits: [
      "Brings peace and tranquility",
      "Enhances devotion",
      "Purifies mind and soul",
      "Pleases Lord Krishna"
    ],
    benefitsHi: [
      "शांति और स्थिरता लाती है",
      "भक्ति बढ़ाती है",
      "मन और आत्मा को शुद्ध करती है",
      "भगवान कृष्ण को प्रसन्न करती है"
    ],
    weight: "30 grams",
    beadCount: 108,
    material: "Sacred Tulsi Wood",
    isActive: true,
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

const serviceCategories = [
  { name: "All", value: "all" },
  { name: "Personal", value: "Personal" },
  { name: "Business", value: "Business" },
  { name: "Relationship", value: "Relationship" },
  { name: "Remedial", value: "Remedial" },
  { name: "Health", value: "Health" },
  { name: "Education", value: "Education" },
  { name: "Property", value: "Property" },
  { name: "Travel", value: "Travel" },
  { name: "Vastu", value: "Vastu" },
  { name: "Ceremonial", value: "Ceremonial" },
  { name: "Timing", value: "Timing" }
];

const productCategories = [
  { name: "All Products", value: "all" },
  { name: "Rudraksha", value: "rudraksha" },
  { name: "Gemstones", value: "gemstone" },
  { name: "Spiritual Items", value: "spiritual-items" },
  { name: "Yantras", value: "yantra" },
  { name: "Mala", value: "mala" },
  { name: "Accessories", value: "accessories" },
  { name: "Puja Items", value: "puja-items" }
];

module.exports = {
  mockServices,
  mockProducts,
  serviceCategories,
  productCategories
};