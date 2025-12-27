import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = {
  "TVs & Audio": "tvs",
  "Appliances": "appliances",
  "Fashion": "fashion",
  "Phones": "phones",
  "Home": "home",
  "Academic Materials": "academic"
};

export default function AddProduct() {
  const navigate = useNavigate();

  const [type, setType] = useState("new");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const submitProduct = async () => {
    if (!name || !price || !category || !image)
      return alert("Please fill all fields");

    const product = {
      id: Date.now(),
      type,
      category,
      name,
      price,
      imageURL: URL.createObjectURL(image)
    };

    const existing = JSON.parse(localStorage.getItem("products")) || [];
    existing.push(product);

    localStorage.setItem("products", JSON.stringify(existing));
    alert("Product added!");
    navigate("/admin/products");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      <label>Product Type</label>
      <select
        className="w-full p-3 rounded bg-gray-800 mb-4"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="new">New Product</option>
        <option value="second-hand">Second Hand</option>
      </select>

      <label>Category</label>
      <select
        className="w-full p-3 rounded bg-gray-800 mb-4"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {Object.keys(categories).map((c) => (
          <option key={c} value={categories[c]}>{c}</option>
        ))}
      </select>

      <input
        className="w-full p-3 rounded bg-gray-800 mb-4"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full p-3 rounded bg-gray-800 mb-4"
        placeholder="Price (Ksh)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="file"
        className="mb-6"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button
        onClick={submitProduct}
        className="bg-green-600 p-4 rounded-xl font-bold w-full"
      >
        Add Product
      </button>
    </div>
  );
}
