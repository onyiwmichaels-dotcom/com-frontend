import { useState } from "react";
import { X, CheckCircle } from "lucide-react";

export default function OrderModal({ product, onClose }) {
    const [details, setDetails] = useState({
        name: "",
        phone: "",
        location: "",
    });
    const [submitted, setSubmitted] = useState(false);
    
    // Set loading state for better UX
    const [loading, setLoading] = useState(false);

    if (!product) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const API_URL = "http://127.0.0.1:8080/api/orders"; // Corrected to port 8080

        // Data payload for the backend
        const orderData = {
            customerName: details.name,
            phone: details.phone,
            location: details.location,
            productId: product.id, // Assumes product object has an 'id' property
        };

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!res.ok) {
                // Handle non-2xx status codes (e.g., 400, 500)
                const errorData = await res.json();
                throw new Error(errorData.error || `Server error: ${res.status}`);
            }
            
            // Successful Submission
            setSubmitted(true);

            // Optional: Close modal after 2 seconds
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error) {
            console.error("❌ Failed to place order:", error);
            // In a real app, you'd show a user-friendly error message here
            alert("Failed to place order. Please try again.");
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            
            {/* Modal Content */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
                
                {/* LEFT SIDE: Product Details */}
                <div className="md:w-1/2 bg-gray-100 p-6 flex flex-col">
                    <h3 className="text-gray-500 text-sm font-bold tracking-wider mb-2">SELECTED ITEM</h3>
                    
                    <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-lg shadow-md mb-4 bg-white"
                    />
                    
                    <h2 className="text-2xl font-bold text-gray-800 leading-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
                        {product.name}
                    </h2>
                    
                    <p className="text-xl font-bold text-green-700 mt-1">
                        KES {product.price}
                    </p>
                    
                    <div className="mt-3 text-gray-600 text-sm leading-relaxed">
                        <p className="font-semibold">Description:</p>
                        {/* Fallback if description is missing */}
                        {product.description || "No additional description available for this item."}
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
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                            <CheckCircle size={64} className="text-green-500" />
                            <h3 className="text-2xl font-bold text-gray-800">Order Sent!</h3>
                            <p className="text-gray-500">The seller will contact you shortly.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                                Complete Order
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="John Doe"
                                        value={details.name}
                                        onChange={(e) => setDetails({...details, name: e.target.value})}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="0712 345 678"
                                        value={details.phone}
                                        onChange={(e) => setDetails({...details, phone: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location / Hostel</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. Ndagani, Everest Hostel"
                                        value={details.location}
                                        onChange={(e) => setDetails({...details, location: e.target.value})}
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className={`w-full py-3 rounded-xl font-bold shadow-lg transition transform hover:scale-105 mt-2 ${
                                        loading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-green-700 hover:bg-green-800 text-white'
                                    }`}
                                >
                                    {loading ? 'Sending...' : 'Confirm Order'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}