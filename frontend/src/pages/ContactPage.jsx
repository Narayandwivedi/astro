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
      <section className="pt-32 pb-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 relative overflow-hidden">
        {/* Cosmic stars background */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full cosmic-stars"></div>
        </div>
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-800 via-purple-700 to-amber-700 bg-clip-text text-transparent mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-purple-700 mb-8 font-medium">
              संपर्क करें - Get in Touch with Astro Satya
            </p>
            <p className="text-lg text-purple-600 max-w-3xl mx-auto leading-relaxed">
              Ready to discover what the stars have in store for you? Reach out to Pandit Satya Prakash Tripathi 
              for personalized astrological guidance and solutions to life's challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="py-12 bg-gradient-to-br from-purple-50 via-indigo-50 to-amber-50 border-b border-purple-100 relative overflow-hidden">
        {/* Cosmic stars background */}
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full cosmic-stars"></div>
        </div>
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-800 via-purple-700 to-amber-700 bg-clip-text text-transparent mb-3">
              Get in Touch
            </h2>
            <p className="text-purple-700 mb-6 font-medium">
              संपर्क करें - Connect with Pandit Satya Prakash Tripathi
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Phone Contact */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-2xl text-amber-600">📞</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-800">Phone</h3>
                  <p className="text-xl font-bold text-amber-600">+91 8839453431</p>
                </div>
                <a 
                  href="tel:+918839453431"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* WhatsApp Contact */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-100">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.708"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">WhatsApp</h3>
                  <p className="text-xl font-bold text-green-600">+91 8839453431</p>
                </div>
                <a 
                  href="https://wa.me/918839453431?text=Hello%20Pandit%20Satya%20Prakash%20Tripathi,%0A%0AI%20would%20like%20to%20schedule%20a%20consultation.%20Please%20let%20me%20know%20your%20availability.%0A%0AThank%20you."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg w-full"
                >
                  Chat Now
                </a>
              </div>
            </div>
            
            {/* Email Contact */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-2xl text-purple-600">📧</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800">Email</h3>
                  <p className="text-sm font-semibold text-purple-600">satyaprakashtripathi7578@gmail.com</p>
                </div>
                <a 
                  href="mailto:satyaprakashtripathi7578@gmail.com?subject=Consultation%20Inquiry&body=Hello%20Pandit%20Satya%20Prakash%20Tripathi,%0A%0AI%20would%20like%20to%20schedule%20a%20consultation.%20Please%20let%20me%20know%20your%20availability.%0A%0AThank%20you."
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full"
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

      {/* Contact Form Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 relative overflow-hidden">
        {/* Cosmic stars background */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full cosmic-stars"></div>
        </div>
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-100 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-800 via-purple-700 to-amber-700 bg-clip-text text-transparent mb-4">Send us a Message</h2>
                <p className="text-lg text-purple-600">
                  Connect with renowned astrologer Pandit Satya Prakash Tripathi for expert guidance 
                  on all aspects of life through the ancient wisdom of Vedic astrology.
                </p>
              </div>
              
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
                      className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
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
                      className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
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
                  className="w-full bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 hover:from-purple-800 hover:via-indigo-700 hover:to-amber-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900 relative overflow-hidden">
        {/* Cosmic stars background */}
        <div className="absolute inset-0 opacity-25">
          <div className="w-full h-full cosmic-stars"></div>
        </div>
        <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for Your Consultation?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Don't wait for tomorrow's uncertainty. Get clarity today with expert astrological guidance 
            from Pandit Satya Prakash Tripathi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+918839453431"
              className="bg-white text-purple-700 font-semibold px-8 py-4 rounded-lg hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center border-2 border-purple-200"
            >
              📞 Call Now: +91 8839453431
            </a>
            <a
              href="https://wa.me/918839453431?text=Hello%20Pandit%20Satya%20Prakash%20Tripathi,%0A%0AI%20would%20like%20to%20schedule%20a%20consultation.%20Please%20let%20me%20know%20your%20availability.%0A%0AThank%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-green-700 transition-colors shadow-lg inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.708"/>
              </svg>
              WhatsApp Chat
            </a>
            <a
              href="mailto:satyaprakashtripathi7578@gmail.com"
              className="bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 hover:from-purple-800 hover:via-indigo-700 hover:to-amber-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center"
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