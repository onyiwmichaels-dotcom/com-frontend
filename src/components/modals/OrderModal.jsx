import { useState } from "react";
import { X, CheckCircle } from "lucide-react";
// ✅ Import our API tools
import { API_BASE_URL, apiPost } from "../../config/api"; 

export default function OrderModal({ product, onClose }) {
    const [details, setDetails] = useState({
        name: "",
        phone: "",
        location: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!product) return null;

    // ✅ Image Helper (Same logic as Products.jsx)
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/150?text=No+Image";
        if (imagePath.startsWith("http")) return imagePath;
        let cleanPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
        if (cleanPath.startsWith("uploads/")) return `${API_BASE_URL}/${cleanPath}`;
        return `${API_BASE_URL}/uploads/${cleanPath}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // ✅ DATA PAYLOAD
        const orderData = {
            customerName: details.name,
            phone: details.phone,
            location: details.location,
            productId: product.id || product._id, // Support both id and _id
            productName: product.name, // Helpful for the backend/email notifications
            price: product.price
        };

        try {
            // ✅ Use apiPost instead of fetch("http://127.0.0.1...")
            // The helper automatically adds "/api" and the base URL
            const data = await apiPost("/orders", orderData);
            
            setSubmitted(true);

            // Close modal after success
            setTimeout(() => {
                onClose();
            }, 2500);

        } catch (error) {
            console.error("❌ Failed to place order:", error);
            alert("Failed to place order. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
                
                {/* LEFT SIDE: Product Details */}
                <div className="md:w-1/2 bg-gray-100 p-6 flex flex-col">
                    <h3 className="text-gray-500 text-sm font-bold tracking-wider mb-2 uppercase">Selected Item</h3>
                    
                    <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name} 
                        className="w-full h-48 object-cover rounded-lg shadow-md mb-4 bg-white"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    />
                    
                    <h2 className="text-2xl font-bold text-gray-800 leading-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
                        {product.name}
                    </h2>
                    
                    <p className="text-xl font-bold text-green-700 mt-1">
                        KES {product.price}
                    </p>
                    
                    <div className="mt-3 text-gray-600 text-sm leading-relaxed overflow-y-auto max-h-32">
                        <p className="font-semibold">Description:</p>
                        {product.description || "No additional description available."}
                    </div>
                </div>

                {/* RIGHT SIDE: Order Form */}
                <div className="md:w-1/2 p-6 relative">
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                    >
                        <X size={24} />
                    </button>

                    {submitted ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-10">
                            <CheckCircle size={64} className="text-green-500 animate-bounce" />
                            <h3 className="text-2xl font-bold text-gray-800">Order Sent!</h3>
                            <p className="text-gray-500">The seller will contact you shortly.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
                                Delivery Details
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Your Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                                        placeholder="John Ochieng"
                                        value={details.name}
                                        onChange={(e) => setDetails({...details, name: e.target.value})}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                                        placeholder="0712 345 678"
                                        value={details.phone}
                                        onChange={(e) => setDetails({...details, phone: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Location / Hostel</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                                        placeholder="e.g. Ndagani, Mungoni"
                                        value={details.location}
                                        onChange={(e) => setDetails({...details, location: e.target.value})}
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className={`w-full py-4 rounded-xl font-bold shadow-lg transition transform active:scale-95 mt-2 text-white uppercase tracking-wider ${
                                        loading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-green-700 hover:bg-green-800'
                                    }`}
                                >
                                    {loading ? 'Processing...' : 'Place Order Now'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}