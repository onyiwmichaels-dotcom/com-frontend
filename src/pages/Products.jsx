import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Filter, ArrowLeft } from "lucide-react";
import OrderModal from "../components/modals/OrderModal"; 

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("cat");
  const search = searchParams.get("search");
  const typeParam = searchParams.get("type"); 

  const isSecondHand = typeParam === "second-hand";
  const pageTitle = isSecondHand ? "Second-Hand Items" : "New Products";
  
  // --- API CONFIG ---
  const API_URL = import.meta.env.VITE_API_BASE_URL || "https://com-backend-d56z.onrender.com/api/products";
  
  // FIX 1: Point strictly to the server root, not the uploads folder
  const SERVER_URL = import.meta.env.VITE_API_BASE_URL || "https://com-backend-d56z.onrender.com";

  // FIX 2: A helper function to build the correct URL no matter what the database says
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150?text=No+Image";
    
    // If it's already a full link (e.g., from the internet), use it
    if (imagePath.startsWith("http")) return imagePath;

    // If the path from DB starts with "/", just add the server URL
    // Example: "/uploads/myimage.jpg" -> "http://localhost:8080/uploads/myimage.jpg"
    if (imagePath.startsWith("/")) return `${SERVER_URL}${imagePath}`;

    // Otherwise, assume it needs the uploads folder
    return `${SERVER_URL}/uploads/${imagePath}`;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const typeFilter = isSecondHand ? "second-hand" : "new";
      let url = `${API_URL}?type=${typeFilter}`;
      if (category) url += `&category=${category}`;
      if (search) url += `&search=${search}`;

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
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
    <div className="min-h-screen bg-gray-50 px-5 py-6" style={{ fontFamily: 'Oswald, sans-serif' }}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <div>
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center text-gray-500 hover:text-green-700 mb-2 transition"
          >
            <ArrowLeft size={18} className="mr-1" /> Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {category ? `${category.toUpperCase()}` : pageTitle}
          </h1>
          {search && <p className="text-gray-500">Results for: "{search}"</p>}
        </div>

        <button 
          onClick={() => navigate(isSecondHand ? "/shop" : "/shop?type=second-hand")}
          className={`mt-4 md:mt-0 px-6 py-3 rounded-lg font-bold text-white shadow-md transition ${
            isSecondHand ? "bg-green-700 hover:bg-green-800" : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          Switch to {isSecondHand ? "New Products" : "Second-Hand"}
        </button>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading products...</div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No products found.</p>
              <button onClick={() => navigate("/shop")} className="mt-4 text-green-700 underline">
                View all new products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:border-green-300 transition group"
                >
                  {/* Image Container */}
                  <div className="h-40 w-full overflow-hidden rounded-lg mb-3 bg-gray-100">
                    <img
                      // FIX 3: Use the helper function here
                      src={getImageUrl(p.image)}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    />
                  </div>
                  
                  <h2 className="font-semibold text-lg text-gray-800 leading-tight mb-1">
                    {p.name}
                  </h2>
                  <p className="text-green-700 font-bold text-xl">
                    KES {p.price}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                    {p.category || "General"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}