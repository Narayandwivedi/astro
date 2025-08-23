import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Navigation from '../components/Navigation'

const Homepage = () => {
  return (
    <div className="w-full">
      <Navigation />
      <Hero />

      {/* Get in Touch Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-6">
              संपर्क करें - Connect with Pandit Satya Prakash Tripathi
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Phone Contact */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-orange-600">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                    <p className="text-xl font-bold text-orange-600">+91 883945431</p>
                  </div>
                </div>
                <a 
                  href="tel:+91883945431"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg text-center"
                >
                  Call Now
                </a>
              </div>
            </div>
            
            {/* Email Contact */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-blue-600">📧</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                    <p className="text-sm font-semibold text-blue-600 break-all">astrosatya@gmail.com</p>
                  </div>
                </div>
                <a 
                  href="mailto:astrosatya@gmail.com?subject=Consultation%20Inquiry&body=Hello%20Pandit%20Satya%20Prakash%20Tripathi,%0A%0AI%20would%20like%20to%20schedule%20a%20consultation.%20Please%20let%20me%20know%20your%20availability.%0A%0AThank%20you."
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg text-center"
                >
                  Email Now
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Available: 9:00 AM - 8:00 PM (IST) | Response within 24 hours
            </p>
          </div>
        </div>
      </section>

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
            <Link 
              to="/services"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
