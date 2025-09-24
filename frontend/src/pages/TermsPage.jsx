import React from 'react';
import Navigation from '../components/Navigation';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-amber-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 text-lg">
            Please read these terms carefully before using our services
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: December 24, 2024
          </p>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Astro Satya Prakash ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our website
              <strong> astrosatyaprakash.com</strong> and the purchase of our products and services. By accessing or using our website,
              you agree to be bound by these Terms. If you do not agree with any part of these terms, you may not use our services.
            </p>
          </section>

          {/* Services Description */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">2. Services Description</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>Astro Satya Prakash provides the following services:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Vedic astrology consultations and readings</li>
                <li>Kundali (birth chart) analysis and predictions</li>
                <li>Marriage compatibility and timing consultations</li>
                <li>Business and career guidance through astrology</li>
                <li>Vastu Shastra consultations</li>
                <li>Gemstone and Rudraksha recommendations and sales</li>
                <li>Spiritual guidance and remedial solutions</li>
                <li>Online astrology products and educational materials</li>
              </ul>
            </div>
          </section>

          {/* Consultation Services */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">3. Consultation Services</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <h3 className="text-lg font-semibold text-purple-700">3.1 Nature of Services</h3>
              <p>
                Our astrology consultations are based on traditional Vedic astrology principles and are intended for guidance,
                entertainment, and educational purposes. All predictions and advice are based on astrological calculations and
                should not be considered as absolute truth or medical/legal advice.
              </p>

              <h3 className="text-lg font-semibold text-purple-700">3.2 Booking and Scheduling</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Consultations must be booked through our website or authorized channels</li>
                <li>Payment must be completed at the time of booking</li>
                <li>Appointment times are subject to availability</li>
                <li>We reserve the right to reschedule appointments with 24-hour notice</li>
              </ul>

              <h3 className="text-lg font-semibold text-purple-700">3.3 Cancellation Policy</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Cancellations must be made at least 24 hours before the scheduled appointment</li>
                <li>Refunds for cancellations will be processed within 5-7 business days</li>
                <li>No-shows or cancellations within 24 hours are non-refundable</li>
                <li>Emergency cancellations will be considered on a case-by-case basis</li>
              </ul>
            </div>
          </section>

          {/* E-commerce Terms */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">4. E-commerce Terms</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <h3 className="text-lg font-semibold text-purple-700">4.1 Product Information</h3>
              <p>
                We strive to provide accurate descriptions and images of our products (gemstones, rudraksha, books, etc.).
                However, actual products may vary slightly in appearance due to natural variations and screen display differences.
              </p>

              <h3 className="text-lg font-semibold text-purple-700">4.2 Pricing and Payment</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>All prices are listed in Indian Rupees (INR) unless otherwise specified</li>
                <li>Prices are subject to change without notice</li>
                <li>Payment must be completed before product dispatch or service delivery</li>
                <li>We accept major credit cards, debit cards, UPI, and other payment methods as displayed</li>
              </ul>

              <h3 className="text-lg font-semibold text-purple-700">4.3 Shipping and Delivery</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Shipping costs and delivery times vary by location and will be displayed at checkout</li>
                <li>We are not responsible for delays caused by courier services or customs</li>
                <li>Risk of loss transfers to the buyer upon delivery to the carrier</li>
                <li>International shipping may be subject to customs duties and taxes</li>
              </ul>

              <h3 className="text-lg font-semibold text-purple-700">4.4 Returns and Refunds</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Physical products can be returned within 7 days of delivery if unused and in original packaging</li>
                <li>Digital products and completed consultations are non-refundable</li>
                <li>Gemstones and spiritual items may have specific return conditions due to their sacred nature</li>
                <li>Return shipping costs are borne by the customer unless the item was defective</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">5. Disclaimers and Limitations</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <h3 className="text-lg font-semibold text-purple-700">5.1 Astrological Guidance</h3>
              <p>
                <strong>IMPORTANT:</strong> Astrological consultations are for guidance and entertainment purposes only.
                They should not replace professional medical, legal, financial, or psychological advice. We do not guarantee
                the accuracy of predictions or the achievement of specific outcomes.
              </p>

              <h3 className="text-lg font-semibold text-purple-700">5.2 Personal Responsibility</h3>
              <p>
                Users are solely responsible for their decisions and actions. We encourage you to use your own judgment
                and consult with appropriate professionals for important life decisions.
              </p>

              <h3 className="text-lg font-semibold text-purple-700">5.3 Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, Astro Satya Prakash shall not be liable for any indirect,
                incidental, special, or consequential damages arising from the use of our services or products.
              </p>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">6. User Responsibilities</h2>
            <div className="text-gray-700 leading-relaxed">
              <p>By using our services, you agree to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-3">
                <li>Provide accurate and complete information for consultations</li>
                <li>Respect the astrologer's time and expertise</li>
                <li>Not record consultations without explicit permission</li>
                <li>Use our website and services in compliance with applicable laws</li>
                <li>Not share login credentials or account access with others</li>
                <li>Maintain the confidentiality of any proprietary information shared</li>
              </ul>
            </div>
          </section>

          {/* Privacy and Data Protection */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">7. Privacy and Data Protection</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>
                We take your privacy seriously. Personal information collected during consultations and purchases
                will be kept confidential and used only for service delivery purposes. Birth details and consultation
                records are stored securely and not shared with third parties without your consent.
              </p>
              <p>
                For complete details on how we collect, use, and protect your information, please refer to our
                Privacy Policy.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">8. Intellectual Property</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>
                All content on this website, including text, images, logos, and consultation materials, is the
                intellectual property of Astro Satya Prakash or used with permission. Users may not reproduce,
                distribute, or create derivative works without written permission.
              </p>
            </div>
          </section>

          {/* Prohibited Uses */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">9. Prohibited Uses</h2>
            <div className="text-gray-700 leading-relaxed">
              <p>You may not use our website or services to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-3">
                <li>Violate any laws or regulations</li>
                <li>Harass, abuse, or harm others</li>
                <li>Transmit malicious code or engage in hacking</li>
                <li>Impersonate others or provide false information</li>
                <li>Engage in commercial activities without permission</li>
                <li>Interfere with the proper functioning of the website</li>
              </ul>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">10. Modifications to Terms</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective immediately
                upon posting on our website. Continued use of our services after changes constitutes acceptance
                of the modified Terms.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">11. Governing Law and Jurisdiction</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>
                These Terms are governed by the laws of India. Any disputes arising from these Terms or the use
                of our services shall be subject to the exclusive jurisdiction of the courts in Varanasi,
                Uttar Pradesh, India.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">12. Contact Information</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>For questions about these Terms or our services, please contact us:</p>
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p><strong>Astro Satya Prakash</strong></p>
                <p><strong>Acharya Satya Prakash Tripathi</strong></p>
                <p>Email: satyaprakashtripathi7578@gmail.com</p>
                <p>Phone: +91-8839453431</p>
                <p>Website: astrosatyaprakash.com</p>
                <p>Address: Varanasi, Uttar Pradesh, India</p>
              </div>
            </div>
          </section>

          {/* Acceptance */}
          <section className="border-t pt-6">
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Acceptance of Terms</h3>
              <p className="text-amber-700">
                By using our website and services, you acknowledge that you have read, understood, and agree to be
                bound by these Terms and Conditions. If you do not agree with these Terms, please discontinue use
                of our services immediately.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;