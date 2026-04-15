import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer-gradient text-white pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center shadow-lg shadow-orange-950/20">
                                <MapPin size={20} className="text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tight leading-none">BizDirect</span>
                        </Link>
                        <p className="text-orange-200/70 text-base leading-relaxed max-w-sm mb-8">
                            Empowering local commerce across Gujarat by connecting verified businesses with customers. Trusted, community-focused, and 100% transparent.
                        </p>
                        <div className="flex items-center gap-4">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-200/40">Powered by Local Communities</p>
                        </div>
                    </div>

                    {[
                        {
                            title: 'Explore',
                            links: [
                                { label: 'About Us', href: '/about' },
                                { label: 'All Businesses', href: '/search' },
                                { label: 'Restaurants', href: '/search?category=Restaurants' },
                                { label: 'Doctors & Clinics', href: '/search?category=Doctor' },
                                { label: 'Gyms & Fitness', href: '/search?category=Gym' }
                            ]
                        },
                        {
                            title: 'Popular Cities',
                            links: [
                                { label: 'Palanpur', href: '/search?city=Palanpur' },
                                { label: 'Patan', href: '/search?city=Patan' },
                                { label: 'Saraswati', href: '/search?city=Saraswati' },
                                { label: 'Ahmedabad', href: '/search?city=Ahmedabad' },
                                { label: 'Vadodara', href: '/search?city=Vadodara' }
                            ]
                        },
                    ].map(({ title, links }) => (
                        <div key={title} className="col-span-1">
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-white underline decoration-orange-500/50 decoration-2 underline-offset-8 mb-8">{title}</h4>
                            <ul className="space-y-4">
                                {links.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link to={href} className="text-orange-100/60 text-sm font-semibold hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-orange-200/40 text-xs font-bold uppercase tracking-widest">
                    <p>© 2025 BizDirect Marketplace. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <span className="opacity-20">•</span>
                        <Link to="/security" className="hover:text-white transition-colors">Security</Link>
                        <span className="opacity-20">•</span>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <span className="opacity-20">•</span>
                        <Link to="/" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                    <p className="flex items-center gap-1.5">
                        Handcrafted with <Heart size={14} className="text-rose-500 animate-pulse" fill="currentColor" /> for Gujarat
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
