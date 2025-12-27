import { useState } from "react";
import "./admin.css";

export default function AdminProductForm({ onAdd }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [image, setImage] = useState("");

  const newSubcategories = ["tvs", "fashion", "phones", "home", "academic", "appliances"];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !category || !subcategory || !image) {
      return alert("Fill all fields");
    }

    onAdd({
      id: Date.now(),
      name,
      category,
      subcategory,
      image
    });

    setName("");
    setCategory("");
    setSubcategory("");
    setImage("");
  };

  return (
    <div className="admin-form">
      <h3 className="admin-subtitle">Add New Product</h3>

      <form onSubmit={handleSubmit}>
        <input
          className="admin-input"
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="admin-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="new">New Product</option>
          <option value="second-hand">Second-Hand</option>
        </select>

        <select
          className="admin-input"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
        >
          <option value="">Select Subcategory</option>
          {newSubcategories.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <input type="file" className="admin-input" onChange={handleImageUpload} />

        {image && <img src={image} alt="" className="preview-img" />}

        <button className="admin-btn">Add Product</button>
      </form>
    </div>
  );
}
