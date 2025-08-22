import React from 'react'
import Hero from '../components/Hero'

const Homepage = () => {
  return (
    <div className="w-full">
      <Hero />

      {/* Our Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              हमारी सेवाएं - जीवन की हर समस्या का समाधान
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Service Card 1 */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-orange-600">🔮</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Horoscope Reading</h3>
                <p className="text-gray-600 text-sm">कुंडली विश्लेषण</p>
              </div>
              <p className="text-gray-600 text-center leading-relaxed">
                Complete birth chart analysis with detailed predictions about your future, career, and relationships.
              </p>
            </div>

            {/* Service Card 2 */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-orange-600">💕</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Love & Marriage</h3>
                <p className="text-gray-600 text-sm">प्रेम और विवाह</p>
              </div>
              <p className="text-gray-600 text-center leading-relaxed">
                Find your perfect match, resolve love problems, and get guidance for a happy married life.
              </p>
            </div>

            {/* Service Card 3 */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-orange-600">💼</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Career Guidance</h3>
                <p className="text-gray-600 text-sm">करियर मार्गदर्शन</p>
              </div>
              <p className="text-gray-600 text-center leading-relaxed">
                Get insights about your career path, job changes, business opportunities, and professional growth.
              </p>
            </div>

            {/* Service Card 4 */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-orange-600">💰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Financial Planning</h3>
                <p className="text-gray-600 text-sm">वित्तीय नियोजन</p>
              </div>
              <p className="text-gray-600 text-center leading-relaxed">
                Wealth predictions, investment guidance, and solutions for financial problems and prosperity.
              </p>
            </div>

            {/* Service Card 5 */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-orange-600">🏥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Health & Wellness</h3>
                <p className="text-gray-600 text-sm">स्वास्थ्य और कल्याण</p>
              </div>
              <p className="text-gray-600 text-center leading-relaxed">
                Health predictions, remedies for chronic illnesses, and guidance for overall well-being.
              </p>
            </div>

            {/* Service Card 6 */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-orange-600">🏠</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Family Problems</h3>
                <p className="text-gray-600 text-sm">पारिवारिक समस्याएं</p>
              </div>
              <p className="text-gray-600 text-center leading-relaxed">
                Resolve family disputes, improve relationships, and bring harmony to your household.
              </p>
            </div>

          </div>

          <div className="text-center mt-12">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-4 rounded-lg transition-colors shadow-lg">
              View All Services
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
