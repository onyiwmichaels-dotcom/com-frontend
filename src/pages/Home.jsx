import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search, Menu, X, ShoppingBag, Zap, Flame,
  Tv, Shirt, Home as HomeIcon, BookOpen,
  Phone
} from "lucide-react";
import { API_BASE_URL } from "../config/api";

// ✅ BANNER IMAGES 
const BANNER_IMAGES = [
  "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop", 
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fontIndex, setFontIndex] = useState(0);
  const navigate = useNavigate();

  const fonts = ["'Pacifico, cursive'", "'Monoton, cursive'", "'Bebas Neue, cursive'", "'Oswald, sans-serif'"];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("comUser"));
    setUser(storedUser);
  }, []);

  // Slideshow Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  // Graffiti Font Logic
  useEffect(() => {
    const fontInterval = setInterval(() => {
      setFontIndex(prev => (prev + 1) % fonts.length);
    }, 1200);
    return () => clearInterval(fontInterval);
  }, []);

  // Fetch Latest Products
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/latest`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.slice(0, 4).map(p => ({
          ...p,
          displayImage: p.image || "https://via.placeholder.com/400x400?text=No+Image"
        }));
        setFeaturedProducts(formatted);
      })
      .catch(err => console.error("Failed to load products", err));
  }, []);

  const categories = [
    { name: "TVS & AUDIO", icon: <Tv size={20} />, Value: "TVs & Audio" }, 
    { name: "FASHION", icon: <Shirt size={20} />, Value: "Fashion" },
    { name: "HOME ITEMS", icon: <HomeIcon size={20} />, Value: "Home" },
    { name: "ACADEMICS", icon: <BookOpen size={20} />, Value: "Academics" },
    { name: "APPLIANCES", icon: <Zap size={20} />, Value: "Appliances" },
    { name: "PHONES", icon: <Phone size={20} />, Value: "Phones" },
  ];

  const goToCategory = (category) => {
    navigate(`/shop?cat=${encodeURIComponent(category)}`);
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/shop?search=${search}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 overflow-x-hidden" style={{ fontFamily: 'Oswald, sans-serif' }}>

      {/* --- STICKY HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-5 py-5 flex items-center justify-between">
        <div className="flex-1">
           {/* Placeholder for left-side spacing if needed */}
        </div>
        
        <div className="text-center">
          <h1
            className="wave-text text-[18px] sm:text-[22px] font-black tracking-tight transition-all duration-700 uppercase"
            style={{ fontFamily: fonts[fontIndex] }}
          >
            Chuka Market
          </h1>
        </div>

        <div className="flex-1 flex justify-end">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-gray-50 rounded-full">
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* --- SEARCH --- */}
      <div className="px-5 mt-6 mb-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search student deals..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-green-500 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* --- AESTHETIC BANNER --- */}
      <div className="px-5 mb-8">
        <div className="relative w-full h-44 rounded-[2rem] overflow-hidden bg-black video-container-glow shadow-2xl shadow-green-100/20">
          {BANNER_IMAGES.map((img, index) => (
            <img 
              key={index}
              src={img} 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ${index === currentSlide ? "opacity-60" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-white text-xl font-black uppercase tracking-tighter leading-tight animate-neon">
              Elevate Your <br/> Campus Lifestyle
            </h2>
          </div>
        </div>
      </div>

      {/* --- GREETING --- */}
      <div className="px-5 mb-8">
        <p className="text-[10px] font-black uppercase tracking-[3px] text-green-600 mb-1">Authenticated</p>
        <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">
          {user ? <>Yo, {user.name}!</> : <>Welcome Back</>}
        </h1>
      </div>

      {/* --- CATEGORIES --- */}
      <div className="mb-10">
        <div className="px-5 flex justify-between items-center mb-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Department</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto px-5 pb-2 no-scrollbar">
          {categories.map((cat) => (
            <div 
              key={cat.name}
              onClick={() => goToCategory(cat.Value)}
              className="flex flex-col items-center gap-3 min-w-[75px] cursor-pointer group"
            >
              <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-gray-400 border border-gray-100 group-hover:bg-black group-hover:text-white group-active:scale-90 transition-all">
                {cat.icon}
              </div>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- TRENDING SECTION (BORDERLESS STYLE) --- */}
      <div className="px-5 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter">
            <Flame className="text-orange-500" size={20} fill="currentColor" /> Trending Now
          </h2>
          <span onClick={() => navigate("/shop")} className="text-[10px] font-black uppercase tracking-widest text-green-600 underline underline-offset-4">
            Explore All
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate("/shop")}
                className="bg-white rounded-[1.5rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-50 active:scale-95 transition-all group"
              >
                {/* 🖼️ Flush Image Container */}
                <div className="aspect-square w-full overflow-hidden bg-gray-50">
                  <img 
                    src={p.displayImage} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
                </div>
                
                {/* 📄 Minimal Info */}
                <div className="p-3">
                  <h3 className="font-bold text-gray-800 text-[11px] uppercase tracking-tight truncate leading-none">
                    {p.name}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-black font-black text-sm">KES {Number(p.price).toLocaleString()}</p>
                    <ShoppingBag size={12} className="text-gray-300" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 opacity-30">
               <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Updating Feed...</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-black text-white py-12 px-8 rounded-t-[3rem]">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-1 w-white bg-green-500 rounded-full mb-6"></div>
          <h3 className="font-black text-sm uppercase tracking-[4px] mb-8">Chuka Market</h3>

          <div className="space-y-6">
            <a href="tel:0737107602" className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
              <Phone size={16} className="text-green-500" />
              <span className="text-xs font-bold tracking-widest">0737 107 602</span>
            </a>

            <a
              href="https://wa.me/254737107602?text=Hello%20Marketplace"
              target="_blank"
              className="flex items-center gap-3 text-green-500 font-black text-[10px] uppercase tracking-[2px]"
            >
              Live WhatsApp Support
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 w-full flex flex-col gap-4">
            <Link to="/terms" className="text-[10px] font-bold text-gray-500 hover:text-white transition uppercase tracking-widest">
              Terms & Conditions
            </Link>
            <p className="text-[9px] text-gray-600 uppercase tracking-widest">
              © 2026 Chuka Online Market
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}