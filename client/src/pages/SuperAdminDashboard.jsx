import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Users,
    Store,
    Layers,
    MapPin,
    BarChart3,
    Settings,
    MoreVertical,
    CheckCircle,
    XCircle,
    User,
    Search,
    Filter,
    ArrowUpRight,
    Loader2,
    Plus,
    Trash2,
    Edit3,
    Activity,
    CreditCard,
    Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import businessService from '../services/businessService';
import userService from '../services/userService';
import metaService from '../services/metaService';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

const SuperAdminDashboard = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview'); // overview, users, businesses, categories, cities, subadmins, settings
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBusinesses: 0,
        totalCategories: 0,
        totalCities: 0,
        pendingVerifications: 0,
        recentActivity: []
    });

    const [data, setData] = useState([]); // List for the active tab
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Modal & Form State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', icon: '', state: '', country: 'India' });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchTabData();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const [users, businesses, categories, cities] = await Promise.all([
                userService.getUsers(),
                businessService.getBusinesses({}),
                metaService.getCategories(),
                metaService.getCities()
            ]);

            setStats({
                totalUsers: users.length,
                totalBusinesses: businesses.count || businesses.data?.length || 0,
                totalCategories: categories.length,
                totalCities: cities.length,
                pendingVerifications: (businesses.data || []).filter(b => !b.isVerified).length,
                recentActivity: [] // Could be fetched from a separate log endpoint
            });
        } catch (error) {
            console.error('Failed to fetch global stats', error);
        }
    };

    const fetchTabData = async () => {
        setLoading(true);
        try {
            let result = [];
            switch (activeTab) {
                case 'users':
                    result = await userService.getUsers();
                    break;
                case 'businesses':
                    const biz = await businessService.getBusinesses({});
                    result = biz.data || [];
                    break;
                case 'categories':
                    result = await metaService.getCategories();
                    break;
                case 'cities':
                    result = await metaService.getCities();
                    break;
                case 'subadmins':
                    const allUsers = await userService.getUsers();
                    result = allUsers.filter(u => u.role === 'subadmin');
                    break;
                default:
                    result = [];
            }
            setData(result);
        } catch (error) {
            if (error.includes('not authorized')) {
                toast.error('Session expired or permissions changed');
                navigate('/');
            } else {
                toast.error(`Error loading ${activeTab}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action, currentStatus) => {
        if (action === 'delete') {
            if (!window.confirm('Are you certain? This action is permanent and cannot be reversed.')) return;
        }

        try {
            if (activeTab === 'users') {
                if (action === 'role') {
                    if (id === currentUser?._id) {
                        toast.error('You cannot change your own role from this panel to prevent accidental lockout.');
                        return;
                    }
                    
                    // Cycle roles: customer -> owner -> subadmin -> customer
                    let newRole = 'customer';
                    if (currentStatus === 'customer') newRole = 'owner';
                    else if (currentStatus === 'owner') newRole = 'subadmin';
                    else newRole = 'customer';

                    await userService.updateUser(id, { role: newRole });
                    toast.success(`Role changed to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`);
                } else if (action === 'status') {
                    await userService.updateUser(id, { isVerified: !currentStatus });
                    toast.success(!currentStatus ? 'User activated' : 'User suspended');
                } else if (action === 'delete') {
                    await userService.deleteUser(id);
                    toast.success('User account removed');
                }
            } else if (activeTab === 'businesses') {
                if (action === 'verify') {
                    await businessService.verifyBusiness(id, !currentStatus);
                    toast.success(!currentStatus ? 'Business approved' : 'Business declined/unverified');
                } else if (action === 'delete') {
                    await businessService.deleteBusiness(id);
                    toast.success('Business listing deleted');
                }
            } else if (activeTab === 'categories') {
                if (action === 'delete') {
                    await metaService.deleteCategory(id);
                    toast.success('Category removed');
                }
            } else if (activeTab === 'cities') {
                if (action === 'delete') {
                    await metaService.deleteCity(id);
                    toast.success('City/Region removed');
                }
            }
            // Refresh counts and list
            await fetchTabData();
            await fetchStats();
        } catch (error) {
            toast.error(error || 'Action failed');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (activeTab === 'categories') {
                await metaService.createCategory(formData);
                toast.success('Category created successfully');
            } else if (activeTab === 'cities') {
                await metaService.createCity(formData);
                toast.success('City hub created successfully');
            }
            setShowCreateModal(false);
            setFormData({ name: '', description: '', icon: '', state: '', country: 'India' });
            fetchTabData();
            fetchStats();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to create entry');
        } finally {
            setFormLoading(false);
        }
    };

    const navItems = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'businesses', label: 'Global Listings', icon: Store },
        { id: 'categories', label: 'Categories', icon: Layers },
        { id: 'cities', label: 'Regions/Cities', icon: MapPin },
        { id: 'subadmins', label: 'Subadmins', icon: ShieldCheck },
        { id: 'settings', label: 'System Settings', icon: Settings },
    ];

    const handleExportCSV = () => {
        if (!filteredData.length) {
            toast.error("No data available to export");
            return;
        }

        const headers = activeTab === 'users' || activeTab === 'subadmins' ? ['ID', 'Name', 'Email', 'Role', 'Status'] :
                      activeTab === 'businesses' ? ['ID', 'Name', 'Email', 'State', 'Verified'] :
                      activeTab === 'categories' ? ['ID', 'Name', 'Description'] :
                      ['ID', 'City Name', 'State', 'Country'];

        const rows = filteredData.map(item => {
            if (activeTab === 'users' || activeTab === 'subadmins') {
                return [item._id, item.name, item.email, item.role, item.isVerified ? 'Active' : 'Pending'];
            } else if (activeTab === 'businesses') {
                return [item._id, item.name, item.email, item.state, item.isVerified ? 'Yes' : 'No'];
            } else if (activeTab === 'categories') {
                return [item._id, item.name, item.description];
            } else {
                return [item._id, item.cityName, item.state, item.country];
            }
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `bizdirect_${activeTab}_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV export initiated");
    };

    const filteredData = data.filter(item => {
        const name = item.name || item.cityName || '';
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()));
        
        let matchesFilter = true;
        if (filterStatus !== 'all' && (item.isVerified !== undefined || item.isActive !== undefined)) {
            const status = item.isVerified || item.isActive;
            matchesFilter = (filterStatus === 'active' && status) || (filterStatus === 'pending' && !status);
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="pt-24 min-h-screen bg-[#fcfcfd] flex">
            {/* Left Sidebar */}
            <aside className="w-72 bg-white border-r border-stone-100 hidden lg:flex flex-col fixed h-[calc(100vh-6rem)] shadow-sm">
                <div className="p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-6">Master Control</p>
                    <nav className="space-y-1">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'}`}
                            >
                                <item.icon size={18} /> {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-6 border-t border-stone-50">
                    <div className="bg-orange-50 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black shadow-lg">SA</div>
                        <div>
                            <p className="text-xs font-black text-orange-900 leading-none mb-1">Super Admin</p>
                            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Master Key</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 p-8">
                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2">
                            {navItems.find(n => n.id === activeTab)?.label}
                        </h1>
                        <p className="text-stone-400 font-medium">Global platform administration and system monitoring.</p>
                    </div>
                    {/* Header Actions */}
                    <div className="flex items-center gap-3">
                        <button className="p-3 bg-white rounded-xl border border-stone-100 text-stone-500 hover:text-orange-600 transition-all shadow-sm">
                            <Activity size={20} />
                        </button>
                        {(activeTab === 'categories' || activeTab === 'cities') && (
                            <button 
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 px-5 py-3 premium-gradient text-white font-bold rounded-xl shadow-lg shadow-orange-100 hover:scale-105 active:scale-95 transition-all text-sm"
                            >
                                <Plus size={18} /> Add {activeTab === 'categories' ? 'Category' : 'City Hub'}
                            </button>
                        )}
                    </div>
                </header>

                {activeTab === 'overview' ? (
                    <div className="space-y-8">
                        {/* Global Stats Matrix */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { id: 'users', label: 'Platform Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
                                { id: 'businesses', label: 'Active Listings', value: stats.totalBusinesses, icon: Store, color: 'text-orange-600', bg: 'bg-orange-50', trend: stats.pendingVerifications > 0 ? `${stats.pendingVerifications} PENDING` : 'Stable', trendColor: stats.pendingVerifications > 0 ? 'text-orange-600 bg-orange-100' : 'text-stone-400 bg-stone-50' },
                                { id: 'categories', label: 'Categories', value: stats.totalCategories, icon: Layers, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'Stable' },
                                { id: 'cities', label: 'Cities/Hubs', value: stats.totalCities, icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+2' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => {
                                        setActiveTab(stat.id);
                                        if (stat.label === 'Active Listings' && stats.pendingVerifications > 0) {
                                            setFilterStatus('pending');
                                        } else {
                                            setFilterStatus('all');
                                        }
                                    }}
                                    className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-orange-100/50 transition-all border-b-4 border-b-transparent hover:border-b-orange-500 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                            <stat.icon size={24} />
                                        </div>
                                        <div className={`px-2 py-1 ${stat.trendColor || 'bg-stone-50 text-stone-400'} text-[9px] font-black uppercase tracking-widest rounded-lg`}>
                                            {stat.trend}
                                        </div>
                                    </div>
                                    <div className="text-3xl font-black text-stone-900 mb-1">{stat.value}</div>
                                    <div className="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em]">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity & Quick Controls */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm">
                                <h3 className="text-lg font-black text-stone-900 mb-6 flex items-center gap-2">
                                    <Activity size={20} className="text-orange-600" /> Platform Health & Analytics
                                </h3>
                                <div className="h-64 flex items-center justify-center bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                                    <div className="text-center">
                                        <p className="text-stone-300 font-bold uppercase tracking-widest text-xs mb-2">Live Analytics Stream</p>
                                        <p className="text-stone-400 text-xs italic">Graphs and real-time user flow will appear here.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-stone-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                                <ShieldCheck size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
                                <h3 className="text-lg font-black mb-6">Critical Actions</h3>
                                <div className="space-y-4 relative z-10">
                                    <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-left transition-all">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-300 mb-1">Security</p>
                                        <p className="text-sm font-bold">Audit System Logs</p>
                                    </button>
                                    <button className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 rounded-2xl text-left transition-all shadow-xl shadow-orange-900/50">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-100 mb-1">Scale</p>
                                        <p className="text-sm font-bold">Manage Subadmins</p>
                                    </button>
                                    <button className="w-full py-4 px-6 bg-white/5 border border-white/5 text-stone-500 cursor-not-allowed rounded-2xl text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-600 mb-1">Advanced</p>
                                        <p className="text-sm font-bold">Database Backup</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Data Filter Bar */}
                        <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:border-orange-100 outline-none transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                {['all', 'active', 'pending'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === status ? 'bg-orange-600 text-white shadow-lg' : 'bg-stone-50 text-stone-400 hover:text-stone-600 border border-transparent hover:border-stone-100'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-stone-800 transition-all shrink-0"
                            >
                                <Filter size={14} /> Export CSV
                            </button>
                        </div>

                        {/* Responsive Data Table */}
                        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl overflow-hidden">
                            {loading ? (
                                <div className="py-40 flex flex-col items-center justify-center">
                                    <Loader2 size={48} className="text-orange-600 animate-spin mb-4" />
                                    <p className="text-stone-400 font-bold">Supervising Resources...</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-stone-50 border-b border-stone-100">
                                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Entry Details</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Metadata</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Status</th>
                                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Control</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-50">
                                            {filteredData.map((item, idx) => (
                                                <tr key={item._id || idx} className="hover:bg-orange-50/20 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-black shadow-sm shrink-0">
                                                                {(item.name || item.cityName || '?').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-extrabold text-stone-900 text-sm">{item.name || item.cityName}</div>
                                                                <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                                                                    {item.email || (item.state && `State: ${item.state}`) || 'RECORD_ENTRY'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="text-xs font-semibold text-stone-500">
                                                            {activeTab === 'users' ? `Role: ${item.role}` : 
                                                             activeTab === 'businesses' ? `Owner ID: ${item.owner?.slice(-6)}` : 
                                                             'System Managed'}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        {(item.isVerified !== undefined || item.isActive !== undefined) ? (
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-400'}`}>
                                                                {item.isVerified ? 'Active/Verified' : 'Inactive/Pending'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Permanent</span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {activeTab === 'users' && (
                                                                <button 
                                                                    onClick={() => handleAction(item._id, 'role', item.role)}
                                                                    className="p-2.5 rounded-xl bg-white border border-stone-100 text-stone-400 hover:text-orange-600 transition-all hover:bg-orange-50"
                                                                    title="Change Role"
                                                                >
                                                                    <User size={18} />
                                                                </button>
                                                            )}
                                                            <button 
                                                                onClick={() => handleAction(item._id, activeTab === 'businesses' ? 'verify' : 'status', item.isVerified)}
                                                                className="p-2.5 rounded-xl bg-white border border-stone-100 text-stone-400 hover:text-emerald-600 transition-all hover:bg-emerald-50"
                                                                title="Toggle Status"
                                                            >
                                                                {item.isVerified ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                                            </button>
                                                            <button 
                                                                onClick={() => handleAction(item._id, 'delete')}
                                                                className="p-2.5 rounded-xl bg-white border border-stone-100 text-stone-400 hover:text-red-600 transition-all hover:bg-red-50"
                                                                title="Delete Entry"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredData.length === 0 && (
                                        <div className="py-24 text-center">
                                            <Globe size={48} className="mx-auto text-stone-100 mb-4" />
                                            <p className="text-stone-300 font-bold uppercase tracking-widest text-sm">No data entries found</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* CREATE MODAL */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-stone-50 flex items-center justify-between">
                                <h3 className="text-xl font-black text-stone-900">Add New {activeTab === 'categories' ? 'Category' : 'City Hub'}</h3>
                                <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-900 transition-colors"><XCircle size={24} /></button>
                            </div>
                            <form onSubmit={handleCreate} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Display Name</label>
                                    <input 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-5 py-4 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:border-orange-100 outline-none transition-all font-bold text-stone-800"
                                        placeholder={`e.g. ${activeTab === 'categories' ? 'Restaurants' : 'New Delhi'}`}
                                    />
                                </div>

                                {activeTab === 'categories' ? (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Icon Tag (Lucide Name)</label>
                                            <input 
                                                value={formData.icon}
                                                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                                className="w-full px-5 py-4 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:border-orange-100 outline-none transition-all font-bold text-stone-800"
                                                placeholder="e.g. Utensils"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Brief Description</label>
                                            <textarea 
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                className="w-full px-5 py-4 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:border-orange-100 outline-none transition-all font-bold text-stone-800 resize-none h-24"
                                                placeholder="Describe this category..."
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">State / Province</label>
                                            <input 
                                                required
                                                value={formData.state}
                                                onChange={(e) => setFormData({...formData, state: e.target.value})}
                                                className="w-full px-5 py-4 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:border-orange-100 outline-none transition-all font-bold text-stone-800"
                                                placeholder="e.g. Gujarat"
                                            />
                                        </div>
                                    </>
                                )}

                                <button
                                    disabled={formLoading}
                                    type="submit"
                                    className="w-full py-5 premium-gradient text-white font-black rounded-2xl shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter"
                                >
                                    {formLoading ? <Loader2 className="animate-spin" /> : 'Confirm & Create Entry'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SuperAdminDashboard;
