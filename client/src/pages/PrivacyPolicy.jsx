import React from 'react';
import { Shield, Lock, Eye, FileText, Bell, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    const sections = [
        {
            icon: <Eye className="text-orange-500" size={24} />,
            title: "Data We Collect",
            content: "We collect information you provide directly to us when you create an account, list a business, or interact with our services. This includes your name, email, business details, and contact information."
        },
        {
            icon: <Shield className="text-orange-500" size={24} />,
            title: "How We Use Data",
            content: "Your data is used to provide and maintain our services, notify you about changes, and provide customer support. We use analytics to improve our platform experience for all users."
        },
        {
            icon: <Lock className="text-orange-500" size={24} />,
            title: "Data Security",
            content: "We implement industry-standard security measures to protect your personal information. This includes encryption, secure servers, and regular security audits."
        },
        {
            icon: <Globe className="text-orange-500" size={24} />,
            title: "Third-Party Sharing",
            content: "We do not sell your personal data. We only share information with third parties when necessary to provide our services, comply with the law, or protect our rights."
        }
    ];

    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Privacy <span className="text-orange-500">Policy</span>
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Your trust is our most valuable asset. Learn how we handle your data with transparency and care.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-6">
                                {section.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{section.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl"
                >
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4">Questions about your privacy?</h2>
                        <p className="text-slate-400 mb-8 max-w-xl">
                            Our dedicated privacy team is here to help you understand your rights and our responsibilities.
                        </p>
                        <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/25">
                            Contact Privacy Team
                        </button>
                    </div>
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
