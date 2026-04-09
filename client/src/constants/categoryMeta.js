import {
    Utensils, ShoppingBag, Zap, Droplets, Stethoscope, Dumbbell,
    Coffee, Leaf, Apple, Smartphone, Scissors, Pocket, Book, Shirt, Footprints,
    Hammer, Cookie, Wind, Wrench, Gift, Flower2
} from 'lucide-react';

import RESTAURANT_IMG from '../assets/restaurant.png';
import RETAIL_IMG from '../assets/retail.png';
import DOCTOR_IMG from '../assets/doctor.png';
import GYM_IMG from '../assets/gym.png';
import ELECTRICIAN_IMG from '../assets/electrician.png';
import GROCERY_IMG from '../assets/grocery.png';
import BAKERY_IMG from '../assets/bakery.png';
import PHARMACY_IMG from '../assets/pharmacy.png';
import SALON_IMG from '../assets/salon.png';
import MOBILE_IMG from '../assets/mobile_repair.png';
import DAIRY_IMG from '../assets/dairy.png';
import SWEET_IMG from '../assets/sweet_shop.png';
import AUTO_IMG from '../assets/auto_repair.png';
import FLOWER_IMG from '../assets/flower_shop.png';
import HERO_IMG from '../assets/shop_illustration_hq.jpg';
import TEA_IMG from '../assets/tea_stall.png';

export const CATEGORY_META = {
    'Kirana / Grocery Store': { icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100', image: GROCERY_IMG, coverUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80&v=1' },
    'Tea Stall (Chai Shop)': { icon: Coffee, color: 'bg-orange-50 text-orange-600', border: 'border-orange-100', image: TEA_IMG, coverUrl: 'https://images.unsplash.com/photo-1715167886555-01552c3369c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGVhJTIwc3RhbGx8ZW58MHx8MHx8fDA%3D' },
    'Bakery Shop': { icon: Utensils, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100', image: BAKERY_IMG, coverUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Medical Store / Pharmacy': { icon: Stethoscope, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', image: PHARMACY_IMG, coverUrl: 'https://media.istockphoto.com/id/1135284188/photo/if-you-need-its-here.webp?a=1&b=1&s=612x612&w=0&k=20&c=BESYqHIccHzlUNRthSmOcaZGaJCVCbYS6nsUQyc4Hfs=' },
    'Vegetable Shop': { icon: Leaf, color: 'bg-green-50 text-green-600', border: 'border-green-100', image: HERO_IMG, coverUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Fruit Shop': { icon: Apple, color: 'bg-red-50 text-red-600', border: 'border-red-100', image: HERO_IMG, coverUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Mobile Repair Shop': { icon: Smartphone, color: 'bg-slate-50 text-slate-600', border: 'border-slate-100', image: MOBILE_IMG, coverUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Barber Shop / Hair Salon': { icon: Scissors, color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100', image: SALON_IMG, coverUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Tailor Shop': { icon: Pocket, color: 'bg-rose-50 text-rose-600', border: 'border-rose-100', image: HERO_IMG, coverUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Stationery Shop': { icon: Book, color: 'bg-sky-50 text-sky-600', border: 'border-sky-100', image: HERO_IMG, coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Clothing Shop': { icon: Shirt, color: 'bg-violet-50 text-violet-600', border: 'border-violet-100', image: HERO_IMG, coverUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Footwear Shop': { icon: Footprints, color: 'bg-stone-50 text-stone-600', border: 'border-stone-100', image: HERO_IMG, coverUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Hardware Shop': { icon: Hammer, color: 'bg-zinc-50 text-zinc-600', border: 'border-zinc-100', image: HERO_IMG, coverUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Electronics Repair Shop': { icon: Zap, color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-100', image: HERO_IMG, coverUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Dairy / Milk Shop': { icon: Droplets, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', image: DAIRY_IMG, coverUrl: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Sweet Shop (Mithai Shop)': { icon: Cookie, color: 'bg-orange-50 text-orange-600', border: 'border-orange-100', image: SWEET_IMG, coverUrl: 'https://media.istockphoto.com/id/459360661/photo/display-case-of-chocolate-truffles.webp?a=1&b=1&s=612x612&w=0&k=20&c=j_IBT2LoQcnhxHVPCCqeHlSVL8qV_6kyHTb4O4MJPv8=' },
    'Pan Shop': { icon: Wind, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100', image: HERO_IMG, coverUrl: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Auto Repair / Bike Garage': { icon: Wrench, color: 'bg-slate-50 text-slate-600', border: 'border-slate-100', image: AUTO_IMG, coverUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Gift Shop': { icon: Gift, color: 'bg-pink-50 text-pink-600', border: 'border-pink-100', image: HERO_IMG, coverUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Flower Shop': { icon: Flower2, color: 'bg-rose-50 text-rose-600', border: 'border-rose-100', image: FLOWER_IMG, coverUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Restaurants': { icon: Utensils, color: 'bg-red-50 text-red-600', border: 'border-red-100', image: RESTAURANT_IMG, coverUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Retail': { icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', image: RETAIL_IMG, coverUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Electrician': { icon: Zap, color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-100', image: ELECTRICIAN_IMG, coverUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Doctor': { icon: Stethoscope, color: 'bg-green-50 text-green-600', border: 'border-green-100', image: DOCTOR_IMG, coverUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80&v=2' },
    'Gym': { icon: Dumbbell, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100', image: GYM_IMG, coverUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000' }
};

export const GLOBAL_FALLBACK_IMAGE = HERO_IMG;
