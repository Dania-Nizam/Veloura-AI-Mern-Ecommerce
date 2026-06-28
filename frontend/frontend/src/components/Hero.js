import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Flame, ChevronDown } from 'lucide-react';
import "swiper/css";
import "swiper/css/effect-fade";

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const content = [
    { id: 1, tag: "SUMMER 2026", title: "Timeless Style.", highlight: "Premium Quality.", subtitle: "Discover clothing that blends sophistication and comfort." },
    { id: 2, tag: "NEW COLLECTION", title: "Modern Elegance.", highlight: "Redefined Luxury.", subtitle: "Experience the fusion of contemporary design and craft." },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      
      

      {/* BACKGROUND IMAGE - Fixed the cropping issue here */}
      <div 
        className="absolute inset-0 bg-cover bg-[center_top_20%] bg-no-repeat" 
        style={{ backgroundImage: `url('/assets/bg9.png')` }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* TEXT SLIDER */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
        className="h-full w-full absolute inset-0 z-10"
      >
        {content.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div className="h-full flex flex-col items-start justify-center px-10 md:px-24 text-white">
              <AnimatePresence mode="wait">
                {activeIndex === index && (
                  <div className="max-w-xl">
                    <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                      <span className="text-[9px] tracking-[0.3em] uppercase opacity-70 mb-4 font-bold block">{item.tag}</span>
                      <h1 className="text-5xl md:text-7xl font-serif font-medium leading-[1] mb-6">
                        {item.title} <br /> <span className="italic opacity-70">{item.highlight}</span>
                      </h1>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                      <p className="text-sm md:text-base opacity-80 mb-8 max-w-xs">{item.subtitle}</p>
                      <Link to="/collections" className="border border-white px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all">
                        Explore Collection
                      </Link>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;