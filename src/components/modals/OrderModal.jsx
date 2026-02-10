import { useState } from "react";
import { X, CheckCircle, Maximize, Minimize } from "lucide-react";
import { apiPost } from "../../config/api"; 

export default function OrderModal({ product, onClose }) {
    const [details, setDetails] = useState({
        name: "",
        phone: "",
        location: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false); // Zoom State

    if (!product) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            customerName: details.name,
            phone: details.phone,
            location: details.location,
            productId: product.id || product._id,
            productName: product.name,
            price: product.price
        };

        try {
            await apiPost("/orders", orderData);
            setSubmitted(true);
            setTimeout(() => { onClose(); }, 2500);
        } catch (error) {
            console.error("❌ Failed to place order:", error);
            alert("Failed to place order. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-2 md:p-4 backdrop-blur-md">
            
            {/* Modal Container */}
            <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 ${isZoomed ? 'h-[90vh]' : 'max-h-[95vh]'}`}>
                
                {/* Close Button (Mobile Floating) */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-[110] bg-black/50 text-white p-2 rounded-full md:text-gray-400 md:bg-transparent md:hover:text-red-500 transition"
                >
                    <X size={24} />
                </button>

                {/* --- LEFT SIDE: IMAGE & DESCRIPTION --- */}
                <div className={`relative transition-all duration-500 bg-gray-50 flex flex-col ${isZoomed ? 'md:w-full' : 'md:w-1/2'}`}>
                    
                    {/* Tap to Zoom Image Container */}
                    <div 
                        className={`relative overflow-hidden cursor-zoom-in bg-white flex-grow flex items-center justify-center ${isZoomed ? 'h-full' : 'h-64 md:h-full'}`}
                        onClick={() => setIsZoomed(!isZoomed)}
                    >
                        <img 
                            src={product.image || "https://via.placeholder.com/400?text=No+Image"} 
                            alt={product.name} 
                            className={`w-full h-full transition-transform duration-700 ease-in-out ${isZoomed ? 'object-contain scale-110' : 'object-cover'}`}
                        />
                        
                        {/* Zoom Label */}
                        <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md text-[10px] text-white px-3 py-1 rounded-full flex items-center gap-2 uppercase tracking-widest font-bold">
                            {isZoomed ? <><Minimize size={12}/> Tap to minimize</> : <><Maximize size={12}/> Tap to zoom</>}
                        </div>
                    </div>

                    {/* Product Basic Info (Hidden when zoomed for focus) */}
                    {!isZoomed && (
                        <div className="p-4 md:p-6 bg-white border-t md:border-t-0">
                            <h2 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter" style={{ fontFamily: 'Oswald, sans-serif' }}>
                                {product.name}
                            </h2>
                            <p className="text-lg font-bold text-green-600">KES {Number(product.price).toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest leading-tight line-clamp-2 md:line-clamp-none">
                                {product.description || "Fresh stock available at Chuka Market."}
                            </p>
                        </div>
                    )}
                </div>

                {/* --- RIGHT SIDE: ORDER FORM --- */}
                {!isZoomed && (
                    <div className="md:w-1/2 p-5 md:p-8 flex flex-col justify-center bg-white border-t md:border-l border-gray-100">
                        {submitted ? (
                            <div className="py-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4">
                                <div className="bg-green-100 p-4 rounded-full mb-4">
                                    <CheckCircle size={48} className="text-green-600 animate-bounce" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900">Order Received!</h3>
                                <p className="text-gray-500 text-sm mt-2 font-medium">We are notifying the seller now.</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Secure Order</h3>
                                    <p className="text-xs text-gray-400">Enter your details to finish ordering.</p>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="group">
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                                            placeholder="Your Full Name"
                                            value={details.name}
                                            onChange={(e) => setDetails({...details, name: e.target.value})}
                                        />
                                    </div>
                                    
                                    <div>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                                            placeholder="WhatsApp Number (07...)"
                                            value={details.phone}
                                            onChange={(e) => setDetails({...details, phone: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                                            placeholder="Hostel or Area (e.g Ndagani)"
                                            value={details.location}
                                            onChange={(e) => setDetails({...details, location: e.target.value})}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[2px] shadow-xl shadow-green-100 transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                                            loading 
                                                ? 'bg-gray-300 text-gray-500' 
                                                : 'bg-green-600 text-white hover:bg-black'
                                        }`}
                                    >
                                        {loading ? 'Sending Request...' : 'Confirm Order KES ' + Number(product.price).toLocaleString()}
                                    </button>
                                    
                                    <p className="text-[9px] text-center text-gray-300 uppercase font-bold tracking-tighter mt-2">
                                        Free delivery within Chuka University & Ndagani
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}