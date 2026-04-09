import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, ArrowLeftRight, Star, MapPin, 
    Phone, Globe, Zap, ShieldCheck, Trash2, X, Plus
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import businessService from '../services/businessService';
import { toast } from 'react-hot-toast';

const Compare = () => {
    const navigate = useNavigate();
    const [comparisonList, setComparisonList] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load comparison list from localStorage
        const list = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        setComparisonList(list);
    }, []);

    useEffect(() => {
        const fetchBusinesses = async () => {
            if (comparisonList.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const results = await Promise.all(
                    comparisonList.map(id => businessService.getBusinessById(id))
                );
                setBusinesses(results.filter(b => b !== null));
            } catch (error) {
                console.error('Error fetching comparison data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, [comparisonList]);

    const removeFromComparison = (id) => {
        const newList = comparisonList.filter(bizId => bizId !== id);
        setComparisonList(newList);
        localStorage.setItem('comparisonList', JSON.stringify(newList));
        setBusinesses(prev => prev.filter(b => b._id !== id));
        toast.success('Removed from comparison');
    };

    const clearAll = () => {
        setComparisonList([]);
        localStorage.setItem('comparisonList', JSON.stringify([]));
        setBusinesses([]);
        toast.success('Comparison list cleared');
    };

    if (loading) {
        return (
            <div className="pt-32 flex flex-col items-center justify-center min-h-screen bg-[#fffdf9]">
                <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin mb-4" />
                <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Comparing businesses...</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pt-32 pb-20 bg-[#fffdf9]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-3 bg-white border border-orange-100 rounded-2xl text-stone-600 hover:text-primary-600 hover:shadow-lg transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-stone-900 tracking-tight italic uppercase">Compare Side-by-Side</h1>
                            <p className="text-stone-400 font-bold uppercase tracking-widest text-xs mt-1">Make better decisions with data</p>
                        </div>
                    </div>
                    {businesses.length > 0 && (
                        <button 
                            onClick={clearAll}
                            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        >
                            <Trash2 size={16} /> Clear List
                        </button>
                    )}
                </div>

                {businesses.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-orange-100">
                        <ArrowLeftRight size={64} className="mx-auto text-orange-200 mb-6" />
                        <h2 className="text-2xl font-black text-stone-900 mb-2">No businesses to compare</h2>
                        <p className="text-stone-400 font-medium mb-8">Add businesses from their detail pages to see them side-by-side.</p>
                        <Link to="/search" className="btn btn-primary px-8 py-4">
                            Browse Businesses
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-8 scrollbar-hide">
                        <div className="flex gap-6 min-w-max pb-4 px-2">
                            {businesses.map((biz, idx) => (
                                <motion.div 
                                    key={biz._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="w-[340px] bg-white rounded-[2.5rem] border border-orange-100 shadow-xl shadow-orange-100/30 overflow-hidden flex flex-col relative group"
                                >
                                    {/* Remove Button */}
                                    <button 
                                        onClick={() => removeFromComparison(biz._id)}
                                        className="absolute top-4 right-4 z-10 p-2 bg-black/40 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                    >
                                        <X size={16} />
                                    </button>

                                    {/* Image/Hero Section */}
                                    <div className="h-48 relative overflow-hidden">
                                        {biz.images?.[0] ? (
                                            <img src={biz.images[0]} alt={biz.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                                                <Zap size={48} className="text-orange-200" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-6 right-6">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-orange-600 text-[8px] text-white font-black uppercase tracking-widest rounded-full">
                                                    {biz.category?.name}
                                                </span>
                                            </div>
                                            <h3 className="text-white font-black text-xl italic uppercase tracking-tighter truncate">{biz.name}</h3>
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="p-8 flex-grow space-y-8">
                                        {/* Verification & Rating */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                                <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Rating</div>
                                                <div className="flex items-center gap-1.5">
                                                    <Star size={16} className="text-orange-500" fill="currentColor" />
                                                    <span className="font-black text-stone-800 text-lg">{biz.averageRating}</span>
                                                </div>
                                                <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">({biz.reviewCount || 0} reviews)</div>
                                            </div>
                                            <div className="p-4 bg-secondary-50/50 rounded-2xl border border-secondary-100">
                                                <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Status</div>
                                                {biz.isVerified ? (
                                                    <div className="flex items-center gap-1.5 text-secondary-600">
                                                        <ShieldCheck size={18} />
                                                        <span className="font-black text-xs uppercase italic">Verified</span>
                                                    </div>
                                                ) : (
                                                    <span className="font-black text-stone-400 text-xs uppercase italic">Pending</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Contact & Location */}
                                        <div className="space-y-4 pt-4 border-t border-orange-50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                                                    <MapPin size={16} />
                                                </div>
                                                <span className="text-xs font-bold text-stone-600">{biz.city?.name}, Gujarat</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                                                    <Phone size={16} />
                                                </div>
                                                <span className="text-xs font-bold text-stone-600">{biz.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                                                    <Globe size={16} />
                                                </div>
                                                <span className="text-xs font-bold text-stone-600 truncate max-w-[180px]">
                                                    {biz.website?.replace(/https?:\/\//, '') || 'Not Published'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Comparison Points */}
                                        <div className="pt-4 border-t border-orange-50 space-y-4">
                                            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Description</h4>
                                            <p className="text-xs text-stone-500 font-medium leading-relaxed line-clamp-4 italic">
                                                "{biz.description}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="p-6 bg-stone-50 border-t border-orange-50">
                                        <Link 
                                            to={`/business/${biz._id}`}
                                            className="w-full btn btn-primary py-3.5 rounded-xl text-xs font-black uppercase tracking-widest"
                                        >
                                            View Full Profile
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                            {/* Empty Add Slot */}
                            <Link 
                                to="/search"
                                className="w-[340px] bg-stone-50/50 rounded-[2.5rem] border-2 border-dashed border-orange-100 flex flex-col items-center justify-center p-8 hover:bg-orange-50 hover:border-orange-200 transition-all group"
                            >
                                <div className="w-16 h-16 rounded-full bg-white border border-orange-100 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform shadow-sm mb-4">
                                    <Plus size={32} />
                                </div>
                                <h3 className="font-black text-stone-900 italic uppercase tracking-tighter">Add More</h3>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Select another business</p>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Compare;
