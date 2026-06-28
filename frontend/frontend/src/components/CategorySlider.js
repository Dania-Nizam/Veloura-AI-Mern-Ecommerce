import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/navigation';

const CategorySlider = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Men's Watches", img: "/assets/watch.jpg", link: "/watches" },
    { name: "Women's Jewelry", img: "/assets/jewelry.jpg", link: "/jewelry" },
    { name: "Women's Cloth", img: "/assets/women.jpg", link: "/womens-cloths" },
    { name: "Men's Wear", img: "/assets/man.jpg", link: "/mens-clothing" },
    { name: "Accessories", img: "/assets/accessories.jpg", link: "/accessories" },
    { name: "Fragrances", img: "/assets/perfume.jpg", link: "/fragrances" },
    { name: "Personal Care", img: "/assets/care.jpg", link: "/care" },
    { name: "Fashion Bags", img: "/assets/bags.jpg", link: "/bags" },
    { name: "Sport Shoes", img: "/assets/shoes.jpg", link: "/shoes" },
  ];

  return (
    <div className="w-full relative py-20 overflow-hidden bg-gradient-to-br from-[#f7f2ec] via-[#efe7dd] to-[#ffffff] text-[#1d1d1f] antialiased">

      {/* 🌫️ Gentle Ambient Blur Fields (Aligned with cart aesthetics) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-200/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* SECTION HEADER BLOCK */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 block mb-2">
              Curated Collections
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 tracking-tight">
              Shop by <span className="italic font-normal opacity-60">Category</span>
            </h2>
          </div>

          <button
            onClick={() => navigate('/all-categories')}
            className="hidden md:block text-[9px] font-bold tracking-[0.3em] uppercase text-slate-400 hover:text-black transition-colors duration-300 border-b border-transparent hover:border-black pb-1"
          >
            Browse All Discoveries →
          </button>
        </div>

        {/* MARQUEE STREAM SLIDER */}
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={24}
          slidesPerView={2}
          loop={true}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          className="overflow-visible"
        >
          {categories.map((cat, index) => (
            <SwiperSlide key={index} className="py-2">
              <div
                onClick={() => navigate(cat.link)}
                className="group cursor-pointer flex flex-col items-center"
              >
                
                {/* FLAT GLASS LAYER CONTAINER */}
                <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden mb-4 border border-white/50 bg-white/20 backdrop-blur-xl shadow-md transition-all duration-500 ease-out group-hover:shadow-xl group-hover:-translate-y-1.5">
                  
                  {/* Subtle Interactive Vignette Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/5 opacity-80 group-hover:opacity-40 transition-opacity duration-500 z-10"></div>

                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400?text=Product';
                    }}
                  />
                </div>

                {/* META LABEL DESCRIPTIONS */}
                <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em] text-center group-hover:text-black transition-colors duration-300">
                  {cat.name}
                </h3>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </div>
  );
};

export default CategorySlider;