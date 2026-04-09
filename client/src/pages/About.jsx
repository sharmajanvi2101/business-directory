import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, Heart, MapPin, Target, Sparkles } from 'lucide-react';
import ABOUT_HERO from '../assets/about_hero.png';

const About = () => {
    return (
        <div className="min-h-screen pt-32 pb-20" style={{ background: '#fffdf9' }}>
            {/* Hero Section */}
            <section className="container mx-auto px-4 mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles size={14} /> Our Story
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-stone-900 mb-6 leading-tight tracking-tight">
                        Connecting People with <br />
                        <span className="premium-gradient-text text-6xl md:text-8xl italic">Trusted</span> Services.
                    </h1>
                    <p className="text-xl text-stone-500 font-medium leading-relaxed mb-10">
                        BizDirect was born from a simple idea: making it effortless for anyone to find and support the best local businesses in their community.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative max-w-5xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl shadow-orange-200 border-8 border-white"
                >
                    <img 
                        src={ABOUT_HERO} 
                        alt="Our Team" 
                        className="w-full h-[500px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-10">
                        <div className="text-white text-left">
                            <p className="text-lg font-bold opacity-90">Based in Palanpur, serving all of Gujarat.</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Mission Section */}
            <section className="container mx-auto px-4 py-20 bg-white rounded-[4rem] border border-orange-100 shadow-sm mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                    <div>
                        <h2 className="text-4xl font-black text-stone-900 mb-6 leading-tight">
                            Our Mission is to <br />
                            <span className="text-primary-600 underline decoration-orange-300 underline-offset-8">Empower Local</span> Economy.
                        </h2>
                        <p className="text-stone-500 text-lg leading-relaxed mb-8">
                            We believe that local businesses are the heartbeat of every town. Our platform is designed to give them the visibility they deserve while providing consumers with a safe, verified place to find services.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-primary-600">
                                    <ShieldCheck size={24} />
                                </div>
                                <h4 className="font-black text-stone-900">100% Verified</h4>
                                <p className="text-sm text-stone-400 font-medium">Every business goes through manual verification.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                                    <Target size={24} />
                                </div>
                                <h4 className="font-black text-stone-900">Direct Contact</h4>
                                <p className="text-sm text-stone-400 font-medium">No middlemen, no commission. Just direct connection.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-[3rem] bg-orange-50 p-12 flex flex-col justify-center">
                           <div className="space-y-8">
                                {[
                                    { label: 'Founded in', value: '2025', icon: MapPin },
                                    { label: 'Happy Users', value: '10,000+', icon: Heart },
                                    { label: 'Verified Partners', value: '500+', icon: Users },
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-stone-400">
                                            <stat.icon size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-stone-400 uppercase tracking-widest">{stat.label}</p>
                                            <p className="text-2xl font-black text-stone-900">{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                           </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-[2rem] -z-10 blur-2xl opacity-40"></div>
                    </div>
                </div>
            </section>

            {/* Simple Values Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-black text-stone-900 mb-16">The Core of Who We Are</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    {[
                        { title: 'Simplicity', desc: 'We cut the noise to make search effortless and beautiful.', color: 'bg-blue-50' },
                        { title: 'Trust', desc: 'Transparency is our foundation in everything we do.', color: 'bg-rose-50' },
                        { title: 'Community', desc: 'We grow only when our local businesses grow.', color: 'bg-emerald-50' },
                    ].map((value, i) => (
                        <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-stone-50 shadow-sm hover:shadow-xl hover:shadow-orange-50 transition-all group">
                            <div className={`w-12 h-12 rounded-2xl ${value.color} mx-auto mb-6 group-hover:scale-110 transition-transform`}></div>
                            <h3 className="text-xl font-black text-stone-900 mb-4">{value.title}</h3>
                            <p className="text-stone-400 font-medium text-sm leading-relaxed">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;
