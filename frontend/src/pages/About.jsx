import React from 'react'
import Navigation from '../components/Navigation'

const About = () => {
  return (
    <>
      <Navigation />
      <div className="w-full">
        
        {/* Hero Section - Cosmic Theme */}
        <section className="pt-24 pb-4 md:pt-28 md:pb-16 bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="/astro chart.png" 
              alt="Astrology Chart" 
              className="w-full h-full object-cover"
              style={{
                filter: 'sepia(100%) saturate(150%) hue-rotate(280deg) brightness(0.7) contrast(1.2)'
              }}
            />
          </div>
          
          {/* Cosmic Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white/30 rounded-full"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-4 left-1/2 w-12 h-12 border border-white/25 rounded-full transform -translate-x-1/2"></div>
          </div>
          
          {/* Floating Stars */}
          <div className="absolute inset-0 cosmic-stars"></div>
          
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center bg-gradient-to-r from-purple-500/30 to-indigo-500/30 backdrop-blur-sm border border-purple-400/40 rounded-full px-8 py-3 mb-8 shadow-2xl">
                <span className="text-purple-200 text-sm font-semibold">🕉️ About Acharya</span>
              </div>
              <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-300 to-amber-300">Acharya Satya</span><br className="sm:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-300 to-amber-300 block">Prakash Tripathi</span>
              </h1>
              <p className="text-base md:text-2xl text-purple-100 mb-8 font-medium drop-shadow-lg">
                आचार्य सत्य प्रकाश त्रिपाठी के बारे में
              </p>
            </div>
          </div>
        </section>

        {/* About Content - Cosmic Theme */}
        <section className="py-10 md:py-20 bg-gradient-to-br from-purple-50/80 via-indigo-50/60 to-amber-50/40 cosmic-stars">
          <div className="container mx-auto px-4 lg:px-6">
            
            {/* Introduction with Photo */}
            <div className="flex flex-col lg:flex-row gap-12 items-center mb-4 md:mb-20">
              <div className="lg:flex-1">
                <div className="relative">
                  <div className="w-40 h-40 md:w-80 md:h-80 mx-auto rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-500 p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-full p-2">
                      <img 
                        src="/satya2.webp" 
                        alt="Acharya Satya Prakash Tripathi" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-2xl -z-10"></div>
                </div>
              </div>
              
              <div className="lg:flex-1">
                <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200/60">
                  <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent mb-6">
                    परिचय - Introduction
                  </h2>
                  <p className="text-purple-900 text-base leading-relaxed mb-6">
                    ज्योतिष एवं वास्तु के गहन अध्येता के रूप में, मैंने अपनी प्रारंभिक शिक्षा अयोध्या की गुरुकुल परंपरा में ग्रहण की।
                  </p>
                  <p className="text-indigo-800 text-sm leading-relaxed">
                    As a profound scholar of Astrology and Vastu, Acharya Satya Prakash Tripathi received his foundational education in the traditional Gurukul system of Ayodhya, where ancient wisdom and sacred knowledge have been preserved for centuries.
                  </p>
                </div>
              </div>
            </div>

            {/* Educational Journey */}
            <div className="mb-10 md:mb-20">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent mb-4">
                  शैक्षिक यात्रा - Educational Journey
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-amber-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border-l-4 border-purple-600">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">🎓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-purple-900">Shastri Degree</h3>
                      <p className="text-purple-700 text-sm font-semibold">शास्त्री उपाधि</p>
                    </div>
                  </div>
                  <p className="text-purple-800 text-base leading-relaxed mb-3">
                    Shastri degree in Ancient Grammar from Sampurnanand Sanskrit University, Varanasi.
                  </p>
                  <p className="text-indigo-700 text-xs leading-relaxed">
                    सम्पूर्णानन्द संस्कृत विश्वविद्यालय, वाराणसी से प्राचीन व्याकरण में शास्त्री की उपाधि प्राप्त की।
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border-l-4 border-indigo-600">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-amber-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-indigo-900">Acharya Degree</h3>
                      <p className="text-indigo-700 text-sm font-semibold">आचार्य उपाधि</p>
                    </div>
                  </div>
                  <p className="text-indigo-800 text-base leading-relaxed mb-3">
                    Acharya degree in Ancient Grammar and Predictive Astrology from Lal Bahadur National Sanskrit University.
                  </p>
                  <p className="text-purple-700 text-xs leading-relaxed">
                    श्री लाल बहादुर राष्ट्रीय संस्कृत विश्वविद्यालय से प्राचीन व्याकरण और फलित ज्योतिष विषयों में आचार्य की उपाधि प्राप्त की।
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border-l-4 border-amber-600">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">🥇</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-900">Gold Medalist</h3>
                      <p className="text-amber-700 text-sm font-semibold">स्वर्ण पदक विजेता</p>
                    </div>
                  </div>
                  <p className="text-amber-800 text-base leading-relaxed mb-3">
                    Gold Medalist in Vedic Astrology (Jyotish Shastra) with highest academic honors.
                  </p>
                  <p className="text-orange-700 text-xs leading-relaxed">
                    वैदिक ज्योतिष शास्त्र में स्वर्ण पदक प्राप्तकर्ता, सर्वोच्च शैक्षणिक सम्मान के साथ।
                  </p>
                </div>
              </div>
            </div>

            {/* Expertise Areas */}
            <div className="mb-10 md:mb-20">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent mb-4">
                  विशेषज्ञता - Areas of Expertise
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-amber-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 text-center hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🔮</span>
                  </div>
                  <h3 className="text-lg font-bold text-purple-900 mb-3">Jyotish Shastra</h3>
                  <p className="text-purple-800 text-base">ज्योतिष शास्त्र - Vedic Astrology & Predictions</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 text-center hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🏛️</span>
                  </div>
                  <h3 className="text-lg font-bold text-indigo-900 mb-3">Vastu Shastra</h3>
                  <p className="text-indigo-800 text-base">वास्तु शास्त्र - Sacred Architecture & Space</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 text-center hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📿</span>
                  </div>
                  <h3 className="text-lg font-bold text-amber-900 mb-3">Karmkand</h3>
                  <p className="text-amber-800 text-base">कर्मकांड - Vedic Rituals & Ceremonies</p>
                </div>
              </div>
            </div>

            {/* Detailed Background */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 border-2 border-purple-200/60">
              <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent mb-8 text-center">
                विस्तृत परिचय - Detailed Background
              </h2>
              
              <div className="space-y-6 md:space-y-8 text-purple-900">
                {/* Early Life & Foundation */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 md:p-6 rounded-2xl border-l-4 border-purple-500">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                    <span className="mr-2">🏛️</span>
                    प्रारंभिक जीवन और आध्यात्मिक नींव - Early Life & Spiritual Foundation
                  </h3>
                  <p className="text-base leading-relaxed mb-4">
                    <strong>हिंदी:</strong> आचार्य सत्य प्रकाश त्रिपाठी की जीवन यात्रा का आरंभ अयोध्या की उस पावन भूमि से हुआ, जहाँ सदियों से वैदिक ज्ञान और सनातन परंपरा का प्रवाह अविरल बह रहा है। उन्होंने अपनी प्रारंभिक शिक्षा वहीं की गुरुकुल परंपरा के कठोर अनुशासन में प्राप्त की, जिसने उनके भीतर वैदिक संस्कारों की गहरी नींव रखी।
                  </p>
                  <p className="text-sm leading-relaxed text-indigo-800">
                    <strong>English:</strong> Acharya Satya Prakash Tripathi's life journey began in the sacred land of Ayodhya, where Vedic knowledge and eternal traditions have been flowing uninterrupted for centuries. He received his early education in the strict discipline of the traditional Gurukul system, which laid a deep foundation of Vedic values and principles within him.
                  </p>
                </div>
                
                {/* Academic Pursuits */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-6 rounded-2xl border-l-4 border-indigo-500">
                  <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
                    <span className="mr-2">📚</span>
                    शैक्षिक यात्रा और उच्च अध्ययन - Academic Journey & Higher Studies
                  </h3>
                  <p className="text-base leading-relaxed mb-4">
                    <strong>हिंदी:</strong> इसके बाद, आधुनिक शिक्षा पद्धति से जुड़ने के लिए आचार्य सत्य प्रकाश त्रिपाठी ने वाराणसी के प्रतिष्ठित सम्पूर्णानन्द संस्कृत विश्वविद्यालय से प्राचीन व्याकरण में शास्त्री की उपाधि प्राप्त की। ज्ञान की इस यात्रा में, श्री लाल बहादुर राष्ट्रीय संस्कृत विश्वविद्यालय से उन्होंने प्राचीन व्याकरण के साथ-साथ फलित ज्योतिष में आचार्य की उपाधि प्राप्त कर अपनी विशेषज्ञता को एक नई दिशा दी।
                  </p>
                  <p className="text-sm leading-relaxed text-purple-800">
                    <strong>English:</strong> Subsequently, to connect with modern educational systems, Acharya Satya Prakash Tripathi obtained his Shastri degree in Ancient Grammar from the prestigious Sampurnanand Sanskrit University, Varanasi. In this journey of knowledge, he earned his Acharya degree in Ancient Grammar and Predictive Astrology from Shri Lal Bahadur National Sanskrit University, giving a new dimension to his expertise.
                  </p>
                </div>

                {/* Deep Study of Scriptures */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 md:p-6 rounded-2xl border-l-4 border-amber-500">
                  <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center">
                    <span className="mr-2">📖</span>
                    शास्त्रों का गहन अध्ययन - Deep Study of Sacred Scriptures
                  </h3>
                  <p className="text-base leading-relaxed mb-4">
                    <strong>हिंदी:</strong> आचार्य सत्य प्रकाश त्रिपाठी के अध्ययन का विस्तार केवल पाठ्यक्रमों तक सीमित नहीं रहा, बल्कि उन्होंने वेद, उपनिषद, श्रीमद्भागवत महापुराण, श्री वाल्मीकि रामायण जैसे अमर ग्रंथों और ज्योतिष-वास्तु के अनेक प्राचीन सूत्रों का भी गहन मंथन किया। इन पवित्र ग्रंथों से प्राप्त ज्ञान ने उनके जीवन दर्शन को आकार दिया और उन्हें जीवन की गहरी सच्चाइयों से अवगत कराया।
                  </p>
                  <p className="text-sm leading-relaxed text-orange-800">
                    <strong>English:</strong> Acharya Tripathi's studies were not limited to formal curriculum alone, but he also conducted deep research into immortal scriptures like the Vedas, Upanishads, Srimad Bhagavat Mahapurana, Shri Valmiki Ramayana, and numerous ancient treatises on Astrology and Vastu. The wisdom gained from these sacred texts shaped his life philosophy and provided him with deep insights into life's profound truths.
                  </p>
                </div>

                {/* Practical Experience & Skills */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 md:p-6 rounded-2xl border-l-4 border-purple-500">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                    <span className="mr-2">⚡</span>
                    व्यावहारिक अनुभव और कौशल - Practical Experience & Skills
                  </h3>
                  <p className="text-base leading-relaxed mb-4">
                    <strong>हिंदी:</strong> पिछले एक दशक से अधिक समय में, आचार्य सत्य प्रकाश त्रिपाठी ने हजारों लोगों को उनकी जीवन की समस्याओं के समाधान प्रदान किए हैं। चाहे वह विवाह संबंधी चुनौतियां हों, व्यवसायिक कठिनाइयाँ हों, स्वास्थ्य संबंधी परेशानियाँ हों या वास्तु दोष - उन्होंने हर क्षेत्र में अपनी विशेषज्ञता का प्रयोग करके लोगों के जीवन में सकारात्मक परिवर्तन लाया है।
                  </p>
                  <p className="text-sm leading-relaxed text-purple-800">
                    <strong>English:</strong> Over the past decade, Acharya Satya Prakash Tripathi has provided solutions to thousands of people for their life problems. Whether it's matrimonial challenges, business difficulties, health concerns, or Vastu defects - he has utilized his expertise in every field to bring positive transformations in people's lives. His approach combines traditional wisdom with practical solutions suitable for modern times.
                  </p>
                </div>
                
                {/* Mission & Dedication */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-2xl border-2 border-purple-400 shadow-xl">
                  <h3 className="text-xl font-bold text-purple-900 mb-6 text-center flex items-center justify-center">
                    <span className="mr-3">🙏</span>
                    मेरा मिशन - My Mission
                  </h3>
                  <p className="text-base leading-relaxed font-semibold mb-4 text-center">
                    <strong>हिंदी:</strong> आज, अपनी इसी ज्योतिष, वास्तु और कर्मकांड की विशेषज्ञता के साथ, आचार्य सत्य प्रकाश त्रिपाठी लोगों के जीवन की चुनौतियों को समझकर उन्हें सही मार्गदर्शन देने और उनके जीवन में सकारात्मक बदलाव लाने के लिए समर्पित हैं। उनका उद्देश्य है कि हर व्यक्ति अपने जीवन में खुशी, शांति और समृद्धि प्राप्त करे।
                  </p>
                  <p className="text-sm leading-relaxed text-indigo-800 text-center">
                    <strong>English:</strong> Today, with his expertise in Astrology, Vastu, and Vedic rituals, Acharya Satya Prakash Tripathi is dedicated to understanding people's life challenges and providing them with proper guidance to bring positive changes in their lives. His goal is that every person achieves happiness, peace, and prosperity in their life through the ancient wisdom of our sacred traditions.
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics - Cosmic Theme */}
            <div className="mt-10 md:mt-20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-xl font-bold">10+</span>
                  </div>
                  <p className="text-sm font-semibold">Years Experience</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-xl font-bold">5K+</span>
                  </div>
                  <p className="text-sm font-semibold">Happy Clients</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-xl font-bold">15+</span>
                  </div>
                  <p className="text-sm font-semibold">Services</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-xl font-bold">24/7</span>
                  </div>
                  <p className="text-sm font-semibold">Available</p>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </>
  )
}

export default About