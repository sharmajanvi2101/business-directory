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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-3 bg-white border border-orange-100 rounded-2xl text-stone-600 hover:text-primary-600 hover:shadow-lg transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-black text-stone-900 tracking-tight italic uppercase">Compare</h1>
                            <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-1">Side-by-side analysis</p>
                        </div>
                    </div>
                    {businesses.length > 0 && (
                        <button 
                            onClick={clearAll}
                            className="flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        >
                            <Trash2 size={16} /> Clear All
                        </button>
                    )}
                </div>

                {businesses.length === 0 ? (
                    <div className="text-center py-20 md:py-32 bg-white rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-orange-100 mx-4 md:mx-0">
                        <ArrowLeftRight size={48} className="mx-auto text-orange-200 mb-6" />
                        <h2 className="text-xl md:text-2xl font-black text-stone-900 mb-2">Empty List</h2>
                        <p className="text-stone-400 font-medium mb-8 px-6">Add businesses from their profiles to compare them here.</p>
                        <Link to="/search" className="btn btn-primary px-8 py-4">
                            Start Exploring
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar">
                        <div className="flex gap-4 md:gap-6 pb-4 px-4 md:px-2 min-w-max">
                            {businesses.map((biz, idx) => (
                                <motion.div 
                                    key={biz._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="w-[280px] sm:w-[340px] snap-center bg-white rounded-[2rem] md:rounded-[2.5rem] border border-orange-100 shadow-xl shadow-orange-100/30 overflow-hidden flex flex-col relative group"
                                >
                                    {/* Remove Button */}
                                    <button 
                                        onClick={() => removeFromComparison(biz._id)}
                                        className="absolute top-4 right-4 z-10 p-2 bg-black/40 text-white rounded-xl backdrop-blur-md opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                    >
                                        <X size={16} />
                                    </button>

                                    {/* Image/Hero Section */}
                                    <div className="h-40 md:h-48 relative overflow-hidden">
                                        {biz.images?.[0] ? (
                                            <img src={biz.images[0]} alt={biz.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                                                <Zap size={40} className="text-orange-200" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-6 right-6">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-orange-600 text-[7px] md:text-[8px] text-white font-black uppercase tracking-widest rounded-full">
                                                    {biz.category?.name}
                                                </span>
                                            </div>
                                            <h3 className="text-white font-black text-lg md:text-xl italic uppercase tracking-tighter truncate">{biz.name}</h3>
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="p-6 md:p-8 flex-grow space-y-6 md:space-y-8">
                                        {/* Verification & Rating */}
                                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                                            <div className="p-3 md:p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                                <div className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Rating</div>
                                                <div className="flex items-center gap-1.5">
                                                    <Star size={14} className="text-orange-500" fill="currentColor" />
                                                    <span className="font-black text-stone-800 text-base md:text-lg">{biz.averageRating}</span>
                                                </div>
                                            </div>
                                            <div className="p-3 md:p-4 bg-secondary-50/50 rounded-2xl border border-secondary-100">
                                                <div className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Status</div>
                                                {biz.isVerified ? (
                                                    <div className="flex items-center gap-1.5 text-secondary-600">
                                                        <ShieldCheck size={16} />
                                                        <span className="font-black text-[10px] md:text-xs uppercase italic">Verified</span>
                                                    </div>
                                                ) : (
                                                    <span className="font-black text-stone-400 text-[10px] md:text-xs uppercase italic">Pending</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Contact & Location */}
                                        <div className="space-y-4 pt-4 border-t border-orange-50 text-[11px] md:text-xs">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                                                    <MapPin size={14} />
                                                </div>
                                                <span className="font-bold text-stone-600">{biz.city?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                                                    <Phone size={14} />
                                                </div>
                                                <span className="font-bold text-stone-600">{biz.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                                                    <Globe size={14} />
                                                </div>
                                                <span className="font-bold text-stone-600 truncate max-w-[150px]">
                                                    {biz.website?.replace(/https?:\/\//, '') || 'Direct Contact'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Comparison Points */}
                                        <div className="pt-4 border-t border-orange-50 space-y-3">
                                            <h4 className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest">About</h4>
                                            <p className="text-[11px] md:text-xs text-stone-500 font-medium leading-relaxed line-clamp-3 italic">
                                                "{biz.description}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="p-5 md:p-6 bg-stone-50 border-t border-orange-50">
                                        <Link 
                                            to={`/business/${biz._id}`}
                                            className="w-full btn btn-primary py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                            {/* Empty Add Slot */}
                            <Link 
                                to="/search"
                                className="w-[280px] sm:w-[340px] snap-center bg-stone-50/50 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-orange-100 flex flex-col items-center justify-center p-8 hover:bg-orange-50 hover:border-orange-200 transition-all group"
                            >
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white border border-orange-100 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform shadow-sm mb-4">
                                    <Plus size={28} />
                                </div>
                                <h3 className="font-black text-stone-900 italic uppercase tracking-tighter text-sm md:text-base">Add More</h3>
                                <p className="text-[9px] md:text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Select another</p>
                            </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Compare;
