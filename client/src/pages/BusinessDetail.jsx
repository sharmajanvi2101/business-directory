import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
    MapPin, Phone, Globe, Mail, Clock, Star,
    ShieldCheck, Share2, Heart, MessageSquare,
    ChevronRight, Info, Briefcase, Navigation, ExternalLink, Utensils, ShoppingBag, Zap, Droplets, Stethoscope, Dumbbell,
    Leaf, Award, Tag, CalendarCheck, Check, ArrowLeftRight, Rocket, PhoneCall, ArrowLeft
} from 'lucide-react';
import businessService from '../services/businessService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORY_META, GLOBAL_FALLBACK_IMAGE } from '../constants/categoryMeta';
import { useSelector, useDispatch } from 'react-redux';
import { updateFavorites } from '../store/slices/authSlice';
import userService from '../services/userService';
import reviewService from '../services/reviewService';
import { downloadPDF } from '../utils/pdfGenerator';


const BusinessDetail = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const noredirect = searchParams.get('noredirect') === 'true';
    const autoShowCard = searchParams.get('showCard') === 'true';
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [business, setBusiness] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const { user } = useSelector(state => state.auth);
    const isFavourited = user?.favorites?.some(fid => fid.toString() === id);
    const [comparisonList, setComparisonList] = useState([]);
    const [activeTab, setActiveTab] = useState('about');
    const [showDigitalCard, setShowDigitalCard] = useState(false);

    const TABS = [
        { id: 'about', label: 'About', icon: Info },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'contact', label: 'Contact', icon: Phone },
    ];

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        setComparisonList(list);
    }, []);

    const getDirectionsUrl = (biz) => {
        const coords = biz.location?.coordinates;
        if (coords?.length === 2 && (coords[0] !== 0 || coords[1] !== 0)) {
            const [lng, lat] = coords;
            return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        }
        const query = encodeURIComponent(`${biz.address}, ${biz.city?.name}, ${biz.city?.state}, India`);
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: business.name, url });
            } catch (_) { }
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        }
    };

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const data = await businessService.getBusinessById(id);

                // If this business has a mini-website slug, auto-redirect to it for a premium experience
                // Skip redirect if noredirect=true is passed (used by "Get Details" links)
                if (data.slug && !noredirect) {
                    navigate(`/b/${data.slug}`, { replace: true });
                    return;
                }

                setBusiness(data);
                if (autoShowCard) setShowDigitalCard(true);
                // Fetch reviews
                const reviewsData = await reviewService.getBusinessReviews(id);
                setReviews(reviewsData.data || []);
                // Track view
                businessService.trackView(id).catch(err => console.error('View tracking failed', err));
            } catch (error) {
                toast.error("Business not found");
                navigate('/search');
            } finally {
                setLoading(false);
            }
        };
        fetchBusiness();
    }, [id, navigate]);

    const handleToggleFavorite = async () => {
        if (!user) {
            toast.error('Please login to save favorites');
            navigate('/login');
            return;
        }

        try {
            const currentFavorites = user.favorites || [];
            const isFav = currentFavorites.some(fid => fid.toString() === id);
            const newFavorites = isFav
                ? currentFavorites.filter(fid => fid.toString() !== id)
                : [...currentFavorites, id];

            // Optimistic update
            dispatch(updateFavorites(newFavorites));

            const res = await userService.toggleFavorite(id);
            toast.success(res.message, { icon: isFav ? '💔' : '❤️' });
        } catch (error) {
            // Rollback
            if (user?.favorites) {
                dispatch(updateFavorites(user.favorites));
            }
            toast.error(error?.message || 'Failed to update favorites');
        }
    };

    const handleAddToComparison = () => {
        const currentList = JSON.parse(localStorage.getItem('comparisonList') || '[]');

        let newList;
        if (currentList.includes(id)) {
            newList = currentList.filter(fid => fid !== id);
            toast.success('Removed from comparison');
        } else {
            if (currentList.length >= 4) {
                toast.error('Comparison list is full (max 4)');
                return;
            }
            newList = [...currentList, id];
            toast.success('Added to comparison!', { icon: '📊' });
        }

        localStorage.setItem('comparisonList', JSON.stringify(newList));
        setComparisonList(newList);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Log in to post a review');
            navigate('/login');
            return;
        }

        if (reviewComment.length < 10) {
            toast.error('Comment must be at least 10 characters');
            return;
        }

        setSubmittingReview(true);
        try {
            await reviewService.addReview({
                businessId: id,
                rating: reviewRating,
                comment: reviewComment
            });
            toast.success('Review posted successfully!');
            // Refresh reviews
            const reviewsData = await reviewService.getBusinessReviews(id);
            setReviews(reviewsData.data || []);
            setShowReviewForm(false);
            setReviewComment('');
            setReviewRating(5);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="pt-32 flex flex-col items-center justify-center min-h-screen" style={{ background: '#fffdf9' }}>
                <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin mb-4" />
                <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Loading profile...</p>
            </div>
        );
    }

    if (!business) return null;
    const meta = CATEGORY_META[business.category?.name] || { emoji: '📍', color: 'bg-gray-50 text-gray-600' };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen pb-32"
            style={{ background: '#fffdf9' }}
        >
            {/* Breadcrumbs */}
            <div className="pt-28 pb-6 container mx-auto px-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
                        className="flex items-center gap-2 pr-5 h-12 rounded-2xl bg-white border-2 border-orange-50 text-stone-600 hover:text-[#ea580c] hover:border-[#ea580c] transition-all shadow-md group pl-3 font-black text-xs uppercase tracking-widest"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                    <div className="flex items-center gap-2 text-sm text-stone-400 font-medium">
                        <Link to="/" className="hover:text-[#ea580c] transition-colors uppercase tracking-widest text-xs font-black">Home</Link>
                        <ChevronRight size={12} className="text-stone-300" />
                        <Link to="/search" className="hover:text-[#ea580c] transition-colors uppercase tracking-widest text-xs font-black">Search</Link>
                        <ChevronRight size={12} className="text-stone-300" />
                        <span className="text-stone-900 font-black uppercase tracking-widest text-xs">{business.name}</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="container mx-auto px-0 md:px-4 mb-10 overflow-visible">
                <div className="relative h-[420px] md:h-[500px] rounded-none md:rounded-[4rem] overflow-hidden shadow-2xl shadow-orange-900/10 bg-stone-900">
                    {/* Background Layer */}
                    <div className="absolute inset-0">
                        {business.images?.[0] ? (
                            <img src={business.images[0]} alt={business.name} className="w-full h-full object-cover blur-[1.5px] scale-105" />
                        ) : (
                            <img src={meta.image || GLOBAL_FALLBACK_IMAGE} alt={business.name} className="w-full h-full object-cover opacity-50 blur-[2px] scale-110" />
                        )}
                        {/* Progressive Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-[5]" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-orange-950/40 to-transparent mix-blend-multiply z-[6]" />
                    </div>

                    {/* Interactive Content Layer */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-14">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                            <div className="text-white max-w-2xl">
                                <div className="flex flex-wrap items-center gap-2.5 mb-5 opacity-90">
                                    <span className="px-3.5 py-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                                        {business.category?.name}
                                    </span>
                                    {business.isVerified && (
                                        <span className="px-3.5 py-1 bg-green-500/80 backdrop-blur-md border border-green-400/20 rounded-full text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-1.5 shadow-lg shadow-green-900/20">
                                            <ShieldCheck size={12} className="animate-pulse" /> Verified Store
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black mb-5 tracking-tighter leading-[1.2] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                                    {business.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3.5 text-white/90 font-bold">
                                    <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-white/10">
                                        <Star size={16} className="text-amber-400 fill-amber-400" />
                                        <span className="text-lg text-white font-black">{business.averageRating?.toFixed(1) || 'New'}</span>
                                        <span className="text-[10px] opacity-60 uppercase tracking-widest pl-1">({reviews.length} Reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-white/10">
                                        <MapPin size={16} className="text-secondary-400" />
                                        <span className="text-xs font-black uppercase tracking-widest italic">{business.city?.name}, GJ</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3.5 w-full md:w-auto relative z-20">
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={handleToggleFavorite}
                                        className={`p-4 backdrop-blur-2xl rounded-2xl border transition-all duration-300 flex-1 sm:flex-initial shadow-xl relative z-30 pointer-events-auto cursor-pointer ${isFavourited
                                            ? 'bg-red-500 border-red-400 text-white shadow-red-900/40'
                                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20 active:scale-95'
                                            }`}
                                    >
                                        <Heart size={24} fill={isFavourited ? 'currentColor' : 'none'} />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="p-4 bg-white/10 backdrop-blur-2xl rounded-2xl text-white hover:bg-white/20 border border-white/20 transition-all active:scale-95 flex-1 sm:flex-initial shadow-xl"
                                    >
                                        <Share2 size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3.5 w-full">
                                    {business.phone && (
                                        <a
                                            href={`tel:${business.phone.replace(/\s/g, '').replace(/-/g, '').replace(/\+/g, '')}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `tel:${business.phone.replace(/\s/g, '').replace(/-/g, '').replace(/\+/g, '')}`;
                                            }}
                                            className="px-8 py-4 bg-[#ea580c] hover:bg-orange-700 text-white rounded-2xl text-base font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 transition-all hover:translate-y-[-2px] active:translate-y-[0] shadow-2xl shadow-orange-900/50 w-full md:w-auto relative z-30 pointer-events-auto cursor-pointer"
                                        >
                                            <Phone size={20} />
                                            Call Provider
                                        </a>
                                    )}
                                    {business.slug && (
                                        <Link
                                            to={`/b/${business.slug}`}
                                            className="px-8 py-4 bg-[#ea580c] text-white rounded-2xl text-base font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 transition-all hover:bg-orange-700 hover:translate-y-[-2px] active:translate-y-[0] shadow-2xl shadow-orange-900/40 w-full md:w-auto"
                                        >
                                            <Rocket size={20} />
                                            Digital Store
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabbed Navigation */}
            <div className="bg-white border-b border-stone-100 sticky top-[72px] z-[90] mb-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-4 px-2">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 whitespace-nowrap px-1 py-2 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-[#ea580c]' : 'text-stone-400 hover:text-stone-600'}`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="activeTabBr" className="absolute bottom-[-17px] left-0 right-0 h-1 bg-[#ea580c] rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 min-h-[60vh]">
                <AnimatePresence mode="wait">
                    {activeTab === 'about' && (
                        <motion.div
                            key="about"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                        >
                            <div className="lg:col-span-2 space-y-10">
                                <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-orange-50 shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ea580c] border border-orange-100">
                                            <Info size={24} />
                                        </div>
                                        <h2 className="text-2xl font-black text-stone-900 tracking-tight">Business Overview</h2>
                                    </div>
                                    <p className="text-stone-500 leading-relaxed text-lg font-medium whitespace-pre-line opacity-90 mb-10">
                                        {business.description}
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-10 border-t border-orange-50">
                                        {business.attributes?.isWomenOwned && (
                                            <div className="flex items-center gap-2 px-5 py-2.5 bg-pink-50 text-pink-700 rounded-2xl border border-pink-100 font-bold text-xs">
                                                <Award size={16} /> Women Owned
                                            </div>
                                        )}
                                        {business.attributes?.isEcoFriendly && (
                                            <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-bold text-xs">
                                                <Leaf size={16} /> Eco Friendly
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 text-primary-700 rounded-2xl border border-orange-100 font-bold text-xs">
                                            <ShieldCheck size={16} /> Verified Store
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#ea580c] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20">
                                            <Zap className="mb-4 text-amber-300" size={32} />
                                            <h3 className="text-xl font-black mb-2">Safety Certified</h3>
                                            <p className="text-white/70 text-sm">Verified by Team BizDirect for authentic service delivery.</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20">
                                            <Briefcase className="mb-4 text-emerald-300" size={32} />
                                            <h3 className="text-xl font-black mb-2">Direct Contact</h3>
                                            <p className="text-white/70 text-sm">Instantly connect with the owner without middlemen.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-stone-900 p-10 rounded-[3rem] text-white">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-orange-400 mb-8">Contact Information</h3>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <PhoneCall size={20} className="text-orange-400 shrink-0" />
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-white/40">Phone</p>
                                                <p className="font-bold">{business.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <Mail size={20} className="text-orange-400 shrink-0" />
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-white/40">Email</p>
                                                <p className="font-bold truncate">{business.email || 'Direct Enquiry'}</p>
                                            </div>
                                        </div>
                                        {business.website && (
                                            <div className="flex gap-4">
                                                <Globe size={20} className="text-orange-400 shrink-0" />
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-white/40">Website</p>
                                                    <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noreferrer" className="font-bold border-b border-orange-500 hover:text-orange-400 transition-colors">Visit Official Site</a>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Removed Operational Schedule */}
                                </div>
                            </div>
                        </motion.div>
                    )}



                    {activeTab === 'reviews' && (
                        <motion.div
                            key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-black text-stone-900">Verified Reviews</h2>
                                <button onClick={() => setShowReviewForm(true)} className="px-6 py-3 bg-stone-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Share Experience</button>
                            </div>
                            {showReviewForm && (
                                <div className="bg-white p-10 rounded-[3rem] border-2 border-orange-100 shadow-2xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-black text-xl">Write a Review</h3>
                                        <button onClick={() => setShowReviewForm(false)} className="text-stone-400 hover:text-red-500"><Zap size={20} /></button>
                                    </div>
                                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <button key={s} type="button" onClick={() => setReviewRating(s)}>
                                                    <Star size={24} className={s <= reviewRating ? "text-amber-500 fill-amber-500" : "text-stone-200"} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-6 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="Was the service provided on time? How was the behavior?" />
                                        <button disabled={submittingReview} type="submit" className="w-full py-4 bg-[#ea580c] text-white rounded-2xl font-black uppercase text-xs tracking-widest">{submittingReview ? 'POSTING...' : 'PUBLISH REVIEW'}</button>
                                    </form>
                                </div>
                            )}
                            <div className="space-y-6">
                                {reviews.length > 0 ? reviews.map((rev, idx) => (
                                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-orange-50/50 shadow-sm relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#ea580c] font-black">{rev.user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                                                <div>
                                                    <h4 className="font-black text-stone-900">{rev.user?.name || 'Anonymous'}</h4>
                                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Verified Customer • {new Date(rev.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-amber-500">
                                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rev.rating ? 'currentColor' : 'none'} />)}
                                            </div>
                                        </div>
                                        <p className="text-stone-500 font-medium italic">"{rev.comment}"</p>
                                    </div>
                                )) : <div className="text-center py-24 bg-stone-50 rounded-[3rem] text-stone-400 font-bold uppercase tracking-widest text-xs">No reviews found for this store.</div>}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'contact' && (
                        <motion.div
                            key="contact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-stone-100"
                        >
                            <h2 className="text-2xl font-black text-stone-900 mb-10">Locate & Navigate</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Street Address</p>
                                        <p className="text-2xl font-black text-stone-900">{business.address}</p>
                                        <p className="text-stone-500 font-bold mt-2">Palanpur, Gujarat, India</p>
                                    </div>
                                    <a href={getDirectionsUrl(business)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-10 py-5 bg-stone-900 text-white rounded-2xl font-black uppercase italic tracking-tighter hover:bg-black transition-all">
                                        <Navigation size={20} /> Start Navigation
                                    </a>
                                </div>
                                <div className="bg-stone-50 p-10 rounded-[3rem] border border-stone-100">
                                    <h3 className="text-sm font-black uppercase text-stone-400 tracking-widest mb-6">Store Hub Policy</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-xs font-black">
                                            <span className="text-stone-400 uppercase tracking-widest">Verification Status</span>
                                            <span className="text-emerald-600">FULLY AUDITED</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-black">
                                            <span className="text-stone-400 uppercase tracking-widest">Support</span>
                                            <span className="text-stone-900">LOCAL HUB</span>
                                        </div>
                                    </div>
                                </div>                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Comparison Floating Bar */}
            <AnimatePresence>
                {comparisonList.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] w-[calc(100%-2rem)] max-w-2xl bg-stone-900 border border-white/10 p-5 rounded-[2.5rem] shadow-2xl backdrop-blur-xl"
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="flex -space-x-3">
                                    {comparisonList.map(cid => (
                                        <div key={cid} className="w-10 h-10 rounded-full border-2 border-stone-800 bg-stone-700 flex items-center justify-center text-[10px] text-white font-bold">
                                            {cid.slice(-2).toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-white text-xs font-black uppercase tracking-widest">{comparisonList.length} Selected</p>
                                    <p className="text-stone-400 text-[10px] font-medium hidden sm:block">Analyze them side-by-side</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => { localStorage.setItem('comparisonList', JSON.stringify([])); setComparisonList([]); }} className="text-stone-400 hover:text-white px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-colors">Clear</button>
                                <Link to="/compare" className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg ${comparisonList.length >= 2 ? 'bg-[#ea580c] text-white shadow-orange-900/20 hover:scale-105 active:scale-95' : 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-50'}`}>
                                    {comparisonList.length < 2 ? `Add ${2 - comparisonList.length} More` : 'Compare Now'}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Digital Card Modal */}
            <AnimatePresence>
                {showDigitalCard && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xl"
                        onClick={() => setShowDigitalCard(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 40, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 40, opacity: 0 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col md:flex-row h-full">
                                {/* Left Section - Brand */}
                                <div className="w-full md:w-2/5 bg-gradient-to-br from-orange-600 to-orange-900 p-10 flex flex-col items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }} />
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl relative z-10 mb-6 rotate-3">
                                        <div className="w-full h-full rounded-[2rem] bg-stone-50 flex items-center justify-center overflow-hidden border border-stone-100">
                                            {business.logo || (business.images && business.images[0]) ? <img src={business.logo || business.images[0]} className="w-full h-full object-cover" /> : <meta.icon size={48} className="text-[#ea580c]" />}
                                        </div>
                                    </div>
                                    <div className="text-center relative z-10">
                                        <h3 className="text-white font-black text-xl leading-tight mb-1">{business.name}</h3>
                                        <p className="text-primary-200 text-[10px] font-black uppercase tracking-widest">{business.category?.name}</p>
                                    </div>
                                </div>

                                {/* Right Section - Details */}
                                <div className="flex-1 p-10 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-5 group transition-all">
                                            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shadow-sm border border-stone-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all"><PhoneCall size={20} /></div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-0.5">Contact</p>
                                                <a href={`tel:${business.phone}`} className="text-lg font-black text-primary-600 hover:text-primary-700 tracking-tight transition-colors">{business.phone}</a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 group transition-all">
                                            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shadow-sm border border-stone-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all"><MapPin size={20} /></div>
                                            <div className="text-left"><p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-0.5">Location</p><p className="text-lg font-black text-stone-900 tracking-tight">{business.city?.name || 'Local City'}</p></div>
                                        </div>
                                        <div className="flex items-center gap-5 group transition-all cursor-pointer">
                                            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shadow-sm border border-stone-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all"><Globe size={20} /></div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-0.5">Website</p>
                                                <a
                                                    href={business.website?.startsWith('http') ? business.website : `https://${business.website || 'bizdirect.global'}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-lg font-black text-primary-600 hover:text-primary-700 tracking-tight transition-colors"
                                                >
                                                    {business.website || 'Official Site'}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => {
                                                const url = new URL(window.location.href);
                                                url.searchParams.set('showCard', 'true');
                                                if (navigator.share) {
                                                    navigator.share({ title: business.name, url: url.toString() });
                                                } else {
                                                    navigator.clipboard.writeText(url.toString());
                                                    toast.success('Card Link Copied!');
                                                }
                                            }}
                                            className="flex-1 py-5 bg-stone-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
                                        >
                                            <Share2 size={18} />
                                            Share Link
                                        </button>
                                        <button
                                            onClick={() => {
                                                toast.success("Downloading Professional Card...");
                                                downloadPDF(business, false);
                                            }}
                                            className="flex-[2] py-5 bg-[#ea580c] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-900/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                        >
                                            <Award size={18} />
                                            Download Card
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default BusinessDetail;
