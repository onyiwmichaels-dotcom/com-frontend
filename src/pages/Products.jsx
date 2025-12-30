import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import OrderModal from "../components/modals/OrderModal"; 
// Ensure this path is correct based on your folder structure
import { API_BASE_URL, apiFetch } from "../config/api"; 

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
  
  // ✅ FIX 1: Robust Image URL Helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150?text=No+Image";
    // If it's a full web link, use it
    if (imagePath.startsWith("http")) return imagePath;
    // If it's a relative path, combine it with the Backend URL
    // We strip the leading slash to prevent double slashes
    const cleanPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
    return `${API_BASE_URL}/uploads/${cleanPath}`;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const typeFilter = isSecondHand ? "second-hand" : "new";
      
      // ✅ FIX 2: REMOVE "/api" from here! 
      // The apiFetch helper in api.js already adds it.
      // Was: `/api/products?type=...`  ->  Now: `/products?type=...`
      let endpoint = `/products?type=${typeFilter}`;
      
      if (category) endpoint += `&category=${category}`;
      if (search) endpoint += `&search=${search}`;

      console.log("Fetching from:", endpoint); // Debug log

      const data = await apiFetch(endpoint);

      // Safety check: ensure data is an array before setting it
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Data format error: Expected array, got", data);
        setProducts([]);
      }
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

      {/* ✅ FIX 3: Ensure selectedProduct exists before rendering Modal.
         If OrderModal has issues, it's likely because it also has a path error inside it.
      */}
      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}