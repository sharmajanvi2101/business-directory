import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Users,
    Store,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    ChevronRight,
    Loader2,
    ArrowUpRight,
    Mail,
    Phone,
    Calendar,
    BadgeCheck,
    Briefcase,
    FileText,
    MessageSquare,
    AlertTriangle,
    Flag,
    MoreHorizontal,
    MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import businessService from '../services/businessService';
import userService from '../services/userService';

const SubAdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('businesses'); // businesses, reports, verification-docs
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, verified, unverified

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'businesses') {
                const res = await businessService.getBusinesses({});
                setBusinesses(res.data || []);
            } else {
                // For reports and verification docs, we could fetch separate endpoints
                // For now, we'll keep businesses as the primary focus for subadmins
                setBusinesses([]);
            }
        } catch (error) {
            if (typeof error === 'string' && error.toLowerCase().includes('not authorized')) {
                toast.error('Access denied or permissions changed');
                navigate('/');
            } else {
                toast.error(`Failed to fetch ${activeTab}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyBusiness = async (id, status) => {
        try {
            await businessService.verifyBusiness(id, status);
            toast.success(status ? 'Business verified!' : 'Business unverified');
            setBusinesses(prev => prev.map(b => b._id === id ? { ...b, isVerified: status } : b));
        } catch (error) {
            toast.error('Failed to update verification status');
        }
    };

    const filteredBusinesses = businesses.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.city?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'verified' && b.isVerified) ||
            (filterStatus === 'unverified' && !b.isVerified);
        return matchesSearch && matchesFilter;
    });

    const stats = [
        { label: 'Assigned Listings', value: businesses.length, icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Pending Review', value: businesses.filter(b => !b.isVerified).length, icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Flagged Content', value: 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Verified Today', value: businesses.filter(b => b.isVerified && new Date(b.updatedAt).toDateString() === new Date().toDateString()).length, icon: BadgeCheck, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <div className="pt-28 min-h-screen bg-[#fffdf9] pb-20">
            <div className="container mx-auto px-4">
                <header className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1">
                                    <ShieldCheck size={10} /> Regional Moderator
                                </span>
                            </div>
                            <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2">Sub-Admin Workspace</h1>
                            <p className="text-stone-500 font-medium italic">Monitor local listings, verify identities, and handle reports in your zone.</p>
                        </div>
                        <div className="flex bg-white p-1.5 rounded-2xl border border-stone-100 shadow-sm overflow-x-auto">
                            {[
                                { id: 'businesses', label: 'Listing Reviews', icon: Store },
                                { id: 'reports', label: 'Moderation Queue', icon: Flag },
                                { id: 'verification-docs', label: 'Document Verification', icon: FileText },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-stone-400 hover:text-stone-600'}`}
                                >
                                    <tab.icon size={16} /> {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-green-500 bg-green-50 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    Active <ArrowUpRight size={10} />
                                </div>
                            </div>
                            <div className="text-3xl font-black text-stone-900 mb-1">{stat.value}</div>
                            <div className="text-xs text-stone-400 font-bold uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Filter & Search */}
                <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search in your assigned region..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:border-orange-100 outline-none transition-all text-sm font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Filter size={18} className="text-stone-400" />
                        {['all', 'verified', 'unverified'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-stone-900 text-white shadow-lg' : 'bg-stone-50 text-stone-400 hover:text-stone-600'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl overflow-hidden">
                    {loading ? (
                        <div className="py-40 flex flex-col items-center justify-center">
                            <Loader2 size={48} className="text-orange-600 animate-spin mb-4" />
                            <p className="text-stone-400 font-bold animate-pulse">Fetching records...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {activeTab === 'businesses' ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-stone-50 border-b border-stone-100">
                                            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Business Listing</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Location / Info</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Status</th>
                                            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Moderation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-50">
                                        {filteredBusinesses.map((biz) => (
                                            <tr key={biz._id} className="hover:bg-orange-50/20 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-black shrink-0 overflow-hidden">
                                                            {biz.images?.[0] ? <img src={biz.images[0]} className="w-full h-full object-cover" /> : <Store size={22} />}
                                                        </div>
                                                        <div>
                                                            <div className="font-extrabold text-stone-900 text-sm group-hover:text-orange-600 transition-colors">{biz.name}</div>
                                                            <div className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Submitted {new Date(biz.createdAt).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500">
                                                            <MapPin size={12} /> {biz.city?.name || 'Area Not Specified'}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500">
                                                            <Mail size={12} /> {biz.email || 'No Email'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {biz.isVerified ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest">
                                                            <CheckCircle size={12} /> Live Listing
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest">
                                                            <AlertTriangle size={12} /> Action Required
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            className="p-2 rounded-xl border border-stone-100 text-stone-400 hover:text-stone-900 hover:bg-stone-50 shadow-sm"
                                                            title="View Documents"
                                                        >
                                                            <FileText size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleVerifyBusiness(biz._id, !biz.isVerified)}
                                                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${biz.isVerified ? 'text-red-500 hover:bg-red-50' : 'bg-orange-600 text-white shadow-lg shadow-orange-100 hover:scale-105 active:scale-95'}`}
                                                        >
                                                            {biz.isVerified ? 'Reject' : 'Approve'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="py-32 text-center">
                                    <MessageSquare size={48} className="mx-auto text-stone-100 mb-4" />
                                    <p className="text-stone-300 font-bold uppercase tracking-widest text-sm">No items in the {activeTab} queue</p>
                                </div>
                            )}

                            {activeTab === 'businesses' && filteredBusinesses.length === 0 && !loading && (
                                <div className="py-32 text-center">
                                    <div className="text-stone-300 font-bold uppercase tracking-widest text-sm">No matching listings found</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubAdminDashboard;
