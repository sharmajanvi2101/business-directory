import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Search, MapPin, Star, ArrowRight, ChevronRight,
    ShieldCheck, TrendingUp, Users, Building2,
    Phone, LocateFixed, Loader2, Navigation2,
    BadgeCheck, CheckCircle2, Heart, ArrowLeftRight, X, Rocket, Tag, Award
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFavorites } from '../store/slices/authSlice';
import userService from '../services/userService';
import businessService from '../services/businessService';
import metaService from '../services/metaService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Import Assets
import HERO_IMG from '../assets/shop_illustration_hq.jpg';
import RESTAURANT_IMG from '../assets/restaurant.png';
import RETAIL_IMG from '../assets/retail.png';
import DOCTOR_IMG from '../assets/doctor.png';
import GYM_IMG from '../assets/gym.png';
import ELECTRICIAN_IMG from '../assets/electrician.png';
import PALANPUR_IMG from '../assets/palanpur.png';

import { CATEGORY_META, GLOBAL_FALLBACK_IMAGE } from '../constants/categoryMeta';
const QUERY_SUGGESTIONS = [
    'Kirana Store', 'Tea Stall', 'Bakery', 'Medical Store', 'Vegetable Shop',
    'Mobile Repair', 'Barber Shop', 'Tailor', 'Restaurants', 'Doctor', 'Gym'
];





// --- Sub-Components ---
const CountUp = ({ to, suffix = '', duration = 1.5 }) => {
    const [count, setCount] = useState(0);
    const nodeRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const end = parseInt(to);
        if (isNaN(end) || end === 0) {
            setCount(0);
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                let start = 0;
                let totalMiliseconds = duration * 1000;
                let incrementTime = totalMiliseconds / end;

                let timer = setInterval(() => {
                    start += 1;
                    if (start > end) {
                        setCount(end);
                        clearInterval(timer);
                    } else {
                        setCount(start);
                    }
                    if (start === end) clearInterval(timer);
                }, Math.max(incrementTime, 10));

                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (nodeRef.current) observer.observe(nodeRef.current);
        return () => observer.disconnect();
    }, [to, duration]);

    return <span ref={nodeRef}>{count}{suffix}</span>;
};

const BusinessCard = ({ biz, i, isFavorite, onToggleFavorite, onAddToComparison }) => {
    const navigate = useNavigate();
    const meta = CATEGORY_META[biz.category?.name] || { color: 'bg-gray-50 text-gray-600', coverUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000' };
    const ratingValue = Number(biz.averageRating || 0);

    const handleDigitalStore = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (biz.slug) navigate(`/b/${biz.slug}`);
        else navigate(`/business/${biz._id}`);
    };

    const handleGetDetails = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/business/${biz._id}?noredirect=true`);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i || 0) * 0.04 }} className="market-card group hover:scale-[1.01] transition-transform">
            <div className="relative h-44 overflow-hidden rounded-t-[1.5rem]">
                {biz.images?.[0] ? <img src={biz.images[0]} alt={biz.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <img src={meta.coverUrl} alt={biz.name} className="w-full h-full object-cover opacity-90 saturate-[0.85] group-hover:opacity-100 transition-all duration-500" />}

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="badge-category bg-white/95 backdrop-blur-sm text-[8px] px-3 py-1.5 font-black tracking-[0.15em] uppercase rounded-lg border border-stone-200/50 shadow-sm">{biz.category?.name}</span>
                    {biz.isVerified && <span className="bg-emerald-500 text-white text-[8px] px-2 py-1 rounded-lg font-black uppercase flex items-center gap-1 shadow-lg shadow-emerald-900/20"><ShieldCheck size={10} /> Verified</span>}
                </div>

                {/* Rating Badge (Compact) */}
                <div className="absolute top-3 right-28 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-amber-500 font-bold border border-stone-100 z-10 shadow-sm">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] text-stone-900">{ratingValue > 0 ? ratingValue.toFixed(1) : 'New'}</span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                        onClick={(e) => { 
                            e.preventDefault(); 
                            e.stopPropagation(); 
                            onToggleFavorite(biz._id.toString()); 
                        }}
                        className={`p-3 sm:p-2 rounded-xl backdrop-blur-md transition-all pointer-events-auto relative z-20 ${isFavorite ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/20' : 'bg-white/90 text-stone-600 hover:text-rose-500 border border-stone-100'}`}
                    >
                        <Heart size={18} className="sm:size-[16px]" fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToComparison(biz._id.toString()); }}
                        className="p-2 rounded-xl backdrop-blur-md bg-white/90 text-stone-600 hover:text-primary-600 border border-stone-100 transition-all"
                        title="Add to Comparison"
                    >
                        <ArrowLeftRight size={16} />
                    </button>
                </div>
            </div>

            <div className="p-5 bg-white rounded-b-[1.5rem] border-x border-b border-stone-100">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-black text-stone-900 text-lg leading-snug group-hover:text-primary-600 transition-colors line-clamp-1 italic">
                        <Link to={biz.slug ? `/b/${biz.slug}` : `/business/${biz._id}`}>{biz.name}</Link>
                    </h3>
                </div>
                <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mb-4 italic">{biz.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDigitalStore}
                            className="bg-primary-600 text-white px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-900/20 active:scale-95 transition-all"
                        >
                            Digital Store <Rocket size={12} />
                        </button>
                        <button
                            onClick={handleGetDetails}
                            className="bg-stone-100 text-stone-900 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-stone-200 active:scale-95 transition-all"
                        >
                            Get Details <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


