"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const legalData = [
    {
        title: "Terms & Conditions",
        content: (
            <div className="space-y-4 text-sm text-mutedgray leading-relaxed">
                <p><strong>Last Updated:</strong> March 17, 2026</p>
                <p>Welcome to <strong>Menyu</strong> (the "Service"). By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions.</p>
                
                <div>
                    <h4 className="font-bold text-warm-900 mb-1">1. Acceptance of Terms</h4>
                    <p>By scanning a Menyu QR code or accessing our website, you (the "User") agree to these Terms and Conditions. If you do not agree, please do not use the Service.</p>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">2. Service Description</h4>
                    <p>Menyu provides a digital menu platform that facilitates:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Viewing restaurant menus.</li>
                        <li>Adding items to a virtual cart.</li>
                        <li>Generating pre-filled WhatsApp messages for order submission.</li>
                        <li>Facilitating UPI payment redirects.</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">3. User Responsibilities</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li><strong>Accuracy of Orders:</strong> You are responsible for ensuring the items and quantities in your cart are correct before submitting an order.</li>
                        <li><strong>Payment:</strong> Menyu facilitates the initiation of a payment via UPI. You are responsible for completing the transaction within your chosen UPI application.</li>
                        <li><strong>Lawful Use:</strong> You agree not to use the Service for any fraudulent or malicious activity, including spamming API endpoints or attempting to bypass security features.</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">4. Accuracy of Information</h4>
                    <p>Menu items, prices, ingredients, and nutritional information are provided by the restaurants. Menyu does not guarantee the accuracy, completeness, or timeliness of this information.</p>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">5. Restaurant Interaction & Orders</h4>
                    <p>Menyu is a technology platform and does not own, operate, or manage any listed restaurant. Menyu does not process, prepare, or deliver food. All orders are handled directly between the customer and the restaurant. Any disputes regarding food quality, incorrect orders, or service should be directed to the Restaurant management.</p>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">6. Intellectual Property</h4>
                    <p>All content, design, software, and underlying code associated with the Service are the property of Menyu or its licensors and are protected by applicable intellectual property laws. You may not copy, modify, or distribute any part of the Service without prior written consent.</p>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">7. Availability & Modifications</h4>
                    <p>We do not guarantee uninterrupted or error-free access to the platform. Access may be suspended for maintenance or technical issues. We reserve the right to modify or discontinue the Service (or any part thereof) with or without notice at any time.</p>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">8. Limitation of Liability</h4>
                    <p>To the maximum extent permitted by law, Menyu shall not be liable for any damages (direct or indirect) arising from the use of the platform, including but not limited to:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Incorrect orders or delivery delays.</li>
                        <li>Food quality, safety, or hygiene issues.</li>
                        <li>Payment disputes, failures, or refunds.</li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        title: "Privacy Policy",
        content: (
            <div className="space-y-4 text-sm text-mutedgray leading-relaxed">
                <p><strong>Last Updated:</strong> March 17, 2026</p>
                <p>Your privacy is important to us. This policy explains how Menyu collects, uses, and protects your information.</p>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">1. Information We Collect</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li><strong>Technical & Usage Data:</strong> We may collect basic technical information (e.g., IP address, browser type, page visits) to improve service performance and analyze usage.</li>
                        <li><strong>Session Data:</strong> We use <code>localStorage</code> and <code>sessionStorage</code> on your device to maintain your cart and session state. This data is not used for cross-site tracking.</li>
                        <li><strong>Table Numbers:</strong> We store table numbers provided via QR code URLs to associate orders with specific locations within a restaurant.</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">2. How We Use Your Information</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>To facilitate order placement via WhatsApp.</li>
                        <li>To provide restaurants with anonymized analytics (e.g., popular items, peak scan times).</li>
                        <li>To detect and prevent fraudulent activity.</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">3. Third-Party Services</h4>
                    <p>Payments and messaging (WhatsApp, UPI apps) are handled by third-party platforms. Menyu does not control their data practices or privacy policies. We are not responsible for how these third parties handle your information.</p>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">4. Data Sharing</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li><strong>Restaurants:</strong> We share your order details (items, total, table number) with the restaurant you are ordering from.</li>
                        <li><strong>No Sale of Data:</strong> We do not sell or share personal data with third-party advertisers.</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">5. Security</h4>
                    <p>We take reasonable steps to protect your data using industry-standard measures (e.g., rate limiting, encryption), but we cannot guarantee absolute security against all unauthorized access.</p>
                </div>
            </div>
        )
    },
    {
        title: "Disclaimer",
        content: (
            <div className="space-y-4 text-sm text-mutedgray leading-relaxed">
                <p className="font-bold text-red-600 italic uppercase">IMPORTANT: PLEASE READ CAREFULLY</p>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">1. No Responsibility for Payments</h4>
                    <p>Menyu provides a redirect to your preferred UPI application. We <strong>do not</strong> process payments directly and <strong>do not</strong> have access to your bank details or transaction status. Any issues regarding payment failure, disputes, or refunds must be resolved directly between the User, the Restaurant, and the respective Bank/UPI Provider.</p>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">2. No Responsibility for Food, Quality & Safety</h4>
                    <p>Menyu does not guarantee the quality, safety, or hygiene of food served by restaurants. All food preparation and service are the sole responsibility of the Restaurant.</p>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">3. Nutritional Information & Ingredients</h4>
                    <p>Nutritional values and ingredient information are approximate and provided for general guidance only. This information is <strong>not medical advice</strong> and should not be relied upon as such.</p>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">4. Allergies & Dietary Restrictions</h4>
                    <p>Customers must inform the restaurant directly about any allergies or dietary restrictions before placing an order. Menyu is not liable for any health issues arising from dietary inaccuracies.</p>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">5. Third-Party Links & Failures</h4>
                    <p>Our Service contains links to third-party applications (WhatsApp, UPI apps). We are not responsible for the content, uptime, or technical failures of these third-party platforms.</p>
                </div>

                <div>
                    <h4 className="font-bold text-warm-900 mb-1">6. "As-Is" Basis</h4>
                    <p>The Service is provided on an "as-is" and "as-available" basis. By using this platform, you agree that Menyu is not liable for any direct or indirect damages arising from the use of the service.</p>
                </div>
            </div>
        )
    }
];

export default function LegalSections() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-12 bg-white pb-24 border-t border-warm-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div data-animate className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading text-warm-900">
                        Legal <span className="text-shimmer">Information</span>
                    </h2>
                    <p className="mt-2 text-mutedgray text-sm">
                        Please review our policies and terms for a transparent experience.
                    </p>
                </div>

                <div className="space-y-4">
                    {legalData.map((item, index) => (
                        <div 
                            key={index}
                            className="border border-warm-200/60 rounded-2xl overflow-hidden bg-alabaster/50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left group transition-colors"
                            >
                                <h3 className={`text-lg font-bold font-heading transition-colors ${activeIndex === index ? 'text-teal-700' : 'text-warm-900 group-hover:text-teal-600'}`}>
                                    {item.title}
                                </h3>
                                <motion.div
                                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className={`text-xl ${activeIndex === index ? 'text-teal-700' : 'text-warm-400 group-hover:text-teal-500'}`}
                                >
                                    <FiChevronDown />
                                </motion.div>
                            </button>

                            <AnimatePresence initial={false}>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    >
                                        <div className="px-6 pb-6 pt-2 border-t border-warm-100/50">
                                            {item.content}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
