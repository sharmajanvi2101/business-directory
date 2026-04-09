import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, MapPin } from 'lucide-react';
import { setCredentials } from '../store/slices/authSlice';
import authService from '../services/authService';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onLoginSubmit = async (data) => {
        setLoading(true);
        try {
            const user = await authService.login(data);
            dispatch(setCredentials(user));
            toast.success(`Welcome back, ${user.name}`);

            // Redirect based on role (prioritizing admins) or previous location
            const from = location.state?.from;

            if (user.role === 'admin' || user.role === 'subadmin') {
                redirectBasedOnRole(user.role);
            } else if (from) {
                navigate(from, { state: location.state });
            } else {
                redirectBasedOnRole(user.role);
            }
        } catch (error) {
            toast.error(error?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const redirectBasedOnRole = (role) => {
        if (role === 'admin') navigate('/admin');
        else if (role === 'subadmin') navigate('/subadmin');
        else if (role === 'owner') navigate('/owner/dashboard');
        else navigate('/');
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 mt-10">
            <div className="w-full max-w-md">
                {/* Simple Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-md">
                        <MapPin size={22} className="text-white" />
                    </div>
                    <span className="text-2xl font-black text-stone-900 tracking-tight">BizDirect</span>
                </Link>

                {/* Login Card */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-900 mb-2 text-center text-orange-600">Account Login</h2>
                    <p className="text-stone-500 text-sm text-center mb-8">Enter your credentials to access your account</p>

                    <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-600 transition-colors z-10" size={18} />
                                <input
                                    {...register('email', { required: true })}
                                    className={`w-full bg-stone-50 border-stone-200 !pl-14 pr-4 py-3.5 rounded-2xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-medium text-stone-800 ${errors.email ? 'border-red-500' : 'border'}`}
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-600 transition-colors z-10" size={18} />
                                <input
                                    {...register('password', { required: true })}
                                    type="password"
                                    className={`w-full bg-stone-50 border-stone-200 !pl-14 pr-4 py-3.5 rounded-2xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-medium text-stone-800 ${errors.password ? 'border-red-500' : 'border'}`}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-orange-700 active:scale-95 transition-all shadow-lg shadow-orange-100 mt-4"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                        <p className="text-stone-500 text-sm font-medium">
                            Don't have an account? {' '}
                            <Link to="/register" state={{ from: location.state?.from }} className="text-orange-600 font-bold hover:underline">
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-hot-toast';
// import { Mail, Lock, ArrowRight, MapPin, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { setCredentials } from '../store/slices/authSlice';
// import authService from '../services/authService';

// const Login = () => {
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const location = useLocation();

//     const { register, handleSubmit, formState: { errors } } = useForm({
//         mode: 'onBlur'
//     });

//     const onLoginSubmit = async (data) => {
//         setLoading(true);
//         try {
//             const user = await authService.login(data);
//             dispatch(setCredentials(user));
//             toast.success(`Welcome back, ${user.name}`, {
//                 style: {
//                     background: '#18181b',
//                     color: '#fff',
//                     border: '1px solid #27272a'
//                 }
//             });

//             const from = location.state?.from;
//             if (user.role === 'admin' || user.role === 'subadmin') {
//                 redirectBasedOnRole(user.role);
//             } else if (from) {
//                 navigate(from, { state: location.state });
//             } else {
//                 redirectBasedOnRole(user.role);
//             }
//         } catch (error) {
//             toast.error(error?.message || 'Invalid email or password', {
//                 style: {
//                     background: '#18181b',
//                     color: '#fff',
//                     border: '1px solid #27272a'
//                 }
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const redirectBasedOnRole = (role) => {
//         const routes = {
//             admin: '/admin',
//             subadmin: '/subadmin',
//             owner: '/owner/dashboard',
//             default: '/'
//         };
//         navigate(routes[role] || routes.default);
//     };

//     return (
//         <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-orange-500/30">
//             {/* Immersive Background Gradients */}
//             <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] animate-pulse" />
//             <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-zinc-800/20 rounded-full blur-[120px]" />

//             {/* Subtle Grid Pattern Overlay */}
//             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, ease: "easeOut" }}
//                 className="w-full max-w-md relative z-10"
//             >
//                 {/* Logo Section */}
//                 <Link to="/" className="flex items-center justify-center gap-3 mb-12 group">
                    
                 
//                 </Link>

//                 {/* Login Card */}
//                 <div className="bg-zinc-900/40 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/5 relative overflow-hidden group/card">
//                     {/* Subtle inner glow */}
//                     <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

//                     <div className="text-center mb-10 relative">
//                         <motion.h2
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 0.2 }}
//                             className="text-3xl font-bold text-white mb-2 tracking-tight"
//                         >
//                             Welcome Back
//                         </motion.h2>
//                         <p className="text-zinc-400 font-medium text-sm">Access your business dashboard</p>
//                     </div>

//                     <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-6 relative">
//                         {/* Email Field */}
//                         <div className="space-y-2">
//                             <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
//                             <div className="relative group">
//                                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors duration-300">
//                                     <Mail size={18} />
//                                 </div>
//                                 <input
//                                     {...register('email', {
//                                         required: 'Email is required',
//                                         pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
//                                     })}
//                                     className={`w-full bg-zinc-950/50 border border-zinc-800 !pl-12 pr-4 py-4 rounded-2xl outline-none transition-all duration-300 font-medium text-zinc-200 placeholder:text-zinc-600 focus:bg-zinc-950 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 ${errors.email ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10' : ''
//                                         }`}
//                                     placeholder="name@company.com"
//                                 />
//                             </div>
//                             <AnimatePresence>
//                                 {errors.email && (
//                                     <motion.p
//                                         initial={{ opacity: 0, height: 0 }}
//                                         animate={{ opacity: 1, height: 'auto' }}
//                                         exit={{ opacity: 0, height: 0 }}
//                                         className="text-red-400 text-xs font-medium ml-1"
//                                     >
//                                         {errors.email.message}
//                                     </motion.p>
//                                 )}
//                             </AnimatePresence>
//                         </div>

//                         {/* Password Field */}
//                         <div className="space-y-2">
//                             <div className="flex justify-between items-center ml-1">
//                                 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Password</label>
//                                 <Link to="/forgot-password" size="sm" className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors">Forgot?</Link>
//                             </div>
//                             <div className="relative group">
//                                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors duration-300">
//                                     <Lock size={18} />
//                                 </div>
//                                 <input
//                                     {...register('password', { required: 'Password is required' })}
//                                     type={showPassword ? "text" : "password"}
//                                     className={`w-full bg-zinc-950/50 border border-zinc-800 !pl-12 pr-12 py-4 rounded-2xl outline-none transition-all duration-300 font-medium text-zinc-200 placeholder:text-zinc-600 focus:bg-zinc-950 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 ${errors.password ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10' : ''
//                                         }`}
//                                     placeholder="••••••••"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
//                                 >
//                                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                 </button>
//                             </div>
//                             <AnimatePresence>
//                                 {errors.password && (
//                                     <motion.p
//                                         initial={{ opacity: 0, height: 0 }}
//                                         animate={{ opacity: 1, height: 'auto' }}
//                                         exit={{ opacity: 0, height: 0 }}
//                                         className="text-red-400 text-xs font-medium ml-1"
//                                     >
//                                         {errors.password.message}
//                                     </motion.p>
//                                 )}
//                             </AnimatePresence>
//                         </div>

//                         {/* Submit Button */}
//                         <motion.button
//                             whileHover={{ scale: 1.01 }}
//                             whileTap={{ scale: 0.98 }}
//                             type="submit"
//                             disabled={loading}
//                             className="w-full btn-primary text-white py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 transition-all shadow-2xl shadow-orange-900/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4 relative group/btn overflow-hidden"
//                         >
//                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
//                             {loading ? (
//                                 <Loader2 className="w-6 h-6 animate-spin" />
//                             ) : (
//                                 <>Sign In <ArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform" /></>
//                             )}
//                         </motion.button>
//                     </form>

//                     {/* Footer */}
//                     <div className="mt-10 pt-8 border-t border-zinc-800/50 text-center">
//                         <p className="text-zinc-500 font-medium text-sm">
//                             New to BizDirect? {' '}
//                             <Link
//                                 to="/register"
//                                 state={{ from: location.state?.from }}
//                                 className="text-orange-500 font-bold hover:text-orange-400 underline underline-offset-8 transition-all"
//                             >
//                                 Create Account
//                             </Link>
//                         </p>
//                     </div>
//                 </div>

//                 {/* Security Badge */}
//                 <div className="flex items-center justify-center gap-2 mt-8 text-zinc-600">
//                     <ShieldCheck size={14} />
//                     <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Secure Enterprise Access</span>
//                 </div>

//                 {/* Copyright */}
//                 <p className="text-center text-zinc-700 text-[10px] mt-4 font-medium uppercase tracking-widest">
//                     &copy; 2026 BizDirect Inc. All rights reserved.
//                 </p>
//             </motion.div>

//             <style dangerouslySetInnerHTML={{
//                 __html: `
//                 @keyframes shimmer {
//                     100% { transform: translateX(100%); }
//                 }
//             `}} />
//         </div>
//     );
// };

// export default Login;
