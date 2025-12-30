import { useState, useEffect } from "react";
import { PackagePlus, Edit, X, UploadCloud, Tag, CheckCircle, XCircle, Phone } from "lucide-react";
import { API_BASE_URL } from "../config/api";

export default function PopupForm({ onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    description: "",
    image: "",      // URL or filename URL
    type: "new",    // "new" or "second-hand"
    category: "Phones",
    sellerPhone: "", // NEW: Field to store the seller's phone number
  });

  // State for file upload status messages (replaces alert())
  const [uploadStatus, setUploadStatus] = useState({ status: 'idle', message: '' });

  // Updated categories list to match the homepage and dashboard
  const categories = ["TVs & Audio", "Appliances", "Fashion", "Academics", "Phones", "Home", "Other"];

  useEffect(() => {
    // Merge initialData if provided (for Edit mode)
    if (initialData) {
      setForm((prevForm) => ({ 
        ...prevForm, 
        ...initialData,
        // Ensure sellerPhone is present, defaulting to empty string if missing
        sellerPhone: initialData.sellerPhone || "", 
      }));
    }
  }, [initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // --- File Upload Logic ---
  const uploadFile = async (file) => {
    setUploadStatus({ status: 'loading', message: 'Uploading image...' });
    
    const fd = new FormData();
    fd.append('image', file);
    
    // NOTE: Hardcoded API link for the upload endpoint.
    const res = await fetch(`${API_BASE_URL}/api/admin/upload`, {
      method: 'POST',
      body: fd
    });
    
    if (!res.ok) {
      setUploadStatus({ status: 'error', message: 'Image upload failed ❌' });
      throw new Error("File upload failed.");
    }
    
    const data = await res.json();
    // The backend should return { filePath: '/uploads/filename.jpg' }
    // We expect 'data.filePath' based on the standard backend setup
    return data.filePath; 
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadFile(file);
      setForm((prevForm) => ({ ...prevForm, image: url }));
      setUploadStatus({ status: 'success', message: 'Image uploaded successfully! ✅' });
    } catch (err) {
      console.error(err);
      // Status message already set in uploadFile on error
    }
  };
  // -----------------------------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use an inline message box instead of alert() for validation failure
    if (!form.name || !form.price || !form.image || !form.sellerPhone) { // Added sellerPhone validation
        setUploadStatus({ 
            status: 'error', 
            message: "Name, price, image, AND seller phone number are required." 
        });
        return;
    }
    
    // Ensure price is a number before saving
    const dataToSave = {
        ...form,
        price: parseFloat(form.price),
        isAdmin: true, // Since this is from Admin Dashboard   
    };
    
    // Pass the final, ready-to-save JSON object to the parent
    onSave(dataToSave);
  };

  const statusColor = {
      idle: 'text-gray-500',
      loading: 'text-blue-500 animate-pulse',
      success: 'text-green-600',
      error: 'text-red-600'
  }[uploadStatus.status];

  return (
    // Fixed Overlay
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      
      {/* Modal Body */}
      <div 
        className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" 
        style={{ fontFamily: 'Oswald, sans-serif' }}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-3xl font-bold text-green-700 flex items-center gap-3">
            {form.id ? <><Edit size={28} /> Edit Product</> : <><PackagePlus size={28} /> New Product</>}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 transition">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name and Price */}
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Product name (e.g., iPhone 17)" 
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition" 
          />
          <input 
            name="price" 
            type="number" 
            value={form.price} 
            onChange={handleChange} 
            placeholder="Price (e.g., 5000)" 
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition" 
          />
          
          {/* NEW: Seller Phone Number Input */}
          <div className="relative">
             <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
             <input 
                name="sellerPhone" 
                type="tel" // Use tel for mobile numbers
                value={form.sellerPhone} 
                onChange={handleChange} 
                placeholder="Seller Phone Number (required)" 
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
             />
          </div>

          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Detailed description of the item..." 
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition" 
          />

          {/* Type and Category Selectors */}
          <div className="flex gap-4">
            {/* Product Type (New or Used) */}
            <select 
              name="type" 
              value={form.type} 
              onChange={handleChange} 
              className={`p-3 border rounded-xl flex-1 font-bold appearance-none transition ${
                form.type === 'second-hand' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-green-500 bg-green-50 text-green-700'
              }`}
            >
              <option value="new">🌟 New Item</option>
              <option value="second-hand">♻️ Second-Hand</option>
            </select>

            {/* Category */}
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              className="p-3 border border-gray-300 rounded-xl flex-1 focus:ring-2 focus:ring-green-500 transition bg-white"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Image Upload Area */}
          <div className="border border-gray-300 p-4 rounded-xl bg-gray-50 space-y-2">
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <UploadCloud size={20} /> Product Image
            </label>
            
            {/* File Input */}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFile} 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
            
            {/* Status Message Box */}
            {uploadStatus.message && (
                <div className={`p-2 rounded-lg text-sm flex items-center gap-2 ${
                    uploadStatus.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                    {uploadStatus.status === 'success' ? <CheckCircle size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-600" />}
                    <span className={statusColor}>{uploadStatus.message}</span>
                </div>
            )}
            
            <p className="text-sm text-gray-500 pt-2 border-t border-gray-200">Or paste a direct image URL:</p>
            
            {/* URL Input */}
            <input 
              name="image" 
              value={form.image} 
              onChange={handleChange} 
              placeholder="Image URL (e.g., https://...)" 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 text-sm" 
            />
            
            {/* Image Preview */}
            {form.image && (
                <div className="mt-3">
                    <p className="text-xs text-green-600 font-medium mb-1">Preview:</p>
                    <img 
                        src={form.image} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200" 
                        onError={(e) => {
                            e.target.onerror = null; // prevents infinite loop
                            e.target.src = "https://placehold.co/96x96/f3f4f6/a1a1aa?text=URL%20Error"; // placeholder fallback
                        }}
                    />
                </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 border border-gray-400 text-gray-700 rounded-xl hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition font-bold shadow-lg shadow-green-200"
            >
              {form.id ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}