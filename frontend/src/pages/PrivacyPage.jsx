import React from 'react';
import Navigation from '../components/Navigation';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-amber-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg">
            Your privacy is important to us. Learn how we protect your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: December 24, 2024
          </p>
        </div>

        {/* Privacy Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Astro Satya Prakash ("we," "our," or "us") operates the website <strong>astrosatyaprakash.com</strong>.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit
              our website or use our services. We are committed to protecting your privacy and handling your personal
              information with care and transparency.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">2. Information We Collect</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">2.1 Personal Information</h3>
                <p className="text-gray-700 mb-2">We may collect the following personal information:</p>
                <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                  <li>Full name and contact details (email, phone number)</li>
                  <li>Birth details (date, time, and place of birth for astrological services)</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by third-party payment processors)</li>
                  <li>Account login credentials</li>
                  <li>Communication preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">2.2 Astrological Information</h3>
                <p className="text-gray-700 mb-2">For consultation services, we collect:</p>
                <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                  <li>Birth chart details (date, time, place of birth)</li>
                  <li>Family information relevant to consultations</li>
                  <li>Specific questions and concerns for guidance</li>
                  <li>Previous consultation history and preferences</li>
                  <li>Health and life situation details (when relevant to consultation)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">2.3 Technical Information</h3>
                <p className="text-gray-700 mb-2">We automatically collect:</p>
                <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Geographic location (with your consent)</li>
                  <li>Referral source (how you found our website)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">3. How We Use Your Information</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">3.1 Service Delivery</h3>
                <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                  <li>Provide astrological consultations and readings</li>
                  <li>Generate birth charts and horoscopes</li>
                  <li>Process orders and deliver products</li>
                  <li>Schedule appointments and send reminders</li>
                  <li>Provide customer support and respond to inquiries</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">3.2 Communication</h3>
                <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                  <li>Send service confirmations and updates</li>
                  <li>Share astrological insights and educational content</li>
                  <li>Notify about new services and special offers</li>
                  <li>Send newsletters (with your consent)</li>
                  <li>Respond to your questions and feedback</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">3.3 Business Operations</h3>
                <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                  <li>Process payments and manage billing</li>
                  <li>Maintain user accounts and preferences</li>
                  <li>Improve our website and services</li>
                  <li>Analyze usage patterns and trends</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Special Protection for Astrological Data */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">4. Protection of Astrological Data</h2>
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Sacred Information Handling</h3>
              <div className="text-amber-700 space-y-2">
                <p>
                  We understand that astrological information, including birth details and personal concerns,
                  is highly sensitive and sacred. We commit to:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Keep all birth details and consultation records strictly confidential</li>
                  <li>Never share your astrological data with third parties without explicit consent</li>
                  <li>Store birth charts and readings securely with encryption</li>
                  <li>Use astrological information solely for providing services to you</li>
                  <li>Allow you to request deletion of your astrological data at any time</li>
                  <li>Maintain the sanctity and privacy of spiritual consultations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">5. Information Sharing and Disclosure</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">5.1 We Do Not Sell Personal Information</h3>
                <p className="text-gray-700">
                  We do not sell, trade, or rent your personal information to third parties. Your astrological
                  data and personal details remain confidential.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">5.2 Limited Sharing</h3>
                <p className="text-gray-700 mb-2">We may share information only in these specific circumstances:</p>
                <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                  <li><strong>Service Providers:</strong> Payment processors, shipping companies, email services</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfer:</strong> In case of merger or acquisition (with privacy protections)</li>
                  <li><strong>Your Consent:</strong> When you explicitly authorize sharing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">6. Data Security</h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                We implement robust security measures to protect your information:
              </p>
              <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                <li>SSL encryption for all data transmission</li>
                <li>Secure servers with firewall protection</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information by authorized personnel only</li>
                <li>Secure backup and recovery procedures</li>
                <li>Two-factor authentication for admin accounts</li>
              </ul>
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p className="text-purple-800">
                  <strong>Note:</strong> While we implement strong security measures, no internet transmission
                  is 100% secure. We cannot guarantee absolute security but are committed to protecting your data
                  with industry-standard practices.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">7. Cookies and Tracking Technologies</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">7.1 Types of Cookies We Use</h3>
                <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                  <li><strong>Essential Cookies:</strong> Required for website functionality and security</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and language preferences</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                  <li><strong>Marketing Cookies:</strong> Show relevant advertisements and track campaigns</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">7.2 Managing Cookies</h3>
                <p className="text-gray-700">
                  You can control cookies through your browser settings. However, disabling essential cookies
                  may affect website functionality. We respect your choices regarding non-essential cookies.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">8. Your Privacy Rights</h2>
            <div className="space-y-3">
              <p className="text-gray-700">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                <li><strong>Access:</strong> Request a copy of your personal information we hold</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Objection:</strong> Object to processing for marketing purposes</li>
                <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
                <li><strong>Withdrawal:</strong> Withdraw consent at any time (where consent is the legal basis)</li>
              </ul>

              <div className="bg-indigo-50 p-4 rounded-lg mt-4">
                <p className="text-indigo-800">
                  <strong>How to Exercise Your Rights:</strong> Contact us at satyaprakashtripathi7578@gmail.com
                  or +91-8839453431. We will respond to your request within 30 days.
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">9. Data Retention</h2>
            <div className="space-y-3">
              <p className="text-gray-700">We retain your information for the following periods:</p>
              <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                <li><strong>Account Information:</strong> Until account deletion or 2 years of inactivity</li>
                <li><strong>Consultation Records:</strong> 7 years for reference purposes (or until you request deletion)</li>
                <li><strong>Transaction Records:</strong> 7 years for tax and legal compliance</li>
                <li><strong>Marketing Data:</strong> Until you unsubscribe or object to processing</li>
                <li><strong>Website Analytics:</strong> 26 months (Google Analytics standard)</li>
              </ul>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">10. Children's Privacy</h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                Our services are intended for adults (18 years and older). We do not knowingly collect personal
                information from children under 18. If you are a parent or guardian and believe your child has
                provided us with personal information, please contact us immediately.
              </p>
              <p className="text-gray-700">
                For consultations involving minors, we require explicit parental consent and the presence of
                a parent or guardian during consultations.
              </p>
            </div>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">11. International Data Transfers</h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                Our website and services are based in India. If you access our services from outside India,
                your information may be transferred to and processed in India. We ensure appropriate safeguards
                are in place for international data transfers.
              </p>
            </div>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">12. Third-Party Links and Services</h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                Our website may contain links to third-party websites or services (payment processors, social media,
                etc.). This Privacy Policy does not apply to third-party sites. We encourage you to review their
                privacy policies before providing personal information.
              </p>
            </div>
          </section>

          {/* Updates to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">13. Updates to This Privacy Policy</h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal
                requirements. We will notify you of significant changes by email or through a prominent notice
                on our website. The "Last updated" date at the top indicates the latest revision.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">14. Contact Us</h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal information,
                please contact us:
              </p>
              <div className="bg-purple-50 p-6 rounded-lg mt-4">
                <div className="space-y-2">
                  <p><strong>Astro Satya Prakash</strong></p>
                  <p><strong>Data Protection Officer: Acharya Satya Prakash Tripathi</strong></p>
                  <p><strong>Email:</strong> satyaprakashtripathi7578@gmail.com</p>
                  <p><strong>Phone:</strong> +91-8839453431</p>
                  <p><strong>Website:</strong> astrosatyaprakash.com</p>
                  <p><strong>Address:</strong> Varanasi, Uttar Pradesh, India</p>
                </div>
              </div>
            </div>
          </section>

          {/* Consent Statement */}
          <section className="border-t pt-6">
            <div className="bg-gradient-to-r from-purple-50 to-amber-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Your Consent</h3>
              <p className="text-purple-700">
                By using our website and services, you consent to the collection and use of your information
                as described in this Privacy Policy. If you do not agree with our privacy practices,
                please do not use our services.
              </p>
              <p className="text-purple-700 mt-3">
                <strong>For Consultations:</strong> By booking a consultation, you explicitly consent to sharing
                your birth details and personal information necessary for astrological analysis.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;