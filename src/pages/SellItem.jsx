import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, CheckCircle, XCircle, Loader, Tag, MapPin, DollarSign, Type, Image as ImageIcon, Phone } from "lucide-react"; // Imported Phone icon

export default function SellItem() {
  const navigate = useNavigate();
  
  // ✅ Base URL for backend
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://com-backend-d56z.onrender.com";

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    location: "", // Added location field for seller context
    image: "",    // Will hold the server URL after upload
    sellerPhone: "", // NEW: Field to hold the seller's phone number
    type: "second-hand", // Default for user sales
    status: "pending"    // 🛡️ Approval Workflow: Item starts as pending
  });

  const [uploadStatus, setUploadStatus] = useState({ status: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Consistent Categories
  const categories = ["TVs & Audio", "Appliances", "Fashion", "Academics", "Phones", "Home", "Other"];

  // --- 1. Image Upload Logic (Reused from PopupForm) ---
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus({ status: "loading", message: "Uploading image..." });

    try {
      const fd = new FormData();
      fd.append("image", file);

      // Using the existing upload route
      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      
      // Save the returned URL to the form state
      setForm({ ...form, image: data.filePath });
      setUploadStatus({ status: "success", message: "Image attached! ✅" });

    } catch (err) {
      console.error(err);
      setUploadStatus({ status: "error", message: "Failed to upload image ❌" });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- 2. Submit Product Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Updated validation to require sellerPhone
    if (!form.name || !form.price || !form.category || !form.image || !form.sellerPhone) {
        // Replacing alert() with an inline message for better UX, similar to PopupForm
        setUploadStatus({ status: 'error', message: "Please fill in Name, Price, Category, Phone Number, and upload an image." });
        return;
    }

    setIsSubmitting(true);

    try {
      // We send this to a new public route (or the existing one if open)
      // NOTE: Ensure your backend has a route to handle POST /api/products from public
      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...form,
            price: parseFloat(form.price) // Ensure number format
        }),
      });

      if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Server error");
      }

      // Success UI
      // Using setUploadStatus for success message instead of alert()
      setUploadStatus({ status: 'success', message: "Item submitted for approval! 🚀 Redirecting..." });
      
      // Delay navigation slightly to let the user see the success message
      setTimeout(() => {
          navigate("/"); // Go back home
      }, 1500);


    } catch (err) {
      console.error("Submission error:", err);
      // Using setUploadStatus for error message instead of alert()
      setUploadStatus({ status: 'error', message: `Failed to list item: ${err.message}` });
    } finally {
      // We only reset isSubmitting if the navigation didn't happen (i.e., error)
      if (uploadStatus.status !== 'success') {
          setIsSubmitting(false);
      }
    }
  };

  const getImageUrl = (path) => {
      if (!path) return null;
      if (path.startsWith("http")) return path;
      return `${API_BASE}${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
      
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-800 tracking-wide uppercase mb-2">
                Sell Your Stuff 🚀
            </h1>
            <p className="text-gray-500">Turn your items into cash. Fast & Easy.</p>
        </div>

        <form 
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 space-y-6"
        >
            
            {/* Image Upload Section */}
            <div className="space-y-2">
                <label className="font-bold text-gray-700 flex items-center gap-2">
                    <ImageIcon size={20} className="text-green-600"/> Product Image
                </label>
                
                <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                    uploadStatus.status === 'error' ? 'border-red-300 bg-red-50' : 'border-green-200 hover:bg-green-50'
                }`}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFile}
                        className="hidden" 
                        id="file-upload"
                    />
                    
                    {!form.image ? (
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-green-700">
                            <UploadCloud size={40} />
                            <span className="font-medium">Tap to Upload Photo</span>
                        </label>
                    ) : (
                        <div className="relative w-full h-64">
                            <img 
                                src={getImageUrl(form.image)} 
                                alt="Preview" 
                                className="w-full h-full object-cover rounded-xl shadow-sm"
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = "https://placehold.co/256x256/f3f4f6/a1a1aa?text=Image+Error"; 
                                }}
                            />
                            <label htmlFor="file-upload" className="absolute bottom-2 right-2 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-bold cursor-pointer shadow-md hover:bg-white">
                                Change
                            </label>
                        </div>
                    )}
                </div>
                
                {/* Status Message Display */}
                {(uploadStatus.status === 'loading' || uploadStatus.status === 'error' || uploadStatus.status === 'success') && (
                    <div className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                        uploadStatus.status === 'success' ? 'bg-green-100 text-green-700' : 
                        uploadStatus.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {uploadStatus.status === 'loading' && <Loader size={16} className="animate-spin"/>}
                        {uploadStatus.status === 'success' && <CheckCircle size={16}/>}
                        {uploadStatus.status === 'error' && <XCircle size={16}/>}
                        {uploadStatus.message}
                    </div>
                )}
            </div>

            {/* Title & Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Type size={18} className="text-green-600"/> Item Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Samsung A12"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-green-500 transition font-medium text-gray-800"
                    />
                </div>
                
                <div>
                    <label className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign size={18} className="text-green-600"/> Price (KES)
                    </label>
                    <input
                        type="number"
                        name="price"
                        required
                        placeholder="e.g. 8500"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-green-500 transition font-medium text-gray-800"
                    />
                </div>
            </div>

            {/* NEW: Seller Phone Number Input */}
            <div>
                <label className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={18} className="text-blue-600"/> Your Contact Phone (Required)
                </label>
                <input
                    type="tel"
                    name="sellerPhone"
                    required
                    placeholder="e.g. 07XXXXXXXX (Used for buyers to contact you)"
                    value={form.sellerPhone}
                    onChange={handleChange}
                    className="w-full bg-blue-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-blue-500 transition font-medium text-blue-800"
                />
            </div>

            {/* Category */}
            <div>
                <label className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Tag size={18} className="text-green-600"/> Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                        <div 
                            key={cat}
                            onClick={() => setForm({...form, category: cat})}
                            className={`cursor-pointer p-3 rounded-xl text-center text-sm font-bold transition border ${
                                form.category === cat 
                                ? 'bg-green-700 text-white border-green-700 shadow-md transform scale-105' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                            }`}
                        >
                            {cat}
                        </div>
                    ))}
                </div>
            </div>

            {/* Location */}
            <div>
                <label className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={18} className="text-green-600"/> Pickup Location / Hostel
                </label>
                <input
                    type="text"
                    name="location"
                    placeholder="e.g. Ndagani, Everest Hostel"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-green-500 transition font-medium text-gray-800"
                />
            </div>

            {/* Description */}
            <div>
                <label className="font-bold text-gray-700 mb-2 block">Description</label>
                <textarea
                    name="description"
                    placeholder="Any faults? How long was it used?"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-green-500 transition font-medium text-gray-800 resize-none"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-2xl text-xl font-bold shadow-lg shadow-green-200 transition transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3"
            >
                {isSubmitting ? (
                    <>Posting...</>
                ) : (
                    <>Post Item 🚀</>
                )}
            </button>

        </form>
      </div>
    </div>
  );
}