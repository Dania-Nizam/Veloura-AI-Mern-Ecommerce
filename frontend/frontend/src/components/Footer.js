import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  MapPin, 
  ShieldCheck,
  ArrowUpRight,
  Globe
} from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-20 pb-10 relative overflow-hidden font-sans border-t border-zinc-900 selection:bg-white/10">
      {/* 🍏 Luxury Subtle Ambient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[140px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Identity - Clean typography scale */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-serif tracking-tight text-white flex items-center gap-1.5">
              Veloura<span className="text-amber-600/80 inline-block text-xs transform align-super">✦</span>
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm font-medium">
              {t('footer_desc') || "Redefining the digital shopping experience with precision, elegance, and uncompromised quality."}
            </p>
            
            {/* Socials Link Elements */}
            <div className="flex gap-5 pt-2">
              {[
                { Icon: Facebook, link: "#" },
                { Icon: Instagram, link: "#" },
                { Icon: Twitter, link: "#" }
              ].map((social, index) => (
                <a 
                  key={index} 
                  href={social.link} 
                  className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all duration-300"
                >
                  <social.Icon size={15} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Explore links */}
          <div className="space-y-5">
            <h3 className="text-zinc-200 font-bold text-[10px] uppercase tracking-[0.25em]">{t('shop') || "Shop & Learn"}</h3>
            <ul className="space-y-3">
              {['All Products', 'Categories', 'Special Offers', 'New Arrivals'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-zinc-500 hover:text-zinc-200 transition-colors text-sm font-medium flex items-center gap-1 group w-max">
                    {item} 
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 text-zinc-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services info */}
          <div className="space-y-5">
            <h3 className="text-zinc-200 font-bold text-[10px] uppercase tracking-[0.25em]">Services</h3>
            <ul className="space-y-3">
              {['Order Status', 'Returns', 'Privacy Policy', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-zinc-500 hover:text-zinc-200 transition-colors text-sm font-medium inline-block w-max">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact - Luxury Tiles */}
          <div className="space-y-5">
             <h3 className="text-zinc-200 font-bold text-[10px] uppercase tracking-[0.25em]">Location</h3>
             <div className="space-y-3">
                <div className="flex items-center gap-3 group cursor-pointer w-max">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-800 group-hover:text-amber-500 transition-all duration-300">
                    <MapPin size={13} />
                  </div>
                  <span className="text-zinc-500 group-hover:text-zinc-300 text-xs font-medium transition duration-300">Karachi, PK</span>
                </div>
                
                <div className="flex items-center gap-3 group cursor-pointer w-max">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-800 group-hover:text-amber-500 transition-all duration-300">
                    <Mail size={13} />
                  </div>
                  <span className="text-zinc-500 group-hover:text-zinc-300 text-xs font-medium transition duration-300">help@veloura.com</span>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Bar Alignment */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col lg:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <p className="text-zinc-600 text-[11px] font-medium tracking-tight">
              Copyright © 2026 Veloura Inc. All rights reserved.
            </p>
            <div className="flex gap-3 text-[11px] font-medium text-zinc-600">
              <span className="hover:text-zinc-400 cursor-pointer transition">Privacy Policy</span>
              <span className="text-zinc-800">|</span>
              <span className="hover:text-zinc-400 cursor-pointer transition">Terms of Use</span>
              <span className="text-zinc-800">|</span>
              <span className="hover:text-zinc-400 cursor-pointer transition">Sales Policy</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Language Selector Selector */}
            <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-medium hover:text-white transition-colors cursor-pointer sm:border-r sm:border-zinc-800 sm:pr-6">
              <Globe size={13} className="text-zinc-600" />
              <span>Pakistan (English)</span>
            </div>

            {/* Gateways & Compliance Layout */}
            <div className="flex items-center gap-4 opacity-30 hover:opacity-70 transition-opacity duration-500">
               <ShieldCheck size={16} className="text-white" />
               <div className="text-[9px] font-black tracking-widest text-white">
                 VISA
               </div>
               <div className="text-[9px] font-black tracking-widest text-white italic">
                 PayPal
               </div>
            </div>
          </div>
          
        </div>

      </div>
    </footer>
  );
};

export default Footer;