import React, { useState, useEffect } from 'react';
import {
    Store,
    Plus,
    BarChart3,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    MessageCircle,
    Star,
    Edit3,
    Trash2,
    Settings,
    Briefcase,
    ShieldCheck,
    FileUp,
    ChevronRight,
    ArrowUpRight,
    Loader2,
    LayoutDashboard,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import businessService from '../services/businessService';
import { toast } from 'react-hot-toast';

const OwnerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, my-businesses, analytics, reviews
    const navigate = useNavigate();

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        setLoading(true);
        try {
            const res = await businessService.getBusinesses({ owner: user?._id });
            setBusinesses(res.data || []);
        } catch (error) {
            toast.error('Failed to load your businesses');
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Total Listings', value: businesses.length, icon: Store, bg: 'bg-orange-50', color: 'text-orange-600' },
        { label: 'Total Views', value: businesses.reduce((acc, curr) => acc + (curr.views || 0), 0), icon: Eye, bg: 'bg-orange-50', color: 'text-orange-600' },
        { label: 'Verified', value: businesses.filter(b => b.isVerified).length, icon: ShieldCheck, bg: 'bg-green-50', color: 'text-green-600' },
        { label: 'Total Reviews', value: businesses.reduce((acc, curr) => acc + (curr.reviewCount || 0), 0), icon: MessageCircle, bg: 'bg-blue-50', color: 'text-blue-600' },
    ];

    const handleDelete = async (id) => {
        if (!window.confirm('Are you certain? This listing will be removed permanently.')) return;
        try {
            await businessService.deleteBusiness(id);
            toast.success('Listing removed successfully');
            fetchBusinesses();
        } catch (error) {
            toast.error(error || 'Failed to delete listing');
        }
    };

    return (
        <div className="pt-28 min-h-screen bg-[#fffdfa] pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg">
                                <LayoutDashboard size={20} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-stone-900 tracking-tight">Owner Dashboard</h1>
                                <p className="text-stone-400 font-medium text-sm italic">Manage and grow your business listings.</p>
                            </div>
                        </div>
                    </div>
                    <Link
                        to="/add-business"
                        className="flex items-center gap-2 px-6 py-4 bg-orange-600 text-white font-black uppercase tracking-tighter rounded-2xl shadow-xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all text-sm shine-effect"
                    >
                        <Plus size={20} /> List New Business
                    </Link>
                </header>

                {/* Dashboard Tabs */}
                <div className="flex bg-white p-1.5 rounded-2xl border border-stone-100 shadow-sm mb-12 w-fit">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'my-businesses', label: 'My Businesses', icon: Store },
                        { id: 'analytics', label: 'Analytics', icon: Eye },
                        { id: 'reviews', label: 'Customer Reviews', icon: MessageCircle },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, i) => (
                                <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                                            <stat.icon size={24} />
                                        </div>
                                        <div className="text-green-500 bg-green-50 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                            Live <ArrowUpRight size={10} />
                                        </div>
                                    </div>
                                    <div className="text-4xl font-black text-stone-900 mb-1">{stat.value}</div>
                                    <div className="text-xs text-stone-400 font-bold uppercase tracking-[0.2em]">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Listings & Quick Actions */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-stone-100 shadow-sm">
                                <h3 className="text-xl font-black text-stone-900 mb-8 flex items-center gap-3">
                                    <Store size={22} className="text-orange-600" /> Recent Listings
                                </h3>

                                {loading ? (
                                    <div className="py-20 flex justify-center"><Loader2 size={32} className="animate-spin text-orange-200" /></div>
                                ) : businesses.length === 0 ? (
                                    <div className="text-center py-20 border-2 border-dashed border-stone-100 rounded-[2rem]">
                                        <div className="text-4xl mb-4">🏠</div>
                                        <p className="text-stone-400 font-bold italic">No businesses listed yet.</p>
                                        <Link to="/add-business" className="mt-4 inline-block text-orange-600 font-black uppercase text-xs tracking-widest underline">Start Now</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {businesses.slice(0, 3).map(biz => (
                                            <div key={biz._id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-orange-50/50 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-black overflow-hidden shadow-sm shrink-0">
                                                        {biz.images?.[0] ? <img src={biz.images[0]} className="w-full h-full object-cover" /> : <Briefcase size={22} />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-extrabold text-stone-900 group-hover:text-orange-600 transition-colors">{biz.name}</h4>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{biz.city?.name}</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${biz.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                {biz.isVerified ? 'Verified' : 'Pending'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Link to={biz.slug ? `/store/${biz.slug}` : `/business/${biz._id}`} className="p-3 rounded-xl bg-white border border-stone-100 text-stone-400 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm">
                                                    <ChevronRight size={18} />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-stone-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-orange-900/40">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl" />
                                <h3 className="text-xl font-black mb-8 relative z-10">Verification Hub</h3>
                                <div className="space-y-4 relative z-10">
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileUp size={20} className="text-orange-400" />
                                            <p className="font-bold text-sm">Upload Documents</p>
                                        </div>
                                        <p className="text-xs text-stone-400 font-medium leading-relaxed">Upload GST, PAN or Trade license for the "Verified" badge.</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 opacity-50 cursor-not-allowed">
                                        <div className="flex items-center gap-3 mb-2">
                                            <ShieldCheck size={20} className="text-green-400" />
                                            <p className="font-bold text-sm">Badge Status</p>
                                        </div>
                                        <p className="text-xs text-stone-500 font-medium leading-relaxed">System checking your latest uploads...</p>
                                    </div>
                                    <button className="w-full py-4 mt-4 bg-orange-600 rounded-xl font-black uppercase tracking-tighter text-sm shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all">
                                        Boost Visibility
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'my-businesses' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {businesses.map(biz => (
                                <div key={biz._id} className="bg-white rounded-[3rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all group">
                                    <div className="relative h-48 bg-stone-100">
                                        {biz.images?.[0] ? (
                                            <img src={biz.images[0]} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-stone-300"><Store size={48} /></div>
                                        )}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button className="p-2.5 rounded-xl bg-white/90 backdrop-blur shadow-lg text-stone-600 hover:text-orange-600 transition-colors">
                                                <Edit3 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(biz._id)} className="p-2.5 rounded-xl bg-white/90 backdrop-blur shadow-lg text-stone-600 hover:text-red-600 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xl font-black text-stone-900">{biz.name}</h4>
                                            {biz.isVerified ? <CheckCircle size={20} className="text-green-500" /> : <Clock size={20} className="text-amber-500" />}
                                        </div>
                                        <p className="text-stone-400 text-sm font-medium line-clamp-2 mb-6">{biz.description}</p>

                                        <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                                            <div className="flex items-center gap-4 text-stone-400">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-300">Reviews</span>
                                                    <span className="font-bold text-stone-700 text-xs">{biz.reviewCount || 0}</span>
                                                </div>
                                                <div className="h-6 w-[1px] bg-stone-100" />
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-300">Rating</span>
                                                    <span className="font-bold text-stone-700 text-xs">{biz.averageRating?.toFixed(1) || '0.0'}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-stone-50">
                                                <Link to={`/business/builder/${biz._id}`} className="flex-1 py-3 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-700 transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-orange-100">
                                                    <Layout size={14} /> Launch Studio
                                                </Link>
                                                <Link to={biz.slug ? `/store/${biz.slug}` : `/business/${biz._id}`} className="px-4 py-3 bg-stone-50 text-stone-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-stone-900 hover:text-white transition-all text-center">
                                                    View Live
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'analytics' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 border border-stone-100 shadow-sm">
                            <h3 className="text-xl font-black text-stone-900 mb-8 flex items-center gap-3">
                                <BarChart3 size={22} className="text-orange-600" /> Business Performance
                            </h3>

                            {businesses.length === 0 ? (
                                <div className="text-center py-20 bg-stone-50 rounded-[2rem]">
                                    <p className="text-stone-400 font-bold italic">Add a business to see analytics.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] font-black uppercase tracking-widest text-stone-400 border-b border-stone-50">
                                                <th className="pb-4 px-4 font-black">Business Name</th>
                                                <th className="pb-4 px-4 font-black">Total Views</th>
                                                <th className="pb-4 px-4 font-black">Reviews</th>
                                                <th className="pb-4 px-4 font-black">Rating</th>
                                                <th className="pb-4 px-4 font-black text-right">Boosted Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-50">
                                            {businesses.map(biz => (
                                                <tr key={biz._id} className="group hover:bg-stone-50/50 transition-colors">
                                                    <td className="py-5 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black text-xs">
                                                                {biz.name.charAt(0)}
                                                            </div>
                                                            <span className="font-bold text-stone-900">{biz.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4 font-black text-stone-900">{biz.views || 0}</td>
                                                    <td className="py-5 px-4 font-bold text-stone-500">{biz.reviewCount || 0}</td>
                                                    <td className="py-5 px-4">
                                                        <div className="flex items-center gap-1.5 text-amber-500">
                                                            <Star size={14} fill="currentColor" />
                                                            <span className="font-bold text-stone-900">{biz.averageRating?.toFixed(1) || '0.0'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4 text-right">
                                                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                            Normal
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'reviews' && (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-stone-200">
                        <div className="text-5xl mb-6">💬</div>
                        <h3 className="text-xl font-black text-stone-900 mb-2">Customer Reviews Insights Coming Soon</h3>
                        <p className="text-stone-400 font-medium italic max-w-xs mx-auto">We're building a centralized system to manage all your customer feedback.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;
