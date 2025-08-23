import React from 'react'
import Navigation from '../components/Navigation'

const About = () => {
  return (
    <>
      <Navigation />
      <div className="w-full">
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="/astro chart.png" 
              alt="Astrology Chart" 
              className="w-full h-full object-cover"
              style={{
                filter: 'sepia(100%) saturate(150%) hue-rotate(25deg) brightness(0.7) contrast(1.2)'
              }}
            />
          </div>
          
          {/* Traditional Pattern Overlay */}
          <div className="absolute inset-0 opacity-8">
            <div className="w-full h-full" style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, rgba(139,69,19,0.15) 0px, rgba(139,69,19,0.15) 2px, transparent 2px, transparent 25px),
                repeating-linear-gradient(-45deg, rgba(160,82,45,0.1) 0px, rgba(160,82,45,0.1) 2px, transparent 2px, transparent 25px)
              `
            }}></div>
          </div>
          
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-500/30 to-orange-500/30 backdrop-blur-sm border border-yellow-400/40 rounded-full px-8 py-3 mb-8 shadow-2xl">
                <span className="text-yellow-200 text-sm font-semibold">🕉️ About Acharya</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300">Acharya Satya Prakash Tripathi</span>
              </h1>
              <p className="text-xl md:text-2xl text-orange-100 mb-8 font-medium drop-shadow-lg">
                आचार्य सत्य प्रकाश त्रिपाठी के बारे में
              </p>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
          <div className="container mx-auto px-4 lg:px-6">
            
            {/* Introduction with Photo */}
            <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
              <div className="lg:flex-1">
                <div className="relative">
                  <div className="w-80 h-80 mx-auto rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-full p-2">
                      <img 
                        src="/satya2.webp" 
                        alt="Acharya Satya Prakash Tripathi" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl -z-10"></div>
                </div>
              </div>
              
              <div className="lg:flex-1">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-amber-200/60">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-orange-800 bg-clip-text text-transparent mb-6">
                    परिचय - Introduction
                  </h2>
                  <p className="text-amber-900 text-lg leading-relaxed mb-6">
                    ज्योतिष एवं वास्तु के गहन अध्येता के रूप में, मैंने अपनी प्रारंभिक शिक्षा अयोध्या की गुरुकुल परंपरा में ग्रहण की।
                  </p>
                  <p className="text-amber-800 text-base leading-relaxed">
                    As a profound scholar of Astrology and Vastu, I received my foundational education in the traditional Gurukul system of Ayodhya, where ancient wisdom and sacred knowledge have been preserved for centuries.
                  </p>
                </div>
              </div>
            </div>

            {/* Educational Journey */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-orange-800 bg-clip-text text-transparent mb-4">
                  शैक्षिक यात्रा - Educational Journey
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-amber-600">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">🎓</span>
                    </div>
                    <h3 className="text-xl font-bold text-amber-900">Shastri Degree</h3>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    वाराणसी के प्रतिष्ठित सम्पूर्णानन्द संस्कृत विश्वविद्यालय से प्राचीन व्याकरण में शास्त्री की उपाधि प्राप्त की।
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-yellow-600">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">🎯</span>
                    </div>
                    <h3 className="text-xl font-bold text-amber-900">Acharya Degree</h3>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    श्री लाल बहादुर राष्ट्रीय संस्कृत विश्वविद्यालय से प्राचीन व्याकरण और फलित ज्योतिष विषयों में आचार्य की उपाधि प्राप्त की।
                  </p>
                </div>
              </div>
            </div>

            {/* Expertise Areas */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-orange-800 bg-clip-text text-transparent mb-4">
                  विशेषज्ञता - Areas of Expertise
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🔮</span>
                  </div>
                  <h3 className="text-xl font-bold text-amber-900 mb-3">Jyotish Shastra</h3>
                  <p className="text-amber-800">ज्योतिष शास्त्र - Vedic Astrology & Predictions</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🏛️</span>
                  </div>
                  <h3 className="text-xl font-bold text-amber-900 mb-3">Vastu Shastra</h3>
                  <p className="text-amber-800">वास्तु शास्त्र - Sacred Architecture & Space</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📿</span>
                  </div>
                  <h3 className="text-xl font-bold text-amber-900 mb-3">Karmkand</h3>
                  <p className="text-amber-800">कर्मकांड - Vedic Rituals & Ceremonies</p>
                </div>
              </div>
            </div>

            {/* Detailed Background */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-amber-200/60">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-orange-800 bg-clip-text text-transparent mb-8 text-center">
                विस्तृत परिचय - Detailed Background
              </h2>
              
              <div className="space-y-6 text-amber-900">
                <p className="text-lg leading-relaxed">
                  मेरी जीवन यात्रा का आरंभ अयोध्या की उस पावन भूमि से हुआ, जहाँ सदियों से वैदिक ज्ञान और सनातन परंपरा का प्रवाह अविरल बह रहा है। मैंने अपनी प्रारंभिक शिक्षा वहीं की गुरुकुल परंपरा के कठोर अनुशासन में प्राप्त की, जिसने मेरे भीतर वैदिक संस्कारों की गहरी नींव रखी।
                </p>
                
                <p className="text-lg leading-relaxed">
                  इसके बाद, आधुनिक शिक्षा पद्धति से जुड़ने के लिए मैंने वाराणसी के प्रतिष्ठित सम्पूर्णानन्द संस्कृत विश्वविद्यालय से प्राचीन व्याकरण में शास्त्री की उपाधि प्राप्त की। ज्ञान की इस यात्रा में, श्री लाल बहादुर राष्ट्रीय संस्कृत विश्वविद्यालय से मैंने प्राचीन व्याकरण के साथ-साथ फलित ज्योतिष में आचार्य की उपाधि प्राप्त कर अपनी विशेषज्ञता को एक नई दिशा दी।
                </p>
                
                <p className="text-lg leading-relaxed">
                  मेरे अध्ययन का विस्तार केवल पाठ्यक्रमों तक सीमित नहीं रहा, बल्कि मैंने वेद, उपनिषद, श्रीमद्भागवत महापुराण, श्री वाल्मीकि रामायण जैसे अमर ग्रंथों और ज्योतिष-वास्तु के अनेक प्राचीन सूत्रों का भी गहन मंथन किया।
                </p>
                
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border-l-4 border-amber-600">
                  <p className="text-lg leading-relaxed font-semibold">
                    आज, अपनी इसी ज्योतिष, वास्तु और कर्मकांड की विशेषज्ञता के साथ, मैं लोगों के जीवन की चुनौतियों को समझकर उन्हें सही मार्गदर्शन देने और उनके जीवन में सकारात्मक बदलाव लाने के लिए समर्पित हूँ।
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="mt-20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">10+</span>
                  </div>
                  <p className="text-amber-900 font-semibold">Years Experience</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">5K+</span>
                  </div>
                  <p className="text-amber-900 font-semibold">Happy Clients</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">15+</span>
                  </div>
                  <p className="text-amber-900 font-semibold">Services</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">24/7</span>
                  </div>
                  <p className="text-amber-900 font-semibold">Available</p>
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