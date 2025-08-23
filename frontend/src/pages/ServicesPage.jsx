import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import ConsultationModal from '../components/ConsultationModal';

const ServicesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const services = [
    {
      id: 1,
      title: "Kundli Reading",
      hindi: "कुंडली पाठन",
      description: "Complete birth chart analysis with detailed predictions about your future, career, relationships, and life path based on planetary positions.",
      hindiDesc: "आपकी जन्म कुंडली का संपूर्ण विश्लेषण और भविष्य की सटीक भविष्यवाणी।",
      icon: "🔮",
      price: "₹1500",
      duration: "45-60 mins",
      category: "Personal"
    },
    {
      id: 2,
      title: "Business Problems",
      hindi: "व्यापारिक समस्याएं",
      description: "Astrological solutions for business growth, partnership issues, financial problems, and finding auspicious timing for business ventures.",
      hindiDesc: "व्यापार में वृद्धि, साझेदारी की समस्याओं और वित्तीय परेशानियों का समाधान।",
      icon: "💼",
      price: "₹2000",
      duration: "60 mins",
      category: "Business"
    },
    {
      id: 3,
      title: "Marriage Problems",
      hindi: "विवाह संबंधी समस्याएं",
      description: "Solutions for marriage delays, compatibility issues, marital discord, divorce problems, and finding suitable life partners.",
      hindiDesc: "विवाह में देरी, वैवाहिक कलह, तलाक की समस्याओं और जीवनसाथी की तलाश का समाधान।",
      icon: "💕",
      price: "₹1800",
      duration: "45 mins",
      category: "Relationship"
    },
    {
      id: 4,
      title: "Namkaran Sanskar",
      hindi: "नामकरण संस्कार",
      description: "Traditional Hindu naming ceremony with astrological consultation to choose the most auspicious name for your newborn baby.",
      hindiDesc: "नवजात शिशु के लिए ज्योतिष के अनुसार शुभ नाम का चयन और नामकरण संस्कार।",
      icon: "👶",
      price: "₹1200",
      duration: "30 mins",
      category: "Ceremonial"
    },
    {
      id: 5,
      title: "Shani Problems",
      hindi: "शनि दोष निवारण",
      description: "Solutions for Saturn-related problems, Sade Sati effects, Shani Dhaiya, and remedies to reduce malefic effects of Saturn.",
      hindiDesc: "शनि की साढ़े साती, ढैया और शनि दोष के कारण होने वाली समस्याओं का निवारण।",
      icon: "🪐",
      price: "₹1600",
      duration: "50 mins",
      category: "Remedial"
    },
    {
      id: 6,
      title: "Career Guidance",
      hindi: "करियर मार्गदर्शन",
      description: "Professional career consultation including job changes, promotion timing, suitable career paths, and business opportunities.",
      hindiDesc: "नौकरी में बदलाव, पदोन्नति, उपयुक्त करियर पथ और व्यापारिक अवसरों की जानकारी।",
      icon: "🎯",
      price: "₹1400",
      duration: "40 mins",
      category: "Professional"
    },
    {
      id: 7,
      title: "Health Issues",
      hindi: "स्वास्थ्य संबंधी समस्याएं",
      description: "Astrological analysis of health problems, chronic diseases, mental health issues, and preventive measures through planetary remedies.",
      hindiDesc: "स्वास्थ्य की समस्याओं, पुरानी बीमारियों और मानसिक स्वास्थ्य का ज्योतिषीय विश्लेषण।",
      icon: "🏥",
      price: "₹1700",
      duration: "45 mins",
      category: "Health"
    },
    {
      id: 8,
      title: "Property & Real Estate",
      hindi: "संपत्ति और भूमि संबंधी",
      description: "Auspicious timing for property purchase, real estate investments, construction work, and resolving property disputes.",
      hindiDesc: "संपत्ति खरीदने, निर्माण कार्य और भूमि विवादों के लिए शुभ समय और समाधान।",
      icon: "🏠",
      price: "₹1900",
      duration: "50 mins",
      category: "Property"
    },
    {
      id: 9,
      title: "Education Problems",
      hindi: "शिक्षा संबंधी समस्याएं",
      description: "Solutions for academic challenges, competitive exam success, higher education abroad, and choosing the right educational path.",
      hindiDesc: "पढ़ाई में कमजोरी, प्रतियोगी परीक्षाओं में सफलता और उच्च शिक्षा की समस्याओं का समाधान।",
      icon: "📚",
      price: "₹1300",
      duration: "35 mins",
      category: "Education"
    },
    {
      id: 10,
      title: "Love Affairs",
      hindi: "प्रेम संबंध",
      description: "Guidance for love relationships, inter-caste marriage issues, convincing parents, and compatibility between partners.",
      hindiDesc: "प्रेम विवाह, अंतर्जातीय विवाह, परिवार की सहमति और प्रेमी युगल की अनुकूलता की समस्याएं।",
      icon: "❤️",
      price: "₹1500",
      duration: "40 mins",
      category: "Relationship"
    },
    {
      id: 11,
      title: "Foreign Settlement",
      hindi: "विदेश प्रवास",
      description: "Astrological guidance for foreign travel, immigration, work visa, studying abroad, and permanent settlement overseas.",
      hindiDesc: "विदेश जाने, इमिग्रेशन, वर्क वीजा, विदेशी नौकरी और विदेशी निवास की संभावनाओं का विश्लेषण।",
      icon: "✈️",
      price: "₹2200",
      duration: "55 mins",
      category: "Travel"
    },
    {
      id: 12,
      title: "Gemstone Consultation",
      hindi: "रत्न परामर्श",
      description: "Detailed gemstone recommendation based on your birth chart, proper wearing methods, and gemstone activation rituals.",
      hindiDesc: "आपकी कुंडली के अनुसार उपयुक्त रत्न की सलाह, पहनने की विधि और रत्न प्राण प्रतिष्ठा।",
      icon: "💎",
      price: "₹1100",
      duration: "30 mins",
      category: "Remedial"
    },
    {
      id: 13,
      title: "Vastu Consultation",
      hindi: "वास्तु परामर्श",
      description: "Home and office Vastu analysis, corrections for existing structures, and guidance for new construction projects.",
      hindiDesc: "घर और ऑफिस के वास्तु दोष, मौजूदा भवन के सुधार और नए निर्माण के लिए वास्तु सलाह।",
      icon: "🏛️",
      price: "₹2500",
      duration: "70 mins",
      category: "Vastu"
    },
    {
      id: 14,
      title: "Muhurat Consultation",
      hindi: "मुहूर्त परामर्श",
      description: "Finding auspicious timing for weddings, business launches, housewarming, vehicle purchase, and important life events.",
      hindiDesc: "विवाह, व्यापार शुरुआत, गृह प्रवेश, वाहन खरीदारी और महत्वपूर्ण कार्यों के लिए शुभ मुहूर्त।",
      icon: "📅",
      price: "₹800",
      duration: "20 mins",
      category: "Timing"
    },
    {
      id: 15,
      title: "Mangal Dosha Analysis",
      hindi: "मंगल दोष विश्लेषण",
      description: "Complete analysis of Manglik dosha, its effects on marriage, and effective remedies to neutralize negative impacts.",
      hindiDesc: "मंगलिक दोष का पूर्ण विश्लेषण, विवाह पर इसके प्रभाव और इसके निवारण के उपाय।",
      icon: "🔴",
      price: "₹1400",
      duration: "40 mins",
      category: "Remedial"
    }
  ];

  const categories = [
    { name: "All", value: "all" },
    { name: "Personal", value: "Personal" },
    { name: "Business", value: "Business" },
    { name: "Relationship", value: "Relationship" },
    { name: "Remedial", value: "Remedial" },
    { name: "Health", value: "Health" },
    { name: "Education", value: "Education" }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <>
      <div className="w-full">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-red-900 via-orange-800 to-amber-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, rgba(255,215,0,0.1) 0px, rgba(255,215,0,0.1) 2px, transparent 2px, transparent 20px),
                repeating-linear-gradient(-45deg, rgba(255,140,0,0.1) 0px, rgba(255,140,0,0.1) 2px, transparent 2px, transparent 20px)
              `
            }}></div>
          </div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-500/30 to-orange-500/30 backdrop-blur-sm border border-yellow-400/40 rounded-full px-8 py-3 mb-8 shadow-2xl">
                <span className="text-yellow-200 text-sm font-semibold">🕉️ Premium Vedic Astrology Services</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300">Services</span>
              </h1>
              <p className="text-xl md:text-2xl text-orange-100 mb-8 font-medium drop-shadow-lg">
                हमारी सेवाएं - Complete Astrological Solutions
              </p>
              <p className="text-lg text-orange-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Get expert guidance from Pandit Satya Prakash Tripathi for all your life problems. 
                With 25+ years of experience in Vedic astrology, we provide authentic solutions 
                for every aspect of your life.
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-lg"></div>
        </section>

        {/* Category Filter */}
        <section className="py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    selectedCategory === category.value
                      ? 'bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white shadow-xl shadow-orange-500/30 border-2 border-yellow-400'
                      : 'bg-white/90 backdrop-blur-sm text-orange-800 hover:bg-white hover:shadow-xl border-2 border-orange-200/60 hover:border-orange-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredServices.map((service) => (
                <div key={service.id} className="group bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border-2 border-amber-200/60 hover:border-amber-400 transform hover:-translate-y-3">
                  
                  {/* Service Header */}
                  <div className="bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-700 text-white p-4 md:p-8 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-15" style={{
                      backgroundImage: `
                        repeating-linear-gradient(45deg, rgba(139,69,19,0.2) 0px, rgba(139,69,19,0.2) 2px, transparent 2px, transparent 15px),
                        repeating-linear-gradient(-45deg, rgba(160,82,45,0.15) 0px, rgba(160,82,45,0.15) 2px, transparent 2px, transparent 15px)
                      `
                    }}></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-yellow-600/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <div className="w-12 h-12 md:w-18 md:h-18 bg-amber-950/40 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-yellow-700/60 shadow-lg">
                          <span className="text-2xl md:text-4xl filter drop-shadow-lg">{service.icon}</span>
                        </div>
                        <span className="bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 px-2 py-1 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase shadow-lg border border-amber-300/50">
                          {service.category}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 group-hover:text-yellow-300 transition-colors drop-shadow-lg">{service.title}</h3>
                      <p className="text-yellow-100 text-xs md:text-sm font-semibold drop-shadow-md">{service.hindi}</p>
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-4 md:p-8">
                    <p className="text-amber-950 mb-3 md:mb-5 leading-relaxed font-medium text-sm md:text-base">
                      {service.description}
                    </p>
                    <p className="text-amber-900 text-xs md:text-sm mb-4 md:mb-8 font-semibold bg-gradient-to-r from-yellow-50 to-amber-50 p-3 md:p-5 rounded-xl md:rounded-2xl border-l-4 border-amber-700 shadow-md">
                      {service.hindiDesc}
                    </p>

                    {/* Service Details */}
                    <div className="flex justify-between items-center mb-4 md:mb-8 bg-gradient-to-r from-amber-50 to-yellow-50 p-3 md:p-4 rounded-lg md:rounded-xl shadow-inner border border-amber-200">
                      <div>
                        <span className="text-xl md:text-3xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-orange-800 bg-clip-text text-transparent drop-shadow-sm">{service.price}</span>
                        <p className="text-amber-800 text-xs md:text-sm font-semibold">{service.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs md:text-sm text-amber-900 font-semibold">Online/Offline</p>
                        <div className="flex items-center justify-end mt-1">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-green-600 rounded-full mr-2 animate-pulse shadow-md"></div>
                          <p className="text-xs md:text-sm text-green-700 font-bold">Available Now</p>
                        </div>
                      </div>
                    </div>

                    {/* Book Now Button */}
                    <button
                      onClick={openModal}
                      className="w-full bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-700 hover:from-amber-900 hover:via-yellow-800 hover:to-orange-800 text-white font-bold py-3 md:py-5 px-4 md:px-8 rounded-xl md:rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group border-2 border-yellow-600/60"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10 flex items-center justify-center drop-shadow-md">
                        <span className="mr-2 md:mr-3 text-lg md:text-xl">📅</span>
                        <span className="text-sm md:text-lg">Book Now - अभी बुक करें</span>
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white"></div>
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-200/50 rounded-full px-6 py-2 mb-6">
                <span className="text-indigo-600 text-sm font-medium">⭐ Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Astro Satya</span>?
              </h2>
              <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
                हमें क्यों चुनें - Your Trusted Astrological Partner
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <span className="text-4xl text-white">🎯</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl mx-auto w-20 h-20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">25+ Years Experience</h3>
                <p className="text-slate-600 font-light leading-relaxed">Trusted by thousands of satisfied clients worldwide</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <span className="text-4xl text-white">📱</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl mx-auto w-20 h-20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Online Consultation</h3>
                <p className="text-slate-600 font-light leading-relaxed">Available 24/7 through phone, video call & chat</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <span className="text-4xl text-white">✅</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl mx-auto w-20 h-20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Accurate Predictions</h3>
                <p className="text-slate-600 font-light leading-relaxed">Based on authentic Vedic astrology principles</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <span className="text-4xl text-white">🔒</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-pink-600/20 rounded-2xl mx-auto w-20 h-20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Complete Privacy</h3>
                <p className="text-slate-600 font-light leading-relaxed">Your personal information is 100% confidential</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            <div className="w-full h-full" style={{
              backgroundImage: `
                repeating-linear-gradient(60deg, rgba(255,215,0,0.1) 0px, rgba(255,215,0,0.1) 3px, transparent 3px, transparent 25px),
                repeating-linear-gradient(-60deg, rgba(255,140,0,0.08) 0px, rgba(255,140,0,0.08) 3px, transparent 3px, transparent 25px)
              `
            }}></div>
          </div>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-2xl"></div>
          <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-500/40 to-orange-500/40 backdrop-blur-sm border-2 border-yellow-400/50 rounded-full px-8 py-3 mb-8 shadow-2xl">
                <span className="text-yellow-200 text-sm font-bold">🚀 Transform Your Life</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight drop-shadow-2xl">
                Ready to Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300">Life?</span>
              </h2>
              <p className="text-xl text-orange-100 mb-12 max-w-3xl mx-auto font-semibold leading-relaxed drop-shadow-lg">
                Don't let uncertainty hold you back. Get personalized astrological guidance 
                and find solutions to all your problems today with our expert consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center max-w-3xl mx-auto">
                <button
                  onClick={openModal}
                  className="group relative bg-white text-red-800 font-bold px-12 py-6 rounded-2xl hover:bg-yellow-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 overflow-hidden border-4 border-yellow-400"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center text-lg drop-shadow-md">
                    <span className="mr-3 text-2xl">📅</span>
                    Book Free Consultation
                  </span>
                </button>
                <a
                  href="tel:+91883945431"
                  className="group relative bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-bold px-12 py-6 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 overflow-hidden border-4 border-yellow-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/15 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center text-lg drop-shadow-md">
                    <span className="mr-3 text-2xl">📞</span>
                    Call: +91 883945431
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Consultation Modal */}
      <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default ServicesPage;