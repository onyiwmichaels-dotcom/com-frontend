import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Menu, X, ShoppingBag, Zap, Flame,
  Tv, Shirt, Home as HomeIcon, BookOpen,
  Phone, Instagram
} from "lucide-react";
import { API_BASE_URL } from "../config/api";

/* BANNER IMAGES */
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

  /* 🔥 GRAFFITI FONT ROTATION */
  const fonts = [
    "'Pacifico', cursive",
    "'Bebas Neue', sans-serif",
    "'Monoton', cursive",
    "'Oswald', sans-serif",
  ];
  const [fontIndex, setFontIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("comUser"));
    setUser(storedUser);
  }, []);

  /* SLIDESHOW */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /* FONT SWITCH ANIMATION */
  useEffect(() => {
    const fontInterval = setInterval(() => {
      setFontIndex((prev) => (prev + 1) % fonts.length);
    }, 1200);
    return () => clearInterval(fontInterval);
  }, []);

  /* FETCH PRODUCTS */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/latest`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.slice(0, 4).map(p => ({
          ...p,
          displayImage: p.image?.startsWith("http")
            ? p.image
            : `${API_BASE_URL}${p.image?.startsWith("/") ? "" : "/"}${p.image}`,
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
    if (e.key === "Enter" && search.trim()) {
      navigate(`/shop?search=${search}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm px-5 py-6 flex items-center relative">

        {/* 🔥 GRAFFITI TEXT */}
        <div className="absolute left-1/2 -translate-x-1/2 w-full text-center px-4">
          <h1
            className="wave-text text-[22px] sm:text-[26px] md:text-[30px] font-extrabold tracking-wide transition-all duration-700"
            style={{
              fontFamily: fonts[fontIndex],
              textShadow: "0 0 20px rgba(34,197,94,0.8)",
            }}
          >
            buy / sell products today with us
          </h1>
        </div>

        {/* MENU BUTTON */}
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
            className="w-full pl-12 pr-4 py-3 rounded-2xl shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
        </div>
      </div>

      {/* BANNER */}
      <div className="px-5 mb-6">
        <div className="relative w-full h-40 md:h-56 rounded-2xl overflow-hidden bg-black">
          {BANNER_IMAGES.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img src={img} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
          <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
            <h2 className="text-white text-2xl font-bold">
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

      {/* CATEGORIES */}
      <div className="px-5 mb-8">
        <h2 className="text-lg font-bold mb-4">Browse Categories</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => goToCategory(cat.Value)}
              className="flex flex-col items-center min-w-[85px] cursor-pointer"
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-600">
                {cat.icon}
              </div>
              <span className="text-[10px] font-bold text-gray-600 mt-2">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TRENDING */}
      <div className="px-5 mb-10">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Flame className="text-orange-500" size={20} /> Trending
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {featuredProducts.map((p) => (
            <div key={p.id} className="bg-white p-3 rounded-2xl shadow-sm">
              <img src={p.displayImage} className="h-36 w-full object-cover rounded-xl" />
              <h3 className="font-bold text-sm mt-2">{p.name}</h3>
              <p className="text-green-600 font-bold">KES {p.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6">
        <div className="text-center">
          <p className="text-white font-bold">Customer Support</p>
          <p>0737 107 602</p>
          <p>@COM_KE</p>
        </div>
      </footer>
    </div>
  );
}
