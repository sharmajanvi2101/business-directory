import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
    Briefcase, MapPin, Phone, Globe, Mail,
    Clock, Plus, Trash2, ChevronRight, ChevronDown,
    CheckCircle2, Rocket, ArrowRight, Layout
} from 'lucide-react';
import metaService from '../services/metaService';
import businessService from '../services/businessService';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const AddBusiness = () => {
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();

    // Fill form if coming back from login
    useEffect(() => {
        if (location.state?.formData) {
            reset(location.state.formData);
        }
    }, [location.state, reset]);

    // Restrict to Guests or Owners/Admins only
    useEffect(() => {
        if (user && user.role === 'customer') {
            toast.error('Please use a Business Owner account to list.');
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [catData, cityData] = await Promise.all([
                    metaService.getCategories(),
                    metaService.getCities()
                ]);
                setCategories(catData);
                setCities(cityData);
            } catch (error) {
                toast.error('Failed to load metadata');
            }
        };
        fetchMeta();
    }, []);

    const onSubmit = async (data) => {
        if (!user) {
            toast.error('Please login to submit your business');
            navigate('/login', { state: { from: '/add-business', formData: data } });
            return;
        }

        // Clean up optional fields that might be empty strings
        const submissionData = { ...data };
        if (!submissionData.email) delete submissionData.email;
        if (!submissionData.website) delete submissionData.website;

        setLoading(true);
        try {
            await businessService.createBusiness(submissionData);
            toast.success('Business listing created! Awaiting verification.');
            navigate('/owner/dashboard');
        } catch (error) {
            toast.error(error || 'Failed to create business');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4" style={{ background: '#fffdf9' }}>
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="bg-white p-12 md:p-16 rounded-[3.5rem] border border-orange-100 shadow-sm mb-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-60" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
                            >
                                <Rocket size={14} /> Business Dashboard
                            </motion.div>
                            <h1 className="text-4xl md:text-6xl font-black text-stone-900 tracking-tighter mb-4 leading-tight">
                                List your <br />
                                <span className="premium-gradient-text text-5xl md:text-7xl">Business.</span>
                            </h1>
                            <p className="text-stone-400 font-medium text-lg max-w-sm">Reach local customers in Palanpur & beyond by listing your service today.</p>
                        </div>

                        <div className="hidden lg:block w-48 h-48 bg-orange-50/50 rounded-[3rem] border border-orange-100 flex items-center justify-center relative shadow-inner">
                            <Layout size={60} className="text-orange-200" />
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl animate-bounce">
                                <Plus size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Form Main Side */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Basic Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-orange-100 shadow-sm"
                        >
                            <h2 className="text-2xl font-black text-stone-900 mb-10 flex items-center gap-4">
                                <div className="p-3 bg-orange-50 text-primary-600 rounded-2xl border border-orange-100">
                                    <Briefcase size={24} />
                                </div>
                                Business Profile
                            </h2>
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">Business Name</label>
                                    <input
                                        {...register('name', { required: 'Name is required' })}
                                        className="input-premium"
                                        placeholder="e.g. Skyline Architecture Firm"
                                    />
                                    {errors.name && <p className="mt-2 text-xs text-red-500 font-bold">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">About the Business</label>
                                    <textarea
                                        {...register('description', { required: 'Description is required' })}
                                        rows="6"
                                        className="input-premium resize-none"
                                        placeholder="Describe your expertise and what makes you unique..."
                                    ></textarea>
                                    {errors.description && <p className="mt-2 text-xs text-red-500 font-bold">{errors.description.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="relative">
                                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">Category</label>
                                        <div className="relative">
                                            <select
                                                {...register('category', { required: 'Required' })}
                                                className="input-premium bg-white appearance-none pr-10"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((c) => (
                                                    <option key={c._id} value={c._id}>{c.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">City</label>
                                        <div className="relative">
                                            <select
                                                {...register('city', { required: 'Required' })}
                                                className="input-premium bg-white appearance-none pr-10"
                                            >
                                                <option value="">Select City</option>
                                                {cities.map((c) => (
                                                    <option key={c._id} value={c._id}>{c.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact & Location */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-orange-100 shadow-sm"
                        >
                            <h2 className="text-2xl font-black text-stone-900 mb-10 flex items-center gap-4">
                                <div className="p-3 bg-orange-50 text-primary-600 rounded-2xl border border-orange-100">
                                    <MapPin size={24} />
                                </div>
                                Contact & Venue
                            </h2>
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">Full Address</label>
                                    <input
                                        {...register('address', { required: 'Address is required' })}
                                        className="input-premium"
                                        placeholder="123 Innovation Drive, Tech Hub, Downtown"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">Latitude (Optional)</label>
                                        <input
                                            {...register('lat')}
                                            type="number"
                                            step="any"
                                            className="input-premium"
                                            placeholder="e.g. 24.1722"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">Longitude (Optional)</label>
                                        <input
                                            {...register('lng')}
                                            type="number"
                                            step="any"
                                            className="input-premium"
                                            placeholder="e.g. 72.4333"
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-stone-400 font-bold italic -mt-4 pl-1">
                                    Tip: Right-click your location on Google Maps to get precise coordinates. Leaving these blank will default to search-based navigation.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">Phone Number</label>
                                    <div className="relative group">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-300 group-focus-within:text-primary-500 transition-colors z-10 pointer-events-none" size={18} />
                                            <input
                                                {...register('phone', { required: 'Required' })}
                                                className="input-premium !pl-14"
                                                placeholder="+91 00000 00000"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">Official Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-300 group-focus-within:text-primary-500 transition-colors z-10 pointer-events-none" size={18} />
                                            <input
                                                {...register('email')}
                                                className="input-premium !pl-14"
                                                placeholder="contact@company.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">Website URL</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-300 group-focus-within:text-primary-500 transition-colors z-10 pointer-events-none" size={18} />
                                        <input
                                            {...register('website')}
                                            className="input-premium !pl-14"
                                            placeholder="https://www.yourdomain.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar / Guidelines */}
                    <aside className="space-y-10">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-orange-100 shadow-sm sticky top-28">
                            <h3 className="text-xl font-black text-stone-900 mb-8 tracking-tight">Listing Guidelines</h3>
                            <div className="space-y-6">
                                {[
                                    { title: 'Imagery', text: 'Use high-resolution photos of your workspace.' },
                                    { title: 'Clarity', text: 'Be specific about your hours and location.' },
                                    { title: 'Trust', text: 'Firms with verified emails get 3x more leads.' }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-secondary-50 flex items-center justify-center text-secondary-500 shrink-0">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-stone-900 text-sm mb-1">{step.title}</p>
                                            <p className="text-xs text-stone-400 font-medium leading-relaxed">{step.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 space-y-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn btn-primary py-4 rounded-xl flex items-center justify-center gap-3 group disabled:opacity-70 shine-effect shadow-xl shadow-orange-100"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : !user ? (
                                        <>
                                            <span className="text-lg font-black italic uppercase tracking-tighter">Login or Sign Up</span>
                                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-lg font-black italic uppercase tracking-tighter">{user.role === 'customer' ? 'List & Upgrade Profile' : 'Submit Listing'}</span>
                                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </button>
                                
                                {!user && (
                                    <p className="text-[10px] text-stone-400 font-bold text-center uppercase tracking-widest px-4">
                                        You need an account to publish. Your data will be kept.
                                    </p>
                                )}
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="w-full py-4 text-stone-400 font-bold text-sm hover:text-stone-600 transition-colors"
                                >
                                    Save Draft
                                </button>
                            </div>
                        </div>
                    </aside>
                </form>
            </div>
        </div>
    );
};

export default AddBusiness;
