import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
    Search as SearchIcon, MapPin, Filter, Star,
    Briefcase, SlidersHorizontal, ArrowLeft,
    ChevronRight, LayoutGrid, List, X,
    Leaf, Award, Tag, CalendarCheck, ExternalLink, Rocket
} from 'lucide-react';
import businessService from '../services/businessService';
import metaService from '../services/metaService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { CATEGORY_META, GLOBAL_FALLBACK_IMAGE } from '../constants/categoryMeta';

const SearchBusinessCard = ({ biz, viewMode, onCompare, isSelected }) => {
    const navigate = useNavigate();
    const meta = CATEGORY_META[biz.category?.name] || { emoji: '📍', color: 'bg-stone-50 text-stone-600' };
    const ratingValue = Number(biz.averageRating || 0);

    const handleDigitalStore = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (biz.slug) {
            navigate(`/b/${biz.slug}`);
        } else {
            navigate(`/business/${biz._id}`);
        }
    };

    const handleGetDetails = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/business/${biz._id}?noredirect=true`);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`market-card group flex relative ${viewMode === 'list' ? 'flex-col sm:flex-row min-h-[16rem]' : 'flex-col'} ${isSelected ? 'ring-2 ring-primary-500 border-primary-500 shadow-xl scale-[1.01]' : 'hover:scale-[1.01] transition-transform'} h-full overflow-hidden`}
        >
            {/* Action Bar (Top Right) */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                {/* Rating Badge */}
                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl text-amber-500 font-black shadow-sm border border-stone-100">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs text-stone-900">{ratingValue > 0 ? ratingValue.toFixed(1) : 'New'}</span>
                </div>

                {/* Compare Checkbox */}
                <button
                    onClick={() => onCompare(biz._id.toString())}
                    className={`p-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${isSelected
                        ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-900/20'
                        : 'bg-white/95 backdrop-blur-sm text-stone-500 border-stone-100 hover:border-primary-400 hover:text-primary-600'
                        }`}
                >
                    <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-white border-white' : 'border-stone-200 group-hover:border-primary-300'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-primary-600 rounded-[2px]" />}
                    </div>
                </button>
            </div>

            {/* Media Area */}
            <div className={`relative overflow-hidden shrink-0 ${viewMode === 'list' ? 'w-full sm:w-72 h-48 sm:h-full' : 'h-48 w-full'}`}>
                {biz.images?.[0] ?
                    <img src={biz.images[0]} alt={biz.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> :
                    <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300">
                        <ImageIcon size={48} />
                    </div>
                }
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="badge-category bg-white/95 backdrop-blur-sm text-[9px] px-3 py-1.5 font-black tracking-widest uppercase rounded-lg border border-stone-200/50 shadow-sm">{biz.category?.name}</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col justify-between flex-1 text-left bg-white">
                <div>
                    <h3 className="text-2xl font-black text-stone-900 group-hover:text-primary-600 transition-colors leading-tight line-clamp-1 mb-2 italic">
                        <Link to={biz.slug ? `/b/${biz.slug}` : `/business/${biz._id}`}>{biz.name}</Link>
                    </h3>
                    <p className="text-stone-500 text-xs font-medium mb-4 line-clamp-2 leading-relaxed italic">{biz.description}</p>

                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-black uppercase tracking-widest">
                            <MapPin size={14} className="text-primary-500" />
                            {biz.city?.name}
                        </div>
                        {biz.isVerified && <span className="flex items-center gap-1 text-emerald-600 text-[9px] font-black uppercase tracking-[0.1em]"><Award size={12} /> Verified</span>}
                    </div>
                </div>

                <div className="pt-4 border-t border-stone-50">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={handleDigitalStore}
                            className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-900/20 active:scale-95 transition-all"
                        >
                            Digital Store <Rocket size={14} />
                        </button>
                        <button
                            onClick={handleGetDetails}
                            className="bg-stone-100 text-stone-800 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-stone-200 active:scale-95 transition-all"
                        >
                            Get Details <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const SearchResultPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [comparisonList, setComparisonList] = useState([]);

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        setComparisonList(list);
    }, []);

    const query = searchParams.get('search') || '';
    const categoryName = searchParams.get('category') || '';
    const city = searchParams.get('city') || '';
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    const handleCompareToggle = (bizId) => {
        const idStr = bizId.toString();
        const currentList = JSON.parse(localStorage.getItem('comparisonList') || '[]');

        let newList;
        if (currentList.includes(idStr)) {
            newList = currentList.filter(id => id !== idStr);
            toast.success('Removed from comparison');
        } else {
            if (currentList.length >= 4) {
                toast.error('Comparison list is full (max 4)');
                return;
            }
            newList = [...currentList, idStr];
            toast.success('Added to comparison!', { icon: '📊' });
        }

        localStorage.setItem('comparisonList', JSON.stringify(newList));
        setComparisonList(newList);
    };

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        setComparisonList(list);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const catData = await metaService.getCategories();
                setCategories(catData);

                let categoryId = '';
                if (categoryName) {
                    const foundCat = catData.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
                    if (foundCat) categoryId = foundCat._id;
                }

                let cityId = '';
                if (city) {
                    const cityList = await metaService.getCities();
                    const foundCity = cityList.find(c => c.name.toLowerCase() === city.toLowerCase());
                    if (foundCity) cityId = foundCity._id;
                }

                let response;
                if (lat && lng && !city) {
                    response = await businessService.getNearbyBusinesses(lat, lng, 20);
                    if (categoryName || query) {
                        let filtered = response.data || [];
                        if (categoryName) filtered = filtered.filter(b => b.category?.name?.toLowerCase() === categoryName.toLowerCase());
                        if (query) filtered = filtered.filter(b => b.name?.toLowerCase().includes(query.toLowerCase()));
                        response.data = filtered;
                    }
                } else {
                    response = await businessService.getBusinesses({
                        search: query,
                        category: categoryId,
                        city: cityId || city,
                        isVerified: true
                    });
                }
                setBusinesses(response.data || []);
            } catch (error) {
                toast.error("Failed to fetch search results");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams, query, categoryName, city, lat, lng]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pb-32"
            style={{ background: '#fffdf9' }}
        >
            <div className="container mx-auto px-4 pt-32">
                {/* Search Header */}
                <div className="bg-white p-8 md:p-12 rounded-3xl border border-orange-100 shadow-sm mb-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-50 transition-opacity" />

                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-bold mb-6 hover:gap-3 transition-all text-xs uppercase tracking-widest">
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>

                        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-4 tracking-tight uppercase italic">
                                    {categoryName || query || 'All Explorations'}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3">
                                    <p className="text-stone-400 font-semibold flex items-center gap-2 text-xs uppercase tracking-widest">
                                        <span className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
                                        Showing {businesses.length} verified listings
                                    </p>

                                    {(city || (lat && lng)) && (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100 shadow-sm">
                                            <MapPin size={12} className="text-orange-400" />
                                            <span>{city || 'Current Location'}</span>
                                            <button
                                                onClick={() => {
                                                    const newParams = new URLSearchParams(searchParams);
                                                    newParams.delete('city'); newParams.delete('lat'); newParams.delete('lng');
                                                    setSearchParams(newParams);
                                                }}
                                                className="ml-1.5 w-4 h-4 flex items-center justify-center rounded-full bg-orange-200/50 hover:bg-orange-200 hover:text-orange-800 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-orange-50 text-primary-600 rounded-xl border border-orange-100 font-bold text-xs uppercase tracking-widest"
                                >
                                    <Filter size={16} /> Filters
                                </button>
                                <div className="flex bg-orange-50 p-1.5 rounded-xl border border-orange-100">
                                    <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-primary-600' : 'text-stone-400'}`}>
                                        <LayoutGrid size={20} />
                                    </button>
                                    <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-primary-600' : 'text-stone-400'}`}>
                                        <List size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Filters Sidebar */}
                    <aside className={`w-full lg:w-80 shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-stone-50 p-7 rounded-[2.5rem] border border-stone-200 shadow-sm">
                                <div className="flex items-center justify-between mb-8 px-2">
                                    <div className="flex items-center gap-3 text-stone-900 font-black uppercase tracking-[0.2em] text-[10px]">
                                        <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100">
                                            <SlidersHorizontal size={16} />
                                        </div>
                                        <span>Browse by Category</span>
                                    </div>
                                    <button onClick={() => setShowMobileFilters(false)} className="lg:hidden text-stone-400 p-2 hover:bg-stone-50 rounded-lg transition-all"><X size={20} /></button>
                                </div>
                                <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                    <button onClick={() => { setSearchParams({}); setShowMobileFilters(false); }}
                                        className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest group ${!categoryName ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/20 scale-[1.02]' : 'text-stone-700 hover:bg-stone-50 hover:text-primary-600'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${!categoryName ? 'bg-white/20' : 'bg-stone-100 group-hover:bg-primary-100 group-hover:text-primary-600'}`}>
                                            <LayoutGrid size={16} />
                                        </div>
                                        All Listings
                                    </button>
                                    {categories.map(cat => {
                                        // Robust lookup matching the logic in Home.jsx
                                        const metaKey = Object.keys(CATEGORY_META).find(k => k.toLowerCase() === cat.name.toLowerCase()) ||
                                            Object.keys(CATEGORY_META).find(k => k.toLowerCase().includes(cat.name.toLowerCase())) ||
                                            Object.keys(CATEGORY_META).find(k => cat.name.toLowerCase().includes(k.toLowerCase()));

                                        const meta = CATEGORY_META[metaKey] || { icon: Briefcase };
                                        const Icon = meta.icon;
                                        const isActive = categoryName?.toLowerCase() === cat.name.toLowerCase();

                                        return (
                                            <button key={cat._id} onClick={() => {
                                                const params = new URLSearchParams(searchParams);
                                                params.set('category', cat.name);
                                                setSearchParams(params);
                                                setShowMobileFilters(false);
                                            }}
                                                className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest group ${isActive ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/20 scale-[1.02]' : 'text-stone-700 hover:bg-stone-50 hover:text-primary-600'}`}>
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 ${isActive ? 'bg-white/20' : 'bg-stone-100 group-hover:bg-primary-100 group-hover:text-primary-600'}`}>
                                                    <Icon size={16} />
                                                </div>
                                                <span className="truncate">{cat.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                                {[1, 2, 3, 4].map(n => <div key={n} className="h-72 bg-white border border-stone-100 rounded-3xl animate-pulse" />)}
                            </div>
                        ) : businesses.length > 0 ? (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                                {businesses.map(biz => (
                                    <SearchBusinessCard
                                        key={biz._id}
                                        biz={biz}
                                        viewMode={viewMode}
                                        onCompare={handleCompareToggle}
                                        isSelected={comparisonList.includes(biz._id.toString())}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-orange-100">
                                <SearchIcon size={64} className="mx-auto text-orange-200 mb-6" />
                                <h3 className="text-2xl font-black text-stone-900 mb-2 uppercase italic">No Discoveries Found</h3>
                                <p className="text-stone-400 text-sm font-bold uppercase tracking-widest mb-10">Try a different search or location</p>
                                <button onClick={() => setSearchParams({})} className="btn btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest">Clear All Filters</button>
                            </div>
                        )}
                    </main>
                </div>
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
                                    {comparisonList.map(id => (
                                        <div key={id} className="w-10 h-10 rounded-full border-2 border-stone-800 bg-stone-700 flex items-center justify-center text-[10px] text-white font-bold">
                                            {id.slice(-2).toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-white text-xs font-black uppercase tracking-widest">{comparisonList.length} Businesses Selected</p>
                                    <p className="text-stone-400 text-[10px] font-medium hidden sm:block">Analyze them side-by-side</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button onClick={() => { localStorage.setItem('comparisonList', JSON.stringify([])); setComparisonList([]); }}
                                    className="text-stone-400 hover:text-white px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-colors">Clear</button>
                                <Link to="/compare" className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg ${comparisonList.length >= 2 ? 'bg-primary-600 text-white shadow-primary-900/20' : 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-50'}`}>
                                    {comparisonList.length < 2 ? `Add ${2 - comparisonList.length} More` : 'Compare Now'}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SearchResultPage;
