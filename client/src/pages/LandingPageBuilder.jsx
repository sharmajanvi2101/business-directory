import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    Layout, Save, Image as ImageIcon, Plus, 
    Trash2, List, Megaphone, Sparkles, ArrowLeft, 
    Camera, Upload, Zap, Tag, Clock, Check,
    AlertCircle, Briefcase, Award, MessageSquare,
    ChevronRight, Globe, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import businessService from '../services/businessService';

const LandingPageBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [biz, setBiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('identity'); // identity, services, portfolio, announcements

    useEffect(() => {
        const fetchBiz = async () => {
            try {
                const data = await businessService.getBusinessById(id);
                setBiz(data);
            } catch (err) {
                toast.error("Business not found");
                navigate('/owner/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchBiz();
    }, [id, navigate]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await businessService.updateBusiness(id, biz);
            toast.success("Landing page updated successfully!");
        } catch (err) {
            toast.error("Failed to update landing page");
        } finally {
            setSaving(false);
        }
    };

    const addService = () => {
        const services = biz.services || [];
        setBiz({ ...biz, services: [...services, { name: '', price: 0, duration: '', description: '' }] });
    };

    const updateService = (index, field, value) => {
        const services = [...biz.services];
        services[index][field] = value;
        setBiz({ ...biz, services });
    };

    const removeService = (index) => {
        const services = biz.services.filter((_, i) => i !== index);
        setBiz({ ...biz, services });
    };

    const addPortfolio = () => {
        const portfolio = biz.portfolio || [];
        setBiz({ ...biz, portfolio: [...portfolio, { image: '', title: '', description: '' }] });
    };

    const updatePortfolio = (index, field, value) => {
        const portfolio = [...biz.portfolio];
        portfolio[index][field] = value;
        setBiz({ ...biz, portfolio });
    };

    const removePortfolio = (index) => {
        const portfolio = biz.portfolio.filter((_, i) => i !== index);
        setBiz({ ...biz, portfolio });
    };

    const addAnnouncement = () => {
        const announcements = biz.announcements || [];
        setBiz({ ...biz, announcements: [...announcements, { title: '', content: '', discountCode: '' }] });
    };

    const updateAnnouncement = (index, field, value) => {
        const announcements = [...biz.announcements];
        announcements[index][field] = value;
        setBiz({ ...biz, announcements });
    };

    const removeAnnouncement = (index) => {
        const announcements = biz.announcements.filter((_, i) => i !== index);
        setBiz({ ...biz, announcements });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin mb-4" />
                <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Opening the Studio...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#fffdf9]">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Builder Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <Link to="/owner/dashboard" className="inline-flex items-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-widest mb-4 hover:text-stone-600 transition-colors">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter">
                            Landing Page <span className="premium-gradient-text">Studio.</span>
                        </h1>
                        <p className="text-stone-400 font-medium text-lg mt-2">Personalize your business's automatically generated mini-website.</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link 
                            to={biz.slug ? `/store/${biz.slug}` : `/business/${biz._id}`} 
                            target="_blank"
                            className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 text-stone-600 font-black uppercase tracking-tighter rounded-xl hover:bg-stone-50 transition-all text-xs"
                        >
                            <Globe size={16} /> Preview Site
                        </Link>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-4 bg-orange-600 text-white font-black uppercase tracking-tighter rounded-2xl shadow-xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all text-sm shine-effect disabled:opacity-50"
                        >
                            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                            {saving ? 'Saving...' : 'Save All Changes'}
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar Tabs */}
                    <aside className="lg:col-span-1 space-y-4">
                        {[
                            { id: 'identity', label: 'Identity', icon: ImageIcon, desc: 'Logo & Cover' },
                            { id: 'services', label: 'Services', icon: List, desc: 'Pricing & Packages' },
                            { id: 'portfolio', label: 'Portfolio', icon: Camera, desc: 'Visual Showcase' },
                            { id: 'announcements', label: 'Offers', icon: Zap, desc: 'Hot Deals' },
                        ].map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full text-left p-6 rounded-3xl border transition-all flex items-center justify-between group ${activeSection === section.id ? 'bg-white border-orange-200 shadow-xl shadow-orange-100 ring-4 ring-orange-50/50' : 'bg-white border-stone-100 hover:border-orange-100 shadow-sm'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${activeSection === section.id ? 'bg-orange-600 text-white' : 'bg-stone-50 text-stone-400 group-hover:bg-orange-50 group-hover:text-orange-500'}`}>
                                        <section.icon size={22} />
                                    </div>
                                    <div>
                                        <p className={`font-black uppercase tracking-widest text-[10px] ${activeSection === section.id ? 'text-orange-600' : 'text-stone-400'}`}>{section.label}</p>
                                        <p className="text-xs font-bold text-stone-800 mt-0.5">{section.desc}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className={activeSection === section.id ? 'text-orange-400' : 'text-stone-200'} />
                            </button>
                        ))}

                        <div className="mt-12 bg-stone-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="text-orange-400" size={24} />
                                <h4 className="font-black text-sm uppercase tracking-widest">Pro Tip</h4>
                            </div>
                            <p className="text-xs font-medium text-stone-300 leading-relaxed mb-6">
                                Upload a high-resolution logo and cover image to make your business stand out from competitors.
                            </p>
                            <Link to={biz.slug ? `/store/${biz.slug}` : `/business/${biz._id}`} className="block w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-center text-[10px] font-black uppercase tracking-widest transition-all">
                                See live example
                            </Link>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <motion.div 
                            key={activeSection}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[3rem] border border-stone-100 p-10 md:p-14 shadow-sm min-h-[600px]"
                        >
                            {/* Identity Section */}
                            {activeSection === 'identity' && (
                                <div className="space-y-12">
                                    <div>
                                        <h3 className="text-2xl font-black text-stone-900 mb-2">Identity & Branding</h3>
                                        <p className="text-stone-400 font-medium">How your business appears to the world.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div>
                                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 ml-1">Business Logo URL</label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-200 group-focus-within:text-orange-600 transition-colors z-10"><ImageIcon size={20} /></div>
                                                <input 
                                                    type="text" 
                                                    value={biz.logo || ''} 
                                                    onChange={(e) => setBiz({...biz, logo: e.target.value})}
                                                    className="input-premium !pl-14" 
                                                    placeholder="e.g. https://your-brand.com/logo.png"
                                                />
                                            </div>
                                            {biz.logo && (
                                                <div className="mt-6 w-32 h-32 rounded-[2rem] bg-stone-50 border border-stone-100 flex items-center justify-center overflow-hidden p-4 shadow-inner">
                                                    <img src={biz.logo} className="w-full h-full object-contain" alt="Logo Preview" />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 ml-1">Hero Cover Image URL</label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-200 group-focus-within:text-orange-600 transition-colors z-10"><Upload size={20} /></div>
                                                <input 
                                                    type="text" 
                                                    value={biz.coverImage || ''} 
                                                    onChange={(e) => setBiz({...biz, coverImage: e.target.value})}
                                                    className="input-premium !pl-14" 
                                                    placeholder="e.g. https://unsplash.com/photos/your-shop"
                                                />
                                            </div>
                                            {biz.coverImage && (
                                                <div className="mt-6 h-32 rounded-[2rem] bg-stone-50 border border-stone-100 overflow-hidden shadow-inner relative">
                                                    <img src={biz.coverImage} className="w-full h-full object-cover" alt="Cover Preview" />
                                                    <div className="absolute inset-0 bg-stone-900/10" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 bg-orange-50/50 rounded-3xl border border-orange-100 flex items-start gap-4">
                                        <Info className="text-orange-500 shrink-0 mt-1" size={20} />
                                        <p className="text-xs font-bold text-stone-600 leading-relaxed italic">
                                            The logo appears in the side menu and search results. The cover image becomes the backdrop of your landing page's hero section.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Services Section */}
                            {activeSection === 'services' && (
                                <div className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-black text-stone-900 mb-2">Service Portfolio</h3>
                                            <p className="text-stone-400 font-medium">List what you offer and your pricing.</p>
                                        </div>
                                        <button onClick={addService} className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg">
                                            <Plus size={16} /> Add Service
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        {biz.services?.map((svc, idx) => (
                                            <div key={idx} className="p-8 rounded-[2.5rem] border border-stone-100 bg-stone-50/30 flex flex-col md:flex-row gap-6 relative group">
                                                <button onClick={() => removeService(idx)} className="absolute -top-3 -right-3 w-10 h-10 bg-white border border-red-100 text-red-500 rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">
                                                    <Trash2 size={16} />
                                                </button>
                                                
                                                <div className="flex-1 space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Service Name</label>
                                                            <input 
                                                                type="text" 
                                                                value={svc.name} 
                                                                onChange={(e) => updateService(idx, 'name', e.target.value)}
                                                                className="input-premium !p-4 !text-sm" 
                                                                placeholder="e.g. Standard Consultation"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Price (₹)</label>
                                                            <input 
                                                                type="number" 
                                                                value={svc.price} 
                                                                onChange={(e) => updateService(idx, 'price', e.target.value)}
                                                                className="input-premium !p-4 !text-sm" 
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Duration</label>
                                                            <input 
                                                                type="text" 
                                                                value={svc.duration} 
                                                                onChange={(e) => updateService(idx, 'duration', e.target.value)}
                                                                className="input-premium !p-4 !text-sm" 
                                                                placeholder="e.g. 45-60 mins"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Service Type</label>
                                                            <div className="flex bg-white rounded-xl border border-stone-100 p-1">
                                                                <button className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest bg-stone-900 text-white rounded-lg transition-all">Direct</button>
                                                                <button className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-all">Variable</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!biz.services || biz.services.length === 0) && (
                                            <div className="py-20 text-center border-2 border-dashed border-stone-100 rounded-[3rem] px-10">
                                                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                                                    <List size={32} />
                                                </div>
                                                <h4 className="text-xl font-black text-stone-900 mb-2">No Services Listed</h4>
                                                <p className="text-stone-400 font-medium italic mb-10 max-w-xs mx-auto">Customers love knowing what they can expect and how much it costs.</p>
                                                <button onClick={addService} className="px-10 py-4 bg-orange-600 text-white font-black rounded-xl shadow-xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all text-sm shine-effect uppercase tracking-widest">Add First Service</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Portfolio Section */}
                            {activeSection === 'portfolio' && (
                                <div className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-black text-stone-900 mb-2">Work Portfolio</h3>
                                            <p className="text-stone-400 font-medium">Showcase your best projects or products.</p>
                                        </div>
                                        <button onClick={addPortfolio} className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg">
                                            <Plus size={16} /> Add project
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {biz.portfolio?.map((item, idx) => (
                                            <div key={idx} className="bg-stone-50/50 p-6 rounded-[2.5rem] border border-stone-100 relative group">
                                                <button onClick={() => removePortfolio(idx)} className="absolute -top-3 -right-3 w-10 h-10 bg-white border border-red-100 text-red-500 rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">
                                                    <Trash2 size={16} />
                                                </button>
                                                
                                                <div className="space-y-6">
                                                    <div className="aspect-video rounded-2xl bg-white border border-stone-200 overflow-hidden flex items-center justify-center p-2 shadow-inner">
                                                        {item.image ? (
                                                            <img src={item.image} className="w-full h-full object-cover rounded-xl" />
                                                        ) : (
                                                            <div className="flex flex-col items-center text-stone-300">
                                                                <Camera size={40} />
                                                                <p className="text-[10px] font-black uppercase tracking-widest mt-2">Image Required</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-4">
                                                        <input 
                                                            type="text" 
                                                            value={item.image} 
                                                            onChange={(e) => updatePortfolio(idx, 'image', e.target.value)}
                                                            className="input-premium !px-4 !py-3 !text-xs" 
                                                            placeholder="Project Image URL..."
                                                        />
                                                        <input 
                                                            type="text" 
                                                            value={item.title} 
                                                            onChange={(e) => updatePortfolio(idx, 'title', e.target.value)}
                                                            className="input-premium !px-4 !py-3 !text-sm !font-black !tracking-tight" 
                                                            placeholder="Project Title"
                                                        />
                                                        <textarea 
                                                            value={item.description} 
                                                            onChange={(e) => updatePortfolio(idx, 'description', e.target.value)}
                                                            className="input-premium !px-4 !py-3 !text-xs !h-24 resize-none" 
                                                            placeholder="Project Description..."
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {(!biz.portfolio || biz.portfolio.length === 0) && (
                                        <div className="py-20 text-center border-2 border-dashed border-stone-100 rounded-[3rem] px-10 bg-stone-50/20">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-stone-200 shadow-sm border border-stone-100">
                                                <Camera size={32} />
                                            </div>
                                            <h4 className="text-xl font-black text-stone-900 mb-2">No Visual Proof</h4>
                                            <p className="text-stone-400 font-medium italic mb-10 max-w-xs mx-auto">Visuals convert 40% better than text alone. Add your best work.</p>
                                            <button onClick={addPortfolio} className="px-10 py-4 bg-orange-600 text-white font-black rounded-xl shadow-xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all text-sm shine-effect uppercase tracking-widest">Start Portfolio</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Announcements Section */}
                            {activeSection === 'announcements' && (
                                <div className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-black text-stone-900 mb-2">Flash Announcements</h3>
                                            <p className="text-stone-400 font-medium">Post limited-time offers or news updates.</p>
                                        </div>
                                        <button onClick={addAnnouncement} className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg">
                                            <Plus size={16} /> New Announcement
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {biz.announcements?.map((ann, idx) => (
                                            <div key={idx} className="p-10 rounded-[2.5rem] border border-stone-100 bg-orange-50/30 relative group">
                                                <div className="absolute top-8 left-0 w-2 h-16 bg-orange-500 rounded-r-full" />
                                                <button onClick={() => removeAnnouncement(idx)} className="absolute -top-3 -right-3 w-10 h-10 bg-white border border-red-100 text-red-500 rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="flex flex-col md:flex-row gap-10">
                                                    <div className="flex-1 space-y-6">
                                                        <div>
                                                            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Headline</label>
                                                            <input 
                                                                type="text" 
                                                                value={ann.title} 
                                                                onChange={(e) => updateAnnouncement(idx, 'title', e.target.value)}
                                                                className="input-premium !px-6 !py-4 !text-lg !font-black !tracking-tight bg-white" 
                                                                placeholder="e.g. 50% OFF THIS SUNDAY!"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Content Details</label>
                                                            <textarea 
                                                                value={ann.content} 
                                                                onChange={(e) => updateAnnouncement(idx, 'content', e.target.value)}
                                                                className="input-premium !px-6 !py-4 !text-[13px] !h-32 resize-none bg-white font-medium text-stone-500 leading-relaxed" 
                                                                placeholder="Explain the offer or update here..."
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                    <div className="w-full md:w-64 space-y-6">
                                                        <div>
                                                            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Discount Code</label>
                                                            <div className="relative">
                                                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={16} />
                                                                <input 
                                                                    type="text" 
                                                                    value={ann.discountCode} 
                                                                    onChange={(e) => updateAnnouncement(idx, 'discountCode', e.target.value)}
                                                                    className="input-premium !pl-12 !pr-4 !py-4 !text-sm !font-mono !font-black !tracking-widest bg-white" 
                                                                    placeholder="OFF50"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="p-6 bg-white rounded-2xl border border-stone-100 flex flex-col items-center justify-center text-center">
                                                            <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest mb-3">Live Status</p>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                                <span className="text-xs font-black text-stone-900 uppercase">Visible</span>
                                                            </div>
                                                            <p className="text-[9px] font-bold text-stone-400 italic">Visible on Storefront</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!biz.announcements || biz.announcements.length === 0) && (
                                            <div className="py-20 text-center border-2 border-dashed border-stone-100 rounded-[3rem] px-10 bg-orange-50/10">
                                                <div className="w-16 h-16 bg-orange-100/50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-400">
                                                    <Zap size={32} />
                                                </div>
                                                <h4 className="text-xl font-black text-stone-900 mb-2">No Active Offers</h4>
                                                <p className="text-stone-400 font-medium italic mb-10 max-w-xs mx-auto">Create urgency with flash deals or notify people about events.</p>
                                                <button onClick={addAnnouncement} className="px-10 py-4 bg-orange-600 text-white font-black rounded-xl shadow-xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all text-sm shine-effect uppercase tracking-widest">Create Announcement</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPageBuilder;
