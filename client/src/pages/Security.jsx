import React from 'react';
import { ShieldAlert, Fingerprint, Lock, ShieldCheck, AlertTriangle, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const Security = () => {
    const securityFeatures = [
        {
            icon: <Fingerprint className="text-orange-500" size={24} />,
            title: "Encryption",
            content: "Your data is encrypted both in transit and at rest using industry-standard protocols. We leverage robust encryption systems to prevent unauthorized access."
        },
        {
            icon: <Lock className="text-orange-500" size={24} />,
            title: "Account Security",
            content: "We provide secure authentication and account management options. We recommend using strong passwords and enabling any additional security features provided by our platform."
        },
        {
            icon: <ShieldAlert className="text-orange-500" size={24} />,
            title: "Threat Monitoring",
            content: "Our system is under continuous monitoring for potential security threats. We use automated tools and manual reviews to identify and mitigate risks."
        },
        {
            icon: <ShieldCheck className="text-orange-500" size={24} />,
            title: "Vulnerability Management",
            content: "We regularly perform security assessments and vulnerability scans. We are committed to addressing security vulnerabilities in a timely and responsible manner."
        }
    ];

    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen font-inter uppercase">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-orange-50 text-orange-600 rounded-full font-black text-xs tracking-widest uppercase mb-6 border border-orange-100 shadow-sm shadow-orange-500/10">
                        <Lock size={14} /> Security Center
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Safe & <span className="text-orange-500">Secure</span>
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto normal-case font-medium">
                        Our commitment to your security is at the core of everything we do. We build features that protect your data and privacy.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 uppercase">
                    {securityFeatures.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 transform hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-4">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm normal-case font-medium">
                                {feature.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="p-10 rounded-[3rem] bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-2xl relative overflow-hidden group"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                                <Key size={24} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-black">Report a security issue?</h2>
                        </div>
                        <p className="text-white/90 mb-8 max-w-xl normal-case font-medium text-lg leading-relaxed">
                            If you believe you've found a security vulnerability on our platform, please reach out to us. We take every report seriously.
                        </p>
                        <button className="px-10 py-5 bg-white text-orange-600 font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/10 text-sm tracking-widest flex items-center gap-3">
                            <AlertTriangle size={18} /> OPEN SECURITY INCIDENT
                        </button>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-black/10 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                </motion.div>
            </div>
        </div>
    );
};

export default Security;
