import React from 'react';
import { Scroll, FileCheck, Shield, BookOpen, AlertCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
    const sections = [
        {
            icon: <Scroll className="text-orange-500" size={24} />,
            title: "Acceptance of Terms",
            content: "By accessing and using BizDirect, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
        },
        {
            icon: <FileCheck className="text-orange-500" size={24} />,
            title: "User Responsibilities",
            content: "Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. You must provide accurate and complete information."
        },
        {
            icon: <Shield className="text-orange-500" size={24} />,
            title: "Limitation of Liability",
            content: "BizDirect provides a platform for connecting businesses and customers. We are not liable for any direct, indirect, or incidental damages arising from the use or inability to use our services."
        },
        {
            icon: <BookOpen className="text-orange-500" size={24} />,
            title: "Intellectual Property",
            content: "All content on our platform, including logos, text, and graphics, is the property of BizDirect or its licensors and is protected by intellectual property laws. You may not use it without our permission."
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
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-600 rounded-full font-black text-xs tracking-widest uppercase mb-6 border border-slate-200">
                        <FileText size={14} /> Legal Agreement
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Terms of <span className="text-orange-500">Service</span>
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto normal-case font-medium">
                        Please read these terms carefully before using BizDirect. They outline your rights and responsibilities when using our platform.
                    </p>
                </motion.div>

                <div className="space-y-6 mb-16">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex items-start gap-6"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                                {section.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{section.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm normal-case font-medium">
                                    {section.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden text-center"
                >
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <AlertCircle size={48} className="text-orange-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-black mb-4">Revised terms?</h2>
                        <p className="text-slate-400 mb-10 normal-case font-medium text-lg leading-relaxed">
                            We reserve the right to modify these terms at any time. We will notify you of any material changes by posting the new terms on our site.
                        </p>
                        <button className="px-10 py-5 bg-orange-500 text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-orange-500/25 text-sm tracking-widest">
                            I UNDERSTAND THESE TERMS
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfService;
