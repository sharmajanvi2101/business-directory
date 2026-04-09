import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
    MapPin, Phone, Globe, Mail, Clock, Star,
    Share2, Download, ExternalLink, Calendar,
    Award, ShieldCheck, Zap, Briefcase, Camera,
    ChevronRight, X, Heart, MessageSquare, Tag,
    Image as ImageIcon, Layout, Rocket, ArrowLeft,
    CheckCircle2, AlertCircle, Copy, Check, Instagram,
    Send, User, Info, PhoneCall, UserPlus, Contact
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import businessService from '../services/businessService';
import reviewService from '../services/reviewService';
import { CATEGORY_META } from '../constants/categoryMeta';
import { downloadPDF } from '../utils/pdfGenerator';

const BusinessWebsite = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const autoShowCard = searchParams.get('showCard') === 'true';
    const [biz, setBiz] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const [showBusinessCard, setShowBusinessCard] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchBiz = async () => {
            setLoading(true);
            try {
                const data = await businessService.getBusinessBySlug(slug);
                setBiz(data);
                if (autoShowCard) setShowBusinessCard(true);
                businessService.trackView(data._id);
                const reviewData = await reviewService.getBusinessReviews(data._id);
                setReviews(reviewData.data || []);
            } catch (err) {
                toast.error("Business not found");
            } finally {
                setLoading(false);
            }
        };
        fetchBiz();
    }, [slug]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: biz.name,
                text: biz.description,
                url: window.location.href
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    const shareOnWhatsApp = () => {
        const text = `Check out ${biz.name} on BizDirect! ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareOnInstagram = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied! Share it on your Instagram bio/stories.", { icon: '📸' });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-orange-100 border-t-[#ea580c] rounded-full animate-spin mb-4" />
                <p className="text-stone-600 font-bold uppercase tracking-widest text-xs animate-pulse">Building your experience...</p>
            </div>
        </div>
    );

    if (!biz) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-black text-stone-900 mb-4">404: Not Found</h1>
            <p className="text-stone-800 mb-8">This business mini-website doesn't exist or has moved.</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
    );

    const meta = CATEGORY_META[biz.category?.name] || { color: 'bg-orange-50 text-[#ea580c]', coverUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000' };

    const TABS = [
        { id: 'about', label: 'About', icon: Info },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'contact', label: 'Contact', icon: Phone },
    ];

    return (
        <div className="min-h-screen bg-white">
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-stone-100 py-3' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
                            className={`flex items-center gap-2 pr-4 h-11 rounded-2xl transition-all shadow-xl backdrop-blur-md border ${scrolled ? 'bg-stone-900 text-white border-stone-800 px-3' : 'bg-white/10 text-white border-white/10 hover:bg-white/20 px-3'}`}
                        >
                            <ArrowLeft size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:inline">Back</span>
                        </button>
                        <Link to="/" className={`flex items-center gap-2 font-black text-xl transition-colors ${scrolled ? 'text-stone-900' : 'text-white'}`}>
                            <div className="w-8 h-8 rounded-lg bg-[#ea580c] flex items-center justify-center shadow-lg shadow-orange-900/20">
                                <Rocket size={16} className="text-white" />
                            </div>
                            <span className="hidden sm:inline">BizDirect</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button onClick={shareOnWhatsApp} className={`p-2.5 rounded-xl transition-all hidden sm:flex ${scrolled ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-green-500/20 text-white hover:bg-green-500/30 backdrop-blur-md border border-white/10'}`}>
                            <Send size={18} />
                        </button>
                        <button onClick={handleShare} className={`p-2.5 rounded-xl transition-all ${scrolled ? 'bg-stone-50 text-stone-900 hover:bg-stone-100' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10'}`}>
                            <Share2 size={18} />
                        </button>
                        <button onClick={downloadPDF.bind(null, biz)} className={`p-2.5 rounded-xl transition-all ${scrolled ? 'bg-orange-50 text-[#ea580c] hover:bg-orange-100' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10'}`}>
                            <Download size={18} />
                        </button>
                        <Link
                            to={`/business/${biz._id}?noredirect=true`}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${scrolled ? 'bg-[#ea580c] text-white shadow-lg' : 'bg-white text-stone-900 shadow-xl hover:scale-105'}`}
                        >
                            <ChevronRight size={16} /> Get Details
                        </Link>
                    </div>
                </div>
            </nav>

            <header className="relative h-[45vh] md:h-[55vh] min-h-[400px] overflow-hidden bg-stone-900">
                <div className="absolute inset-0">
                    {biz.coverImage || biz.images?.[0] ? (
                        <img src={biz.coverImage || biz.images[0]} className="w-full h-full object-cover scale-105" alt={biz.name} />
                    ) : (
                        <img
                            src={meta.coverUrl}
                            className="w-full h-full object-cover opacity-60 scale-105 saturate-[0.8]"
                            alt="Premium Background"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="container mx-auto">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
                            <div className="flex items-end gap-6 mb-2">
                                {biz.logo || (biz.images && biz.images[0]) ? (
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white p-1 shrink-0 -mb-8 relative z-10 transition-transform hover:scale-105 duration-500">
                                        <img src={biz.logo || biz.images[0]} className="w-full h-full object-cover rounded-2xl" alt={biz.name} />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white border-4 border-white flex items-center justify-center shadow-2xl shrink-0 -mb-8 relative z-10 text-[#ea580c] overflow-hidden p-1">
                                        {meta.image ? (
                                            <img src={meta.image} className="w-full h-full object-cover rounded-2xl" alt={biz.category?.name} />
                                        ) : (
                                            <meta.icon size={48} />
                                        )}
                                    </div>
                                )}
                                <div className="pb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        {biz.isVerified && <span className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] uppercase tracking-widest bg-emerald-400/20 px-2 py-1 rounded-md backdrop-blur-md"><ShieldCheck size={12} /> Verified</span>}
                                    </div>
                                    <h1 className="text-1xl md:text-3xl lg:text-3xl font-black text-white leading-tight mb-2 tracking-tighter">
                                        {biz.name}
                                    </h1>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            <div className="bg-white border-b border-stone-100 sticky top-[72px] z-[90]">
                <div className="container mx-auto px-6">
                    <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-4">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 whitespace-nowrap px-1 py-2 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'text-[#ea580c] border-[#ea580c]' : 'text-stone-600 border-transparent hover:text-stone-600'}`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="min-h-screen">
                <AnimatePresence mode="wait">
                    {activeTab === 'about' && (
                        <motion.section
                            key="about"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="py-24 bg-white"
                        >
                            <div className="container mx-auto px-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                                    <div className="lg:col-span-2">
                                        <h2 className="text-3xl font-black text-stone-900 tracking-tight mb-8 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ea580c] border border-orange-100"><Info size={24} /></div>
                                            Our Story
                                        </h2>
                                        <p className="text-stone-800 text-lg leading-relaxed font-normal whitespace-pre-line mb-12">
                                            {biz.description}
                                        </p>
                                        {biz.announcements?.length > 0 && (
                                            <div className="bg-stone-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                                                <div className="relative z-10">
                                                    <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Zap size={24} className="text-amber-400 fill-amber-400" /> Latest Updates</h3>
                                                    <div className="space-y-4">
                                                        {biz.announcements.map((ann, idx) => (
                                                            <div key={idx} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
                                                                <h4 className="font-bold text-white mb-2">{ann.title}</h4>
                                                                <p className="text-stone-100 text-sm leading-relaxed">{ann.content}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-8">
                                        <div className="bg-stone-50 p-10 rounded-[3rem] border border-stone-100 text-center shadow-sm">
                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-[#ea580c]"><Star size={32} fill="currentColor" /></div>
                                            <h4 className="text-4xl font-black text-stone-900 mb-2">{biz.averageRating?.toFixed(1) || 'New'}</h4>
                                            <p className="text-xs font-black text-stone-600 uppercase tracking-[0.2em]">Customer Confidence Score</p>
                                        </div>
                                        {/* Removed Business Hours Card */}
                                        {/* Restored Verified block */}
                                        <div className="bg-[#ea580c] p-8 rounded-[3rem] text-white text-center group cursor-default shadow-lg">
                                            <Award size={32} className="mx-auto mb-4 text-orange-200 group-hover:scale-110 transition-transform" />
                                            <h4 className="font-black text-lg mb-2">Verified Professional</h4>
                                            <p className="text-orange-100 text-xs leading-relaxed">This business has been audited and verified by BizDirect Global officials.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}


                    {activeTab === 'reviews' && (
                        <motion.section
                            key="reviews"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="py-24 bg-stone-50"
                        >
                            <div className="container mx-auto px-6">
                                <div className="max-w-4xl mx-auto">
                                    <h2 className="text-3xl font-black text-stone-900 tracking-tight mb-16 text-center">Customer Testimonials</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {reviews.length > 0 ? reviews.map((review, idx) => (
                                            <div key={idx} className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#ea580c] font-black text-lg">{review.user?.name?.charAt(0) || 'U'}</div>
                                                        <div>
                                                            <h4 className="font-black text-stone-900 leading-tight">{review.user?.name || 'Anonymous'}</h4>
                                                            <p className="text-[10px] font-bold text-stone-600 uppercase tracking-widest mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? 'currentColor' : 'none'} />)}
                                                    </div>
                                                </div>
                                                <p className="text-stone-800 text-lg italic leading-relaxed font-medium">"{review.comment}"</p>
                                            </div>
                                        )) : <div className="col-span-2 py-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-stone-200 text-stone-600 font-bold uppercase tracking-[0.2em] text-xs">Awaiting first review...</div>}
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {activeTab === 'contact' && (
                        <motion.section
                            key="contact"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="py-24 bg-white"
                        >
                            <div className="container mx-auto px-6">
                                <div className="max-w-6xl mx-auto">
                                    <div className="bg-stone-950 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
                                        <div className="flex-1 p-12 md:p-20">
                                            <h2 className="text-3xl font-black text-white mb-12 tracking-tight">Visit Our Location</h2>
                                            <div className="space-y-10">
                                                <div className="flex items-start gap-8">
                                                    <div className="w-16 h-16 rounded-[2rem] bg-stone-900 text-orange-400 flex items-center justify-center shrink-0 border border-stone-800 shadow-xl"><MapPin size={28} /></div>
                                                    <div>
                                                        <p className="text-stone-600 text-[10px] font-black uppercase tracking-widest mb-2">Street Office</p>
                                                        <p className="text-2xl font-black text-white leading-tight mb-2">{biz.address}</p>
                                                        <p className="text-stone-300 font-bold">{biz.city?.name}, GJ - India</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-8">
                                                    <div className="w-16 h-16 rounded-[2rem] bg-stone-900 text-white flex items-center justify-center shrink-0 border border-stone-800 shadow-xl"><Phone size={28} /></div>
                                                    <div className="flex-1">
                                                        <p className="text-stone-600 text-[10px] font-black uppercase tracking-widest mb-2">Direct Contact</p>
                                                        <div className="flex flex-col sm:flex-row gap-4">
                                                            <p className="text-2xl font-black text-white leading-tight">{biz.phone}</p>
                                                            <a
                                                                href={`https://wa.me/${biz.phone.replace(/\D/g, '')}?text=Hello ${biz.name}, I found your Digital Store on BizDirect!`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-green-600 transition-all w-fit"
                                                            >
                                                                <MessageSquare size={14} fill="white" />
                                                                WhatsApp Enquiry
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>

            <footer className="bg-stone-50 py-12 border-t border-stone-100 text-center">
                <p className="text-stone-600 text-xs font-bold uppercase tracking-widest">Powered by BizDirect Premium • Mini Site</p>
                <Link to={`/business/${biz._id}?noredirect=true`} className="block mt-4 text-stone-600 hover:text-[#ea580c] text-[10px] font-black uppercase tracking-widest transition-colors">Directory Profile</Link>
            </footer>

            <AnimatePresence>
                {showBusinessCard && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-stone-950/60 backdrop-blur-xl" onClick={() => setShowBusinessCard(false)}>
                        <motion.div
                            initial={{ scale: 0.9, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 30, opacity: 0 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-stone-100"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex flex-col md:flex-row min-h-[340px] aspect-[1.75/1]">
                                {/* Brand Sidebar - Vertical on Mobile, Left on Desktop */}
                                <div className="w-full md:w-1/3 bg-stone-900 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0">
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                                    <div className="w-24 h-24 rounded-full bg-white border-[1px] border-white shadow-2xl flex items-center justify-center overflow-hidden mb-6 relative z-10 rotate-3 transition-transform hover:rotate-0 duration-500 shrink-0">
                                        {biz.logo || (biz.images && biz.images[0]) ? (
                                            <img src={biz.logo || biz.images[0]} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#ea580c] flex items-center justify-center text-white text-3xl font-black">
                                                {biz.name.split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative z-10">
                                        <h2 className="text-xl font-black text-white leading-tight mb-2 uppercase tracking-tighter italic">{biz.name}</h2>
                                        <div className="bg-[#ea580c] px-3 py-1 rounded-full inline-block">
                                            <p className="text-[8px] font-black text-white uppercase tracking-widest">{biz.category?.name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Body */}
                                <div className="flex-1 p-10 flex flex-col justify-between bg-white relative">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-5 group">
                                            <div className="w-12 h-12 rounded-[1.2rem] bg-orange-50 flex items-center justify-center text-[#ea580c] shadow-sm border border-orange-100 group-hover:bg-[#ea580c] group-hover:text-white transition-all"><PhoneCall size={20} /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-1 group-hover:text-[#ea580c] transition-all">Direct Contact</p>
                                                <a href={`tel:${biz.phone}`} className="text-lg font-black text-stone-900 group-hover:text-[#ea580c] transition-all">{biz.phone}</a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 group">
                                            <div className="w-12 h-12 rounded-[1.2rem] bg-orange-50 flex items-center justify-center text-[#ea580c] shadow-sm border border-orange-100 group-hover:bg-[#ea580c] group-hover:text-white transition-all"><MapPin size={20} /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-1 group-hover:text-[#ea580c] transition-all">Address</p>
                                                <p className="text-sm font-bold text-stone-900 leading-tight">{biz.address || 'Local Address'}, {biz.city?.name || 'City'}, GJ</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 group">
                                            <div className="w-12 h-12 rounded-[1.2rem] bg-orange-50 flex items-center justify-center text-[#ea580c] shadow-sm border border-orange-100 group-hover:bg-[#ea580c] group-hover:text-white transition-all"><Globe size={20} /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-1 group-hover:text-[#ea580c] transition-all">Digital Store</p>
                                                <p className="text-sm font-bold text-[#ea580c] underline">bizdirect.global/b/{biz.slug}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10">
                                        <button
                                            onClick={() => { toast.success("Downloading Rectangular Premium PDF..."); downloadPDF(biz); }}
                                            className="w-full py-5 bg-stone-900 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-stone-900/40 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                                        >
                                            <Download size={20} className="text-orange-400" />
                                            Download Professional PDF Card
                                        </button>
                                    </div>
                                    <button onClick={() => setShowBusinessCard(false)} className="absolute top-4 right-4 p-2 text-stone-600 hover:text-stone-900 transition-all"><X size={24} /></button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BusinessWebsite;
