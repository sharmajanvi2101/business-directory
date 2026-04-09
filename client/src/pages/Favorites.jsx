import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Heart, MapPin, Star, ChevronRight, 
    Trash2, Search, Building2, Ghost
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import userService from '../services/userService';
import { updateFavorites } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { CATEGORY_META } from '../constants/categoryMeta';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await userService.getFavorites();
                setFavorites(data);
            } catch (error) {
                toast.error('Failed to load favorites');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchFavorites();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleRemoveFavorite = async (bizId) => {
        const originalFavorites = [...favorites];
        const originalUserFavs = user?.favorites ? [...user.favorites] : [];

        try {
            // Optimistic update local state
            setFavorites(prev => prev.filter(f => f._id.toString() !== bizId));
            
            // Update Redux store
            if (user && user.favorites) {
                const newFavs = user.favorites.filter(id => id.toString() !== bizId);
                dispatch(updateFavorites(newFavs));
            }

            const res = await userService.toggleFavorite(bizId);
            toast.success(res.message || 'Removed from favorites', { icon: '💔' });
        } catch (error) {
            // Rollback
            setFavorites(originalFavorites);
            dispatch(updateFavorites(originalUserFavs));
            toast.error(error?.message || 'Failed to remove favorite');
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#fffdf9]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                        >
                            <Heart size={14} fill="currentColor" /> My Collection
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight"
                        >
                            Your <span className="text-rose-500">Favorites</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-stone-500 mt-2 font-medium"
                        >
                            Saved businesses you'd like to visit again.
                        </motion.p>
                    </div>

                    <Link to="/search" className="btn bg-white border-2 border-stone-200 text-stone-600 hover:border-primary-500 hover:text-primary-600 flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm">
                        <Search size={18} /> Explore More
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="h-80 rounded-2xl bg-stone-100 animate-pulse" />
                        ))}
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {favorites.map((biz, i) => {
                                const meta = CATEGORY_META[biz.category?.name] || { emoji: '📍', color: 'bg-gray-50 text-gray-600' };
                                return (
                                    <motion.div 
                                        key={biz._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="market-card group"
                                    >
                                        <div className="relative h-44 overflow-hidden">
                                            {biz.images?.[0] ? (
                                                <img src={biz.images[0]} alt={biz.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className={`w-full h-full ${meta.color.split(' ')[0]} flex items-center justify-center`}>
                                                    <span className="text-6xl">{meta.emoji}</span>
                                                </div>
                                            )}
                                            
                                            <button 
                                                onClick={() => handleRemoveFavorite(biz._id)}
                                                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-rose-500 rounded-full shadow-lg hover:bg-rose-500 hover:text-white transition-all duration-300"
                                                title="Remove from favorites"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <div className="absolute bottom-3 left-3">
                                                <span className="badge-category">{biz.category?.name}</span>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-primary-600 transition-colors line-clamp-1">
                                                    {biz.name}
                                                </h3>
                                                <div className="flex items-center gap-1 text-amber-500 shrink-0">
                                                    <Star size={14} fill="currentColor" />
                                                    <span className="text-xs font-bold text-stone-600">
                                                        {biz.averageRating?.toFixed(1) || 'New'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-1.5 text-stone-400 text-xs font-medium mb-4">
                                                <MapPin size={13} className="text-primary-500" />
                                                {biz.city?.name || 'Local Area'}
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-stone-50">
                                                <Link 
                                                    to={`/business/${biz._id}`} 
                                                    className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 hover:gap-2 transition-all"
                                                >
                                                    View Details <ChevronRight size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto text-center py-20"
                    >
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Ghost size={48} className="text-rose-200" />
                        </div>
                        <h2 className="text-2xl font-black text-stone-900 mb-3">Your list is empty</h2>
                        <p className="text-stone-500 mb-8 font-medium">
                            Explore businesses and tap the heart icon to save those you like.
                        </p>
                        <Link to="/search" className="btn btn-primary shine-effect px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                            <Building2 size={20} /> Start Discovering
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
