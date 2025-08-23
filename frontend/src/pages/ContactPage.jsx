import React, { useState } from 'react';
import Navigation from '../components/Navigation';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="w-full">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              संपर्क करें - Get in Touch with Astro Satya
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ready to discover what the stars have in store for you? Reach out to Pandit Satya Prakash Tripathi 
              for personalized astrological guidance and solutions to life's challenges.
            </p>
          </div>
        </div>
      </section>

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

      {/* Contact Information & Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Connect with renowned astrologer Pandit Satya Prakash Tripathi for expert guidance 
                  on all aspects of life through the ancient wisdom of Vedic astrology.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                
                {/* Phone Contact */}
                <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl text-orange-600">📞</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone Consultation</h3>
                      <p className="text-gray-600 mb-3">
                        Call for immediate consultation and guidance
                      </p>
                      <a 
                        href="tel:+91883945431" 
                        className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        +91 883945431
                      </a>
                      <p className="text-sm text-gray-500 mt-2">
                        Available: 9:00 AM - 8:00 PM (IST)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Contact */}
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl text-blue-600">📧</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Consultation</h3>
                      <p className="text-gray-600 mb-3">
                        Send your queries and birth details for detailed analysis
                      </p>
                      <a 
                        href="mailto:astrosatya@gmail.com" 
                        className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors break-all"
                      >
                        astrosatya@gmail.com
                      </a>
                      <p className="text-sm text-gray-500 mt-2">
                        Response within 24 hours
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services Offered */}
                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl text-yellow-600">🕉️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Services Available</h3>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Horoscope Reading & Analysis</li>
                        <li>• Marriage & Love Compatibility</li>
                        <li>• Career & Business Guidance</li>
                        <li>• Health & Wellness Predictions</li>
                        <li>• Gemstone & Remedies Consultation</li>
                        <li>• Muhurat & Auspicious Timing</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select consultation type</option>
                    <option value="horoscope">Horoscope Reading</option>
                    <option value="marriage">Marriage & Love</option>
                    <option value="career">Career Guidance</option>
                    <option value="health">Health & Wellness</option>
                    <option value="financial">Financial Planning</option>
                    <option value="family">Family Problems</option>
                    <option value="gemstone">Gemstone Consultation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Please describe your question or concern. Include your birth details (date, time, place) if seeking astrological consultation."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-yellow-600">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for Your Consultation?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Don't wait for tomorrow's uncertainty. Get clarity today with expert astrological guidance 
            from Pandit Satya Prakash Tripathi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+91883945431"
              className="bg-white text-orange-600 font-semibold px-8 py-4 rounded-lg hover:bg-orange-50 transition-colors shadow-lg inline-flex items-center justify-center"
            >
              📞 Call Now: +91 883945431
            </a>
            <a
              href="mailto:astrosatya@gmail.com"
              className="bg-orange-700 text-white font-semibold px-8 py-4 rounded-lg hover:bg-orange-800 transition-colors shadow-lg inline-flex items-center justify-center"
            >
              📧 Email Consultation
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;