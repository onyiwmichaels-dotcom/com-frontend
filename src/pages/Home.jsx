import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Menu, X, ShoppingBag, Zap, Flame,
  Tv, Shirt, Home as HomeIcon, BookOpen,
  Phone, Instagram
} from "lucide-react";
import { API_BASE_URL } from "../config/api";
import { use } from "react";
import { Link } from "react-router-dom";

// ✅ UPDATED BANNER IMAGES (High Quality Aesthetic)
const BANNER_IMAGES = [
  // 1. iPhone 15/16 Pro (Titanium Finish)
  "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop", 
  // 2. LG Smart Refrigerator (Modern Kitchen Vibe)
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  


  // 4. Academic: Aesthetic Stack of Books (Counter Books Vibe)
  "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2070&auto=format&fit=crop",

  // 5. Fashion / Balenciaga Shoes Vibe
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop", 
  
  // 6. Samsung TV / Entertainment Setup
  "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop", 
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
  // State for the slideshow
  const [currentSlide, setCurrentSlide] = useState(0);
  const fonts = [
    "'Pacifico, cursive'",
    "'Monoton, cursive'",
    "'Bebas Neue, cursive'",
    "'Oswald, sans-serif'"
  ];
   const [fontIndex, setFontIndex] = useState(0);
   const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("comUser"));
    setUser(storedUser);
  }, []);

  // Effect to cycle images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

   useEffect(() => {
      const fontInterval = setInterval(() => {
        setFontIndex(prev => (prev + 1) % fonts.length);
      }, 1200);

      return () => clearInterval(fontInterval);
    }, []);

  // FETCH FEATURED PRODUCTS
   
    useEffect(() => {
  fetch(`${API_BASE_URL}/api/products/latest`)
    .then(res => res.json())
    .then(data => {
      const formatted = data.slice(0, 4).map(p => ({
        ...p,
        displayImage: p.image || "https://via.placeholder.com/300?text=No+Image"
      }));

      setFeaturedProducts(formatted);
    })
    .catch(err => console.error("Failed to load products", err));
}, []);


  // CATEGORY STRINGS
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
     
<header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm px-5 py-6 flex items-center relative">
  
  {/* GRAFFITI TEXT */}
  <div className="absolute left-1/2 -translate-x-1/2 text-center">
    <h1
     className="wave-text text-[22px] sm:text-[26px] md:text-[30px] font-extrabold tracking-wide transition-all duration-700"
      style={{
         fontFamily: fonts[fontIndex],
        textShadow: "0 0 18px rgba(34,197,94,0.8)",
       }}
    >
      buy / sell products today with us
    </h1>
  </div>

  {/* MENU BUTTON (RIGHT SIDE) */}
  <button
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    className="ml-auto p-2 rounded-full hover:bg-gray-100 transition"
  >
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

      {/* ✅ AESTHETIC CROSS-FADE BANNER */}
      <div className="px-5 mb-6">
        <div className="relative w-full h-40 md:h-56 rounded-2xl overflow-hidden bg-black video-container-glow border border-green-900/30 shadow-lg group">
          
          {/* Map through images and fade them in/out based on index */}
          {BANNER_IMAGES.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img 
                src={img} 
                alt="Premium Product" 
                className="w-full h-full object-cover opacity-80"
              />
              {/* Dark Overlay for text readability */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
          
          {/* Text Overlay (Stays on top) */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
            <h2 className="text-white text-2xl font-bold tracking-tighter animate-neon drop-shadow-lg">
              Discover Premium Deals on and off Campus
            </h2>
            <div className="h-1 w-12 bg-green-500 mt-2 rounded-full"></div>
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
                {/* Product Image - Removed Heart Icon */}
                <div className="h-36 w-full overflow-hidden rounded-xl mb-3 bg-gray-50 relative">
                  <img 
                    src={p.displayImage} 
                    alt={p.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                  />
                </div>
                
                {/* Product Info */}
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

          <div className="mt-6 flex flex-col items-center gap-3">
  <p className="text-sm font-semibold text-gray-300">
    Support
  </p>

  <a
    href="https://wa.me/254737107602?text=Hello%20I%20need%20support%20from%20your%20marketplace"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-green-500 font-semibold hover:text-green-400 transition"
  >
    {/* WhatsApp Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="20"
      height="20"
      fill="currentColor"
    >
      <path d="M16.001 3.2c-7.075 0-12.8 5.723-12.8 12.797 0 2.25.589 4.447 1.706 6.39L3.2 28.8l6.59-1.728a12.75 12.75 0 0 0 6.211 1.603h.002c7.073 0 12.797-5.723 12.797-12.797S23.074 3.2 16.001 3.2zm0 23.277a10.43 10.43 0 0 1-5.325-1.46l-.381-.226-3.91 1.026 1.043-3.812-.247-.392a10.397 10.397 0 0 1-1.59-5.555c0-5.765 4.693-10.456 10.46-10.456 5.764 0 10.456 4.691 10.456 10.456 0 5.764-4.692 10.456-10.456 10.456zm5.732-7.86c-.313-.156-1.85-.912-2.137-1.016-.286-.104-.494-.156-.703.156-.209.313-.809 1.016-.992 1.225-.182.209-.365.235-.677.078-.313-.156-1.32-.486-2.515-1.55-.93-.829-1.558-1.853-1.74-2.166-.182-.313-.02-.481.137-.637.14-.139.313-.365.469-.547.156-.182.209-.313.313-.521.104-.209.052-.391-.026-.547-.078-.156-.703-1.69-.964-2.314-.254-.61-.513-.527-.703-.537-.182-.01-.391-.013-.6-.013s-.547.078-.833.391c-.287.313-1.096 1.07-1.096 2.609 0 1.539 1.122 3.027 1.278 3.235.156.209 2.209 3.377 5.35 4.733.747.323 1.33.516 1.784.66.75.238 1.432.204 1.971.124.602-.089 1.85-.756 2.113-1.486.261-.73.261-1.356.182-1.486-.078-.13-.286-.209-.6-.365z" />
    </svg>

    <span>Chat with us on WhatsApp</span>
  </a>
</div>

           <div className="flex flex-col items-center gap-3 mt-6">
  <Link
    to="/terms"
    className="text-sm font-semibold text-green-500 hover:text-green-400 underline transition"
  >
    Terms & Conditions
  </Link>
</div>


          <p className="text-sm text-gray-500 pt-8 font-medium border-t border-gray-800 mt-6 w-full uppercase tracking-wide text-center">
            © 2026 Chuka Online Market. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}  