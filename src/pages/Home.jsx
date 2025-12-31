import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Menu, X, ShoppingBag, Zap, Flame,
  Heart, Tv, Shirt, Home as HomeIcon, BookOpen,
  Phone, Instagram
} from "lucide-react";
import { API_BASE_URL } from "../config/api";

export default function Home() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("comUser"));
    setUser(storedUser);
  }, []);

  // FETCH LATEST 4 PRODUCTS
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/latest`)
      .then(res => res.json())
      .then(data => {
        const formatted = data
          .slice(0, 4)
          .map(p => ({
            ...p,
            displayImage: p.image?.startsWith('http') 
              ? p.image 
              : `${API_BASE_URL}${p.image?.startsWith('/') ? '' : '/'}${p.image}`
          }));
        setFeaturedProducts(formatted);
      })
      .catch(err => console.error("Failed to load products", err));
  }, []);

  // ✅ CATEGORY STRINGS: Matches database logic for filtering
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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans" style={{ fontFamily: 'Oswald, sans-serif' }}>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="bg-green-600 text-white p-1.5 rounded-lg shadow-sm">
            <ShoppingBag size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">COM</span>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-100 transition">
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      {/* SEARCH BAR */}
      <div className="px-5 mt-6 mb-4 relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search products & press Enter..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all bg-white"
          />
        </div>
      </div>

      {/* ✅ AESTHETIC VIDEO BANNER (Neon Updates Included) */}
      <div className="px-5 mb-6">
        <div className="relative w-full h-40 md:h-56 rounded-2xl overflow-hidden bg-black video-container-glow border border-green-900/30 shadow-lg">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-70"
          >
            {/* High-quality tech placeholder video */}
            <source src="https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-devices-99786-preview.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-5">
            <h2 className="text-white text-xl font-bold tracking-tighter animate-neon">
              COM PREMIUM
            </h2>
            <p className="text-green-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-90">
              iPhone 15 Pro • S24 Ultra • JBL Partybox
            </p>
          </div>
        </div>
      </div>

      {/* GREETING */}
      <div className="px-5 mb-6">
        {user ? (
          <h1 className="text-2xl font-bold">
            Yo, <span className="text-green-600">{user.name}</span>!
          </h1>
        ) : (
          <h1 className="text-2xl font-bold">
            Welcome to <span className="text-green-600">Chuka Market</span>
          </h1>
        )}
        <p className="text-gray-500 text-sm">The plug for best deals on campus.</p>
      </div>

      {/* CATEGORIES SECTION */}
      <div className="px-5 mb-8">
        <h2 className="text-lg font-bold mb-4 uppercase tracking-tight">Browse Categories</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <div 
              key={cat.name}
              onClick={() => goToCategory(cat.Value)}
              className="flex flex-col items-center gap-2 min-w-[85px] cursor-pointer group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white border border-gray-100 transition-all duration-300 transform group-active:scale-90">
                {cat.icon}
              </div>
              <span className="text-[10px] font-bold text-gray-600 text-center uppercase tracking-tight">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TRENDING SECTION */}
      <div className="px-5 mb-10">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Flame className="text-orange-500 fill-orange-500" size={20} /> Trending
          </h2>
          <span onClick={() => navigate("/shop")} className="text-sm text-green-600 font-semibold cursor-pointer hover:underline">
            See All
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate("/shop")}
                className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition active:scale-95"
              >
                <div className="h-36 w-full overflow-hidden rounded-xl mb-3 bg-gray-50 relative">
                  <img 
                    src={p.displayImage} 
                    alt={p.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                  />
                  <button className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm text-gray-400 hover:text-red-500 transition">
                    <Heart size={14} />
                  </button>
                </div>
                <h3 className="font-bold text-gray-800 text-sm truncate uppercase tracking-tight">{p.name}</h3>
                <p className="text-green-600 font-bold text-sm mt-1">KES {p.price}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm col-span-2 text-center py-4">Loading trending deals...</p>
          )}
        </div>
      </div>

      {/* SUPPORT FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6 rounded-t-3xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <h3 className="text-white font-bold text-lg uppercase tracking-widest">Customer Support</h3>

          <div className="flex items-center gap-2">
            <Phone size={18} className="text-green-500" />
            <span className="font-bold">0737 107 602</span>
          </div>

          <div className="flex items-center gap-2">
            <Instagram size={18} className="text-pink-500" />
            <span className="font-bold">@COM_KE</span>
          </div>

          <p className="text-[10px] text-gray-600 pt-8 font-medium border-t border-gray-800 mt-4 w-full uppercase tracking-tighter">
            © 2026 Chuka Online Market. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}