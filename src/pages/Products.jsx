import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";
import OrderModal from "../components/modals/OrderModal"; 
import { apiFetch } from "../config/api"; 

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Route Filters
  const category = searchParams.get("cat") || searchParams.get("category");
  const search = searchParams.get("search");
  const typeParam = searchParams.get("type"); 

  const isSecondHand = typeParam === "second-hand";
  const pageTitle = isSecondHand ? "Thrift Shop" : "New Drops";
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const typeFilter = isSecondHand ? "second-hand" : "new";
      let endpoint = `/products?type=${typeFilter}`;
      
      if (category) endpoint += `&category=${category}`;
      if (search) endpoint += `&search=${search}`;

      const data = await apiFetch(endpoint);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, search, isSecondHand]);

  return (
    <div className="min-h-screen bg-[#fafafa] px-3 md:px-6 py-6" style={{ fontFamily: 'Oswald, sans-serif' }}>
      
      {/* --- HEADER SECTION --- */}
      <div className="mb-6 flex flex-col gap-4">
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center text-[10px] font-bold uppercase tracking-[2px] text-gray-400 hover:text-green-600 transition w-fit"
        >
          <ArrowLeft size={14} className="mr-1" /> Back to Home
        </button>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">
              {category ? category : pageTitle}
            </h1>
            {search && <p className="text-xs text-gray-400 mt-1 italic">Found for: "{search}"</p>}
          </div>

          <button 
            onClick={() => navigate(isSecondHand ? "/shop" : "/shop?type=second-hand")}
            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg ${
              isSecondHand ? "bg-green-600 text-white shadow-green-100" : "bg-black text-white shadow-gray-200"
            }`}
          >
            {isSecondHand ? "New Items" : "Thrift Mode"}
          </button>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-2"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest">Loading Chuka Market...</p>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
              <p className="text-gray-400 uppercase text-xs font-bold tracking-widest">No Stock Available Yet</p>
              <button onClick={() => navigate("/shop")} className="mt-3 text-green-600 font-bold text-xs uppercase underline underline-offset-4">
                View All Items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.03)] active:scale-95 transition-all duration-300 group border border-transparent hover:border-green-100"
                >
                  {/* 🖼️ IMAGE: BORDERLESS & TALL */}
                  <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 relative">
                    <img
                      src={p.image || "https://via.placeholder.com/400x500?text=No+Image"}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* NEON BADGE (Applied your CSS) */}
                    <div className="absolute top-2 left-2">
                       <span className="bg-black/40 backdrop-blur-md text-[8px] font-bold uppercase px-2 py-1 rounded text-white border border-white/20 animate-neon">
                         {isSecondHand ? 'Thrift' : 'New'}
                       </span>
                    </div>
                  </div>
                  
                  {/* 📄 CONTENT: MINIMAL & CLEAN */}
                  <div className="p-3 md:p-4">
                    <h2 className="wave-text font-bold text-[13px] uppercase tracking-tight truncate">
                      {p.name}
                    </h2>
                    
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-gray-900 font-black text-[15px]">
                        KES {Number(p.price).toLocaleString()}
                      </p>
                      <div className="text-gray-200 group-hover:text-green-500 transition-colors">
                         <ShoppingBag size={14} />
                      </div>
                    </div>

                    <p className="text-[9px] text-gray-300 mt-2 uppercase tracking-widest font-bold">
                       {p.category || "Available"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* --- MODAL --- */}
      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}