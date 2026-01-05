import { useState, useEffect } from "react";
import {
  PackagePlus,
  Edit,
  X,
  UploadCloud,
  CheckCircle,
  XCircle,
  Phone
} from "lucide-react";
import { API_BASE_URL } from "../config/api";

export default function PopupForm({ onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    description: "",
    image: "",          // base64 OR URL (edit mode)
    type: "new",
    category: "Phones",
    sellerPhone: ""
  });

  const [uploadStatus, setUploadStatus] = useState({
    status: "idle",
    message: ""
  });

  const categories = [
    "TVs & Audio",
    "Appliances",
    "Fashion",
    "Academics",
    "Phones",
    "Home",
    "Other"
  ];

  // -------------------------------------------------------
  // LOAD EDIT DATA
  // -------------------------------------------------------
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
        sellerPhone: initialData.sellerPhone || ""
      }));
    }
  }, [initialData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // -------------------------------------------------------
  // BASE64 IMAGE HANDLING (SUPABASE READY)
  // -------------------------------------------------------
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadStatus({
        status: "loading",
        message: "Processing image..."
      });

      const base64 = await fileToBase64(file);

      setForm((prev) => ({
        ...prev,
        image: base64
      }));

      setUploadStatus({
        status: "success",
        message: "Image ready for upload ✅"
      });
    } catch (err) {
      console.error(err);
      setUploadStatus({
        status: "error",
        message: "Failed to process image ❌"
      });
    }
  };

  // -------------------------------------------------------
  // SUBMIT
  // -------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.image || !form.sellerPhone) {
      setUploadStatus({
        status: "error",
        message: "Name, price, image, and seller phone are required."
      });
      return;
    }

    onSave({
      ...form,
      price: parseFloat(form.price),
      isAdmin: true
    });
  };

  const statusColor = {
    idle: "text-gray-500",
    loading: "text-blue-500 animate-pulse",
    success: "text-green-600",
    error: "text-red-600"
  }[uploadStatus.status];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ fontFamily: "Oswald, sans-serif" }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-3xl font-bold text-green-700 flex items-center gap-3">
            {form.id ? (
              <>
                <Edit size={28} /> Edit Product
              </>
            ) : (
              <>
                <PackagePlus size={28} /> New Product
              </>
            )}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product name"
            className="w-full p-3 border rounded-xl"
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-3 border rounded-xl"
          />

          <div className="relative">
            <Phone
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              name="sellerPhone"
              value={form.sellerPhone}
              onChange={handleChange}
              placeholder="Seller phone number"
              className="w-full p-3 pl-10 border rounded-xl"
            />
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows="3"
            className="w-full p-3 border rounded-xl"
          />

          <div className="flex gap-4">
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="p-3 border rounded-xl flex-1"
            >
              <option value="new">🌟 New Item</option>
              <option value="second-hand">♻️ Second-Hand</option>
            </select>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="p-3 border rounded-xl flex-1"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* IMAGE */}
          <div className="border p-4 rounded-xl bg-gray-50 space-y-2">
            <label className="font-semibold flex items-center gap-2">
              <UploadCloud size={20} /> Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full"
            />

            {uploadStatus.message && (
              <div className="flex items-center gap-2 text-sm">
                {uploadStatus.status === "success" ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-red-600" />
                )}
                <span className={statusColor}>
                  {uploadStatus.message}
                </span>
              </div>
            )}

            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-700 text-white rounded-xl"
            >
              {form.id ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