const SectionHeader = ({ title, subtitle, children }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
        </div>
        {children}
    </div>
);

const CategoryCard = ({ cat, userLocation, searchCity }) => {
    // Robust case-insensitive & partial match lookup
    const catName = cat.name || '';
    const metaKey = Object.keys(CATEGORY_META).find(k => k.toLowerCase() === catName.toLowerCase()) ||
        Object.keys(CATEGORY_META).find(k => k.toLowerCase().includes(catName.toLowerCase())) ||
        Object.keys(CATEGORY_META).find(k => catName.toLowerCase().includes(k.toLowerCase())) ||
        catName;

    const meta = CATEGORY_META[metaKey] ||
        CATEGORY_META['Retail'] ||
        { color: 'bg-stone-50 text-stone-900', border: 'border-stone-100', icon: Building2, coverUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80&v=2' };

    const searchParams = new URLSearchParams();
    searchParams.set('category', cat.name);

    if (userLocation) {
        if (userLocation.cityName) searchParams.set('city', userLocation.cityName);
        searchParams.set('lat', userLocation.lat);
        searchParams.set('lng', userLocation.lng);
    } else if (searchCity) {
        searchParams.set('city', searchCity);
    }

    const Icon = meta.icon || Building2;

    return (
        <motion.div whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to={`/search?${searchParams.toString()}`} className={`group relative flex flex-col items-center justify-center h-48 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary-900/20 transition-all border border-stone-300`}>
                <div className="absolute inset-0 z-0">
                    <img src={meta.coverUrl || meta.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 blur-[1.5px] group-hover:blur-0" />
                    <div className="absolute inset-0 bg-stone-900/50 transition-colors duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 flex flex-col items-center px-4 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:bg-[#ea580c] group-hover:border-[#ea580c]/50 transition-all duration-500 shadow-lg">
                        <Icon size={28} />
                    </div>
                    <span className="font-black text-[13px] uppercase tracking-[0.15em] text-white leading-tight drop-shadow-lg">{cat.name}</span>
                </div>
            </Link>
        </motion.div>
    );
};

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState(() => {
        try {
            const saved = localStorage.getItem('bizDirect_location');
            return saved ? JSON.parse(saved) : null;
        } catch (_) { return null; }
    });
    const [searchCity, setSearchCity] = useState(() => {
        try {
            const saved = localStorage.getItem('bizDirect_location');
            if (saved) return JSON.parse(saved).cityName || '';
        } catch (_) { }
        return '';
    });
    const [businesses, setBusinesses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [platformStats, setPlatformStats] = useState({
        businesses: 0,
        cities: 0,
        categories: 0
    });
    const [querySuggestions, setQuerySuggestions] = useState([]);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showQuerySug, setShowQuerySug] = useState(false);
    const [showCitySug, setShowCitySug] = useState(false);

    // Location states
    const [locationLoading, setLocationLoading] = useState(false);
    const [comparisonList, setComparisonList] = useState([]);

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        setComparisonList(list);
    }, []);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const handleToggleFavorite = async (bizId) => {
        if (!user) {
            toast.error('Please login to save favorites');
            navigate('/login');
            return;
        }

        try {
            const currentFavorites = user.favorites || [];
            // Use some and toString to be safe with different ID formats
            const isFav = currentFavorites.some(id => id.toString() === bizId);
            const newFavorites = isFav
                ? currentFavorites.filter(id => id.toString() !== bizId)
                : [...currentFavorites, bizId];

            // Optimistic update
            dispatch(updateFavorites(newFavorites));

            const res = await userService.toggleFavorite(bizId);
            toast.success(res.message, { icon: isFav ? '💔' : '❤️' });
        } catch (error) {
            // Rollback on error
            if (user?.favorites) {
                dispatch(updateFavorites(user.favorites));
            }
            toast.error(error?.message || 'Failed to update favorites');
        }
    };

    const handleAddToComparison = (bizId) => {
        const currentList = JSON.parse(localStorage.getItem('comparisonList') || '[]');

        let newList;
        if (currentList.includes(bizId)) {
            newList = currentList.filter(id => id !== bizId);
            toast.success('Removed from comparison');
        } else {
            if (currentList.length >= 4) {
                toast.error('Comparison list is full (max 4)');
                return;
            }
            newList = [...currentList, bizId];
            toast.success('Added to comparison!', { icon: '📊' });
        }

        localStorage.setItem('comparisonList', JSON.stringify(newList));
        setComparisonList(newList);
    };


    // Persist location whenever it changes
    useEffect(() => {
        if (userLocation) {
            localStorage.setItem('bizDirect_location', JSON.stringify(userLocation));
            if (userLocation.cityName) setSearchCity(userLocation.cityName);
        } else {
            localStorage.removeItem('bizDirect_location');
        }
    }, [userLocation]);

    // Re-fetch nearby businesses and stats when location is detected
    useEffect(() => {
        if (userLocation && cities.length > 0) {
            fetchNearby(userLocation);
        }
    }, [userLocation, cities]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bizData, catData, cityData, statsData] = await Promise.all([
                    businessService.getBusinesses({ isVerified: true, limit: 8 }),
                    metaService.getCategories(),
                    metaService.getCities(),
                    metaService.getStats()
                ]);
                const confirmedCities = cityData || [];
                setBusinesses(bizData.data || []);
                setCategories(catData || []);
                setCities(confirmedCities);

                if (statsData) {
                    console.log(`📊 Dynamic Stats Loaded: ${statsData.businesses} Businesses across ${statsData.cities} Cities`);
                    setPlatformStats(statsData);
                }
            } catch (e) {
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Only on mount

    const fetchNearby = async (loc, currentCities = []) => {
        if (!loc) return;
        setLoading(true); // Reuse main loading
        try {
            const cityName = loc.cityName || '';
            const citiesToSearch = currentCities.length > 0 ? currentCities : cities;
            const matchedCity = citiesToSearch.find(c => c.name.toLowerCase() === cityName.toLowerCase());

            if (matchedCity) {
                // STRICT CITY FILTER using ID
                const [res, cityStats] = await Promise.all([
                    businessService.getBusinesses({ isVerified: true, city: matchedCity._id, limit: 8 }),
                    metaService.getStats({ city: matchedCity._id })
                ]);
                setBusinesses(res.data || []);
                if (cityStats) setPlatformStats(cityStats);
            } else if (cityName) {
                // FALLBACK to City Name text for stats + Nearby radius for businesses
                const [nearbyRes, cityStats] = await Promise.all([
                    businessService.getNearbyBusinesses(loc.lat, loc.lng, 15),
                    metaService.getStats({ city: cityName })
                ]);
                setBusinesses(nearbyRes.data || []);
                if (cityStats) setPlatformStats(cityStats);
            } else {
                // Absolute fallback to global
                const [globalRes, globalStats] = await Promise.all([
                    businessService.getBusinesses({ isVerified: true, limit: 8 }),
                    metaService.getStats()
                ]);
                setBusinesses(globalRes.data || []);
                setPlatformStats(globalStats);
            }
        } catch (_) {
            setBusinesses([]);
        } finally {
            setLoading(false);
        }
    };

    // ── Auto-detect location ──────────────────────────────────────────────
    const detectLocation = (explicitCities = [], isManual = true) => {
        if (!navigator.geolocation) {
            if (isManual) toast.error('Geolocation is not supported by your browser');
            return;
        }
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                try {
                    // Reverse geocode using free Nominatim API (no key required)
                    const geoRes = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                    );
                    const geoData = await geoRes.json();
                    const cityName =
                        geoData.address?.city ||
                        geoData.address?.town ||
                        geoData.address?.village ||
                        geoData.address?.county ||
                        '';
                    const locObj = { lat, lng, cityName };
                    setUserLocation(locObj);

                    // Trigger nearby fetch immediately
                    fetchNearby(locObj, explicitCities.length > 0 ? explicitCities : cities);
                    if (isManual) {
                        toast.success(`📍 Location detected: ${cityName || 'Your area'}`);
                    }
                } catch (err) {
                    if (isManual) toast.error('Could not detect city name');
                } finally {
                    setLocationLoading(false);
                }
            },
            (err) => {
                setLocationLoading(false);
                if (isManual) {
                    if (err.code === err.PERMISSION_DENIED) {
                        toast.error('Location permission denied. Please allow to find nearby businesses.');
                    } else {
                        toast.error('Could not get your location. Try again.');
                    }
                }
            },
            { timeout: 10000, maximumAge: 60000 }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery && !searchCity) return;
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (searchCity) params.set('city', searchCity);
        navigate(`/search?${params.toString()}`);
    };

    const handleQueryChange = (val) => {
        setSearchQuery(val);
        if (val.trim()) {
            const f = QUERY_SUGGESTIONS.filter(s => s.toLowerCase().includes(val.toLowerCase()));
            setQuerySuggestions(f);
            setShowQuerySug(f.length > 0);
        } else {
            setShowQuerySug(false);
        }
    };

    // Fetch businesses when city input changes (debounced-ish via state dependency)
    useEffect(() => {
        const fetchByCity = async () => {
            if (!searchCity || userLocation) return;
            setLoading(true);
            try {
                // Find city object to get ID
                const matchedCity = cities.find(c => c.name.toLowerCase() === searchCity.toLowerCase());
                const params = { isVerified: true, limit: 8 };
                if (matchedCity) {
                    params.city = matchedCity._id;
                    const cityStats = await metaService.getStats({ city: matchedCity._id });
                    if (cityStats) setPlatformStats(cityStats);
                } else {
                    params.search = searchCity; // fallback search if city ID not found
                    const totalStats = await metaService.getStats();
                    setPlatformStats(totalStats);
                }

                const res = await businessService.getBusinesses(params);
                setBusinesses(res.data || []);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchByCity, 500);
        return () => clearTimeout(timer);
    }, [searchCity, cities, userLocation]);

    const handleCityChange = (val) => {
        setSearchCity(val);
        // If user types manually, we clear the GPS "near me" state
        if (val && userLocation) setUserLocation(null);

        if (val.trim()) {
            const f = cities.filter(c => c.name.toLowerCase().includes(val.toLowerCase())).slice(0, 6);
            setCitySuggestions(f);
            setShowCitySug(f.length > 0);
        } else {
            setShowCitySug(false);
            // If cleared, restore original featured businesses and global stats
            if (!val) {
                Promise.all([
                    businessService.getBusinesses({ isVerified: true, limit: 8 }),
                    metaService.getStats()
                ]).then(([res, stats]) => {
                    setBusinesses(res.data || []);
                    if (stats) setPlatformStats(stats);
                });
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-h-screen pb-32"
            style={{ background: '#fffdf9' }}
        >
            {/* =========================================
                HERO SECTION — Marketplace Style
            ========================================= */}
            <section className="hero-gradient pt-28 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden scale-110">
                    <img
                        src={HERO_IMG}
                        alt="Background"
                        className="w-full h-full object-cover opacity-75 blur-[4px] transition-all duration-700"
                    />
                    {/* Multi-layered gradient for text readability and cinematic feel */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/60" />
                </div>

                {/* Decorative circles */}
                <div className="absolute top-10 left-[-80px] w-72 h-72 bg-white/5 rounded-full" />
                <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 bg-black/10 rounded-full" />
                <div className="absolute top-1/2 right-[5%] w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Tag pill */}
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-8 border border-white/20">
                            <BadgeCheck size={16} className="text-yellow-300" />
                            India's Most Trusted Local Business Directory
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight px-4 drop-shadow-[0_5px_20px_rgba(0,0,0,0.8)]">
                            Find Trusted<br />
                            <span className="text-yellow-300 drop-shadow-[0_2px_10px_rgba(255,180,0,0.4)]">Local Businesses</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white mb-10 md:mb-14 font-medium max-w-2xl mx-auto leading-relaxed px-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                            Search restaurants, doctors, electricians, gyms, and more — all verified & near you.
                        </p>

                        {/* ---- SEARCH BOX ---- */}
                        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2.5 shadow-2xl shadow-orange-900/20 max-w-3xl mx-auto flex flex-col md:flex-row gap-2">
                            {/* What */}
                            <div className="relative flex-[2]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={20} />
                                <input
                                    value={searchQuery}
                                    onChange={e => handleQueryChange(e.target.value)}
                                    onFocus={() => searchQuery && setShowQuerySug(true)}
                                    onBlur={() => setTimeout(() => setShowQuerySug(false), 150)}
                                    className="w-full pl-12 pr-4 py-3.5 text-stone-700 font-medium rounded-xl outline-none text-sm bg-orange-50 border border-transparent focus:bg-white focus:border-orange-200 transition-all"
                                    placeholder="Restaurants, Doctor, Gym..."
                                />
                                <AnimatePresence>
                                    {showQuerySug && (
                                        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-orange-100 z-50 overflow-hidden">
                                            {querySuggestions.map(s => (
                                                <button key={s} type="button" onMouseDown={() => {
                                                    setSearchQuery(s);
                                                    setShowQuerySug(false);
                                                    const params = new URLSearchParams();
                                                    params.set('search', s);
                                                    if (searchCity) params.set('city', searchCity);
                                                    navigate(`/search?${params.toString()}`);
                                                }}
                                                    className="w-full text-left px-4 py-3 hover:bg-orange-50 text-stone-700 font-medium text-sm flex items-center gap-2">
                                                    <Search size={14} className="text-orange-400" /> {s}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px bg-orange-100 my-1.5 " />

                            {/* Where */}
                            <div className="relative flex-1">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ea580c]" size={20} />
                                <input
                                    value={searchCity}
                                    onChange={e => handleCityChange(e.target.value)}
                                    onFocus={() => searchCity && setShowCitySug(true)}
                                    onBlur={() => setTimeout(() => setShowCitySug(false), 150)}
                                    className="w-full pl-12 pr-14 py-3.5 text-stone-700 font-medium rounded-xl outline-none text-sm bg-orange-50 border border-transparent focus:bg-white focus:border-orange-200 transition-all"
                                    placeholder="City"
                                />
                                {/* GPS detect button inside city input */}
                                <button
                                    type="button"
                                    onClick={() => detectLocation(cities, true)}
                                    disabled={locationLoading}
                                    title="Auto-detect my location"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 transition-all disabled:opacity-50"
                                >
                                    {locationLoading
                                        ? <Loader2 size={16} className="animate-spin" />
                                        : <LocateFixed size={16} />}
                                </button>
                                <AnimatePresence>
                                    {showCitySug && (
                                        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-orange-100 z-50 overflow-hidden">
                                            {citySuggestions.map(c => (
                                                <button key={c._id} type="button" onMouseDown={() => { setSearchCity(c.name); setShowCitySug(false); }}
                                                    className="w-full text-left px-4 py-3 hover:bg-orange-50 text-stone-700 font-medium text-sm flex items-center gap-2">
                                                    <MapPin size={14} className="text-orange-400" /> {c.name}, {c.state}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button type="submit"
                                className="px-8 py-3.5 premium-gradient-green text-white font-bold rounded-xl hover:opacity-90 transition-all shine-effect text-sm shadow-lg shadow-green-200">
                                Search
                            </button>
                        </form>

                        {/* Quick tags */}
                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                            {QUERY_SUGGESTIONS.map(s => (
                                <button key={s} onClick={() => {
                                    const params = new URLSearchParams();
                                    params.set('search', s);
                                    if (searchCity) params.set('city', searchCity);
                                    navigate(`/search?${params.toString()}`);
                                }}
                                    className="px-4 py-1.5 bg-white/20 border border-white/30 text-white text-xs font-semibold rounded-full hover:bg-white/30 transition-all">
                                    {s}
                                </button>
                            ))}
                        </div>

                    </div>
                </div>
            </section>

            <section className="trust-bar mt-20">
                <div className=" container mx-auto px-4 flex flex-wrap justify-center md:justify-around">
                    {[
                        { label: 'Verified Businesses', value: platformStats.businesses, suffix: '+', icon: Building2 },
                        { label: 'Cities Covered', value: platformStats.cities, suffix: '+', icon: MapPin },
                        { label: 'Categories', value: platformStats.categories, suffix: '', icon: TrendingUp },
                    ].map(({ label, value, suffix, icon: Icon }) => (
                        <div key={label} className="stat-item text-center py-6 group cursor-default">
                            <Icon size={26} className="text-[#ea580c] mx-auto mb-2 group-hover:scale-110 group-hover:text-orange-600 transition-all duration-300" />
                            <div className="text-2xl font-black text-stone-900">
                                <CountUp to={value} suffix={suffix} />
                            </div>
                            <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider mt-0.5 group-hover:text-stone-600 transition-colors">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {!loading && (
                <section className="container mx-auto px-4 py-16">
                    <SectionHeader title="Browse by Category" subtitle="Find exactly what you're looking for">
                        <div className="flex items-center gap-6">
                            {(userLocation || searchCity) && (
                                <button onClick={() => {
                                    setUserLocation(null);
                                    setSearchCity('');
                                    setLoading(true);
                                    Promise.all([
                                        metaService.getStats(),
                                        businessService.getBusinesses({ isVerified: true, limit: 8 })
                                    ]).then(([stats, res]) => {
                                        setPlatformStats(stats);
                                        setBusinesses(res.data || []);
                                        setLoading(false);
                                    });
                                }}
                                    className="text-stone-600 hover:text-stone-600 font-bold text-xs uppercase tracking-widest border border-stone-200 px-3 py-1.5 rounded-xl transition-all">Clear Location</button>
                            )}
                            <Link to={`/search?${new URLSearchParams({
                                ...(searchCity ? { city: searchCity } : {}),
                                ...(userLocation?.lat ? { lat: userLocation.lat, lng: userLocation.lng } : {})
                            }).toString()}`} className="text-[#ea580c] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all">
                                VIEW ALL <ChevronRight size={16} strokeWidth={3} />
                            </Link>
                        </div>
                    </SectionHeader>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map(cat => (
                            <CategoryCard
                                key={cat._id}
                                cat={cat}
                                userLocation={userLocation}
                                searchCity={searchCity}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* =========================================
                UNIFIED EXPLORER SECTION
            ========================================= */}
            <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fffcf9, #fff7ed)' }}>
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl -z-10" />
                <div className="container mx-auto px-4">
                    <SectionHeader
                        title={
                            searchCity
                                ? `Verified Businesses in ${searchCity}`
                                : userLocation
                                    ? "Businesses Near You"
                                    : "Featured Businesses"
                        }
                        subtitle={
                            searchCity
                                ? `Showing ${platformStats.businesses} verified places found in ${searchCity}`
                                : userLocation?.cityName
                                    ? `Showing ${platformStats.businesses} verified places in ${userLocation.cityName}`
                                    : "Top-rated & verified listings across all cities"
                        }
                    >
                        <div className="flex items-center gap-4">
                            {(userLocation || searchCity) && (
                                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                    <ShieldCheck size={12} /> Live city filter active
                                </div>
                            )}
                            <Link to={`/search?${new URLSearchParams({
                                ...(searchCity ? { city: searchCity } : {}),
                                ...(userLocation?.lat ? { lat: userLocation.lat, lng: userLocation.lng } : {})
                            }).toString()}`} className="btn btn-primary text-xs shine-effect self-start py-2.5">
                                Browse All in {searchCity || userLocation?.cityName || 'India'} <ArrowRight size={14} />
                            </Link>
                        </div>
                    </SectionHeader>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <div key={n} className="h-72 rounded-2xl bg-orange-50 animate-pulse" />)}
                        </div>
                    ) : businesses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {businesses
                                .filter((biz, index, self) => index === self.findIndex(t => t.category?.name === biz.category?.name))
                                .slice(0, 8)
                                .map((biz, i) => (
                                    <BusinessCard
                                        key={biz._id}
                                        biz={biz}
                                        i={i}
                                        isFavorite={user?.favorites?.some(favId => favId.toString() === biz._id.toString())}
                                        onToggleFavorite={handleToggleFavorite}
                                        onAddToComparison={handleAddToComparison}
                                    />
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-stone-200">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center text-stone-300 shadow-inner">
                                    <Building2 size={40} />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-stone-900 mb-2">Expansion in Progress</h3>
                            <p className="text-stone-600 max-w-sm mx-auto font-medium">We're expanding rapidly to your area! Try searching for a different city or category.</p>
                            <button onClick={() => { setSearchCity(''); setUserLocation(null); }} className="mt-8 text-[#ea580c] font-black text-xs uppercase tracking-widest border-b-2 border-[#ea580c] pb-1 hover:text-orange-700 transition-colors">Show All Featured Businesses</button>
                        </div>
                    )}
                </div>
            </section>




            {/* =========================================
                CITY SPOTLIGHT
            ========================================= */}
            <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fffdf9 100%)' }}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-[#ea580c] rounded-full text-[10px] font-black uppercase tracking-wider mb-6 border border-orange-200 shadow-sm">
                                <MapPin size={12} className="text-[#ea580c]" /> Featured City Highlight
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-5 leading-tight">
                                Discover Businesses<br />
                                <span className="premium-gradient-text">in {searchCity || userLocation?.cityName || 'Palanpur'}</span>
                            </h2>
                            <p className="text-stone-500 text-lg leading-relaxed mb-8 max-w-lg">
                                Explore {platformStats.businesses}+ verified restaurants, hospitals, electricians, gyms, and more in {searchCity || userLocation?.cityName || 'Palanpur'}.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-8">
                                {['Restaurants', 'Doctor', 'Gym', 'Electrician'].map(cat => (
                                    <Link key={cat} to={`/search?city=${encodeURIComponent(searchCity || userLocation?.cityName || 'Palanpur')}&category=${cat}`}
                                        className="category-chip">
                                        {cat}
                                    </Link>
                                ))}
                            </div>

                        </div>

                        <div className="flex-1 relative">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { name: 'Palanpur Rasoi', cat: 'Restaurants', rating: 4.8, img: RESTAURANT_IMG },
                                    { name: 'Arogya Hospital', cat: 'Doctor', rating: 4.8, img: DOCTOR_IMG },
                                    { name: 'PowerZone Fitness', cat: 'Gym', rating: 4.7, img: GYM_IMG },
                                    { name: 'Bhavani Electricals', cat: 'Electrician', rating: 4.7, img: ELECTRICIAN_IMG },
                                ].map(({ name, cat, rating, img }) => (
                                    <Link key={name} to={`/search?city=${encodeURIComponent(searchCity || userLocation?.cityName || 'Palanpur')}&search=${encodeURIComponent(name)}`} className="market-card group overflow-hidden block">
                                        <div className="h-28 relative overflow-hidden">
                                            <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-stone-900/20" />
                                        </div>
                                        <div className="p-3 text-center">
                                            <div className="font-bold text-sm text-stone-900 mb-0.5 line-clamp-1">{name}</div>
                                            <div className="text-[9px] text-stone-600 uppercase tracking-widest font-semibold mb-1.5">{cat}</div>
                                            <div className="flex items-center justify-center gap-1 text-amber-500">
                                                <Star size={10} fill="currentColor" />
                                                <span className="text-xs font-bold text-stone-600">{rating}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            {/* Palanpur main background image */}
                            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 opacity-10 blur-xl">
                                <img src={PALANPUR_IMG} alt="" className="w-full h-full object-cover rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* =========================================
                TRUST SECTION
            ========================================= */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl border border-orange-100 p-8 md:p-14 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                <ShieldCheck size={14} /> 100% Verified
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-5 leading-tight">
                                Trusted by {platformStats.businesses}+ Businesses<br />Across {platformStats.cities}+ Cities
                            </h2>
                            <div className="space-y-4">
                                {[
                                    `Over ${platformStats.businesses}+ businesses manually reviewed`,
                                    'Real ratings from real customers — no fake reviews',
                                    'Direct contact — no commissions or middlemen',
                                    'Local businesses, supporting local communities',
                                ].map(item => (
                                    <div key={item} className="flex items-center gap-3">
                                        <CheckCircle2 size={20} className="text-secondary-600 shrink-0" />
                                        <span className="text-stone-600 font-medium text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Verified Businesses', value: platformStats.businesses, suffix: '+', bg: 'bg-orange-50', text: 'text-orange-700' },
                                { label: 'Cities Covered', value: platformStats.cities, suffix: '+', bg: 'bg-blue-50', text: 'text-blue-700' },
                                { label: 'Total Categories', value: platformStats.categories, suffix: '', bg: 'bg-amber-50', text: 'text-amber-700' },
                            ].map(({ label, value, suffix, bg, text }) => (
                                <div key={label} className={`${bg} rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow`}>
                                    <div className={`text-3xl font-black ${text} mb-1`}>
                                        <CountUp to={value} suffix={suffix} />
                                    </div>
                                    <div className="text-xs text-stone-500 font-semibold uppercase tracking-wider">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
                CTA — LIST YOUR BUSINESS
            ========================================= */}
            <section className="hero-gradient py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
                            List Your Business<br />
                            <span className="text-yellow-300">Reach More Customers</span>
                        </h2>
                        <p className="text-orange-100 text-lg font-medium">
                            Join {platformStats.businesses}+ verified businesses and start getting discovered today. Free to list.
                        </p>
                    </div>
                </div>
            </section>

            {/* Comparison Floating Bar */}
            <AnimatePresence>
                {comparisonList.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                        className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-1.5rem)] max-w-xl bg-stone-900/95 border border-white/10 px-4 py-3 md:px-6 md:py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2 md:-space-x-3">
                                    {comparisonList.slice(0, 3).map(id => (
                                        <div key={id} className="w-9 h-9 md:w-11 md:h-11 rounded-full border-2 border-stone-800 bg-stone-800 flex items-center justify-center text-[10px] text-white font-bold shadow-lg ring-1 ring-white/5">
                                            {id.slice(-2).toUpperCase()}
                                        </div>
                                    ))}
                                    {comparisonList.length > 3 && (
                                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-full border-2 border-stone-800 bg-stone-800 flex items-center justify-center text-[10px] text-white font-bold shadow-lg ring-1 ring-white/5">
                                            +{comparisonList.length - 3}
                                        </div>
                                    )}
                                </div>
                                <div className="hidden xs:block">
                                    <p className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.15em]">{comparisonList.length} Selected</p>
                                    <p className="text-stone-500 text-[9px] font-bold md:block hidden">Side-by-side</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:gap-4">
                                <button 
                                    onClick={() => { localStorage.setItem('comparisonList', JSON.stringify([])); setComparisonList([]); }}
                                    className="text-stone-500 hover:text-white px-2 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Clear
                                </button>
                                <Link 
                                    to="/compare" 
                                    className={`px-5 py-3 md:px-8 md:py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all shadow-xl ${
                                        comparisonList.length >= 2 
                                        ? 'bg-[#ea580c] text-white shadow-orange-900/40 hover:scale-105 active:scale-95' 
                                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                                    }`}
                                >
                                    {comparisonList.length < 2 ? `Add ${2 - comparisonList.length} more` : 'Compare'}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Home;
