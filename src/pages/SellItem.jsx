import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UploadCloud, CheckCircle, XCircle, Tag, MapPin, DollarSign, Type, Image as ImageIcon, Phone 
} from "lucide-react";
import { apiFetch, API_BASE_URL } from "../config/api"; // <-- import API helper

export default function SellItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    location: "",
    image: "",
    sellerPhone: "",
    type: "second-hand",
    status: "pending"
  });

  const [uploadStatus, setUploadStatus] = useState({ status: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["TVs & Audio", "Appliances", "Fashion", "Academics", "Phones", "Home", "Other"];

  // --- File Upload using api.js ---
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus({ status: "loading", message: "Uploading image..." });

    try {
      const formData = new FormData();
      formData.append("image", file);

      // POST /admin/upload handled by apiFetch
      const data = await apiFetch("/admin/upload", { method: "POST", body: formData });
      
      setForm(prev => ({ ...prev, image: data.filePath }));
      setUploadStatus({ status: "success", message: "Image uploaded successfully! ✅" });

    } catch (err) {
      console.error("Image upload error:", err);
      setUploadStatus({ status: "error", message: "Failed to upload image ❌" });
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- Submit Product using api.js ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category || !form.image || !form.sellerPhone) {
      setUploadStatus({ 
        status: "error", 
        message: "Please fill in Name, Price, Category, Phone Number, and upload an image." 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price)
      };

      await apiFetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setUploadStatus({ status: "success", message: "Item submitted for approval! 🚀 Redirecting..." });

      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      console.error("Submission error:", err);
      setUploadStatus({ status: "error", message: `Failed to list item: ${err.message}` });
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 tracking-wide uppercase mb-2">Sell Your Stuff 🚀</h1>
          <p className="text-gray-500">Turn your items into cash. Fast & Easy.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 space-y-6">

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="font-bold text-gray-700 flex items-center gap-2">
              <ImageIcon size={20} className="text-green-600"/> Product Image
            </label>

            <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
              uploadStatus.status === "error" ? "border-red-300 bg-red-50" : "border-green-200 hover:bg-green-50"
            }`}>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="file-upload" />
              {!form.image ? (
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-green-700">
                  <UploadCloud size={40} />
                  <span className="font-medium">Tap to Upload Photo</span>
                </label>
              ) : (
                <div className="relative w-full h-64">
                  <img src={getImageUrl(form.image)} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-sm"
                    onError={(e) => { e.target.onerror=null; e.target.src="https://placehold.co/256x256/f3f4f6/a1a1aa?text=Image+Error"; }} 
                  />
                  <label htmlFor="file-upload" className="absolute bottom-2 right-2 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-bold cursor-pointer shadow-md hover:bg-white">
                    Change
                  </label>
                </div>
              )}
            </div>

            {uploadStatus.message && (
              <div className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                uploadStatus.status === "success" ? "bg-green-100 text-green-700" :
                uploadStatus.status === "error" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
              }`}>
                {uploadStatus.status === "success" && <CheckCircle size={16} />}
                {uploadStatus.status === "error" && <XCircle size={16} />}
                {uploadStatus.message}
              </div>
            )}
          </div>

          {/* Name & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Type size={18} className="text-green-600"/> Item Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Samsung A12"
                className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-green-500 transition font-medium text-gray-800" />
            </div>

            <div>
              <label className="font-bold text-gray-700 mb-2 flex items-center gap-2"><DollarSign size={18} className="text-green-600"/> Price (KES)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="e.g. 8500"
                className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-green-500 transition font-medium text-gray-800" />
            </div>
          </div>

          {/* Seller Phone */}
          <div>
            <label className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Phone size={18} className="text-blue-600"/> Your Contact Phone</label>
            <input type="tel" name="sellerPhone" value={form.sellerPhone} onChange={handleChange} placeholder="e.g. 07XXXXXXXX"
              className="w-full bg-blue-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-blue-500 transition font-medium text-blue-800" />
          </div>

          {/* Category */}
          <div>
            <label className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Tag size={18} className="text-green-600"/> Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div key={cat} onClick={() => setForm(prev => ({...prev, category: cat}))}
                  className={`cursor-pointer p-3 rounded-xl text-center text-sm font-bold transition border ${
                    form.category === cat 
                      ? "bg-green-700 text-white border-green-700 shadow-md transform scale-105"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
                  }`}>
                    {cat}
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="font-bold text-gray-700 mb-2 flex items-center gap-2"><MapPin size={18} className="text-green-600"/> Pickup Location / Hostel</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Ndagani, Everest Hostel"
              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-green-500 transition font-medium text-gray-800" />
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-gray-700 mb-2 block">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Any faults? How long was it used?"
              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-green-500 transition font-medium text-gray-800 resize-none" />
          </div>

          {/* Submit */}
          <button type="submit" disabled={isSubmitting} 
            className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-2xl text-xl font-bold shadow-lg shadow-green-200 transition transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3">
              {isSubmitting ? "Posting..." : "Post Item 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
