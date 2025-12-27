import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Hidden Admin Access (Double click logo)
  const goToAdminLogin = () => {
    const answer = prompt("Enter admin access PIN:");
    if (answer === "WalterPIN2025") {
      navigate("/admin/login");
      setOpen(false);
    } else {
      alert("Wrong PIN ❌");
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (search.trim().length < 1) return;
      navigate(`/shop?search=${search}`);
      setSearch("");
      setOpen(false);
    }
  };

  return (
    <nav className="bg-white text-gray-800 shadow-sm border-b border-gray-200 sticky top-0 z-50" style={{ fontFamily: 'Oswald, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <div onDoubleClick={goToAdminLogin} className="cursor-pointer flex items-center gap-2 select-none">
          <div className="bg-green-700 text-white p-2 rounded-lg">
            <ShoppingBag size={24} />
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-bold text-green-700 tracking-wide">COM</h1>
            <span className="text-xs text-gray-500 hidden sm:block uppercase tracking-widest">
              Chuka Online Market
            </span>
          </div>
        </div>

        {/* DESKTOP SEARCH BAR */}
        <div className="hidden md:flex items-center bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="bg-transparent outline-none text-sm w-64 text-gray-700 placeholder-gray-400"
            placeholder="Search items..."
          />
          <Search className="cursor-pointer text-gray-500 hover:text-green-700 transition" size={20} onClick={handleSearch} />
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex space-x-8 font-medium text-lg items-center">
          <Link to="/" className="hover:text-green-700 transition">Home</Link>
          <Link to="/shop" className="hover:text-green-700 transition">Shop New</Link>
          <Link to="/shop?type=second-hand" className="hover:text-green-700 transition">Second Hand</Link>
          <Link to="/sell-item" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition shadow-md text-base">
            Sell Item
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button className="md:hidden text-gray-700 hover:text-green-700" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-4 shadow-xl absolute w-full left-0">
          
          {/* Mobile Search */}
          <div className="flex items-center bg-gray-100 border border-gray-300 px-3 py-3 rounded-lg">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-transparent outline-none flex-1 text-gray-700"
              placeholder="Search products..."
            />
            <Search size={20} className="text-gray-500" onClick={handleSearch} />
          </div>

          <div className="flex flex-col space-y-4 text-lg font-medium">
            <Link to="/" onClick={() => setOpen(false)} className="hover:text-green-700 border-b border-gray-100 pb-2">Home</Link>
            <Link to="/shop" onClick={() => setOpen(false)} className="hover:text-green-700 border-b border-gray-100 pb-2">Shop New Products</Link>
            <Link to="/shop?type=second-hand" onClick={() => setOpen(false)} className="hover:text-green-700 border-b border-gray-100 pb-2">Second Hand</Link>
            <Link to="/support" onClick={() => setOpen(false)} className="hover:text-green-700 border-b border-gray-100 pb-2">Support</Link>
            
            <Link to="/sell-item" onClick={() => setOpen(false)} className="block text-center bg-green-700 text-white py-3 rounded-xl font-bold shadow">
              Sell Item
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}