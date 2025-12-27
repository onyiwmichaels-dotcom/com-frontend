import { useState } from "react";
import "./entry.css";

const DELIVERY_AREAS = [
  "Njaka",
  "Chuka Town",
  "Ndagani",
  "Shule",
  "Mungoni",
  "Lowlands",
  "Slaughter",
  "Juveras",
  "Royals",
  "Other"
];

export default function EntryPage({ onEnter }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !area) return alert("Please fill all fields");

    onEnter({
      name,
      phone,
      area
    });
  };

  return (
    <div className="entry-wrapper">
      <div className="entry-card">
        <h1 className="title">Chuka Online Market (COM)</h1>
        <p className="subtitle">Your trusted Online seller/buyer</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />

          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input"
          />

          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="input"
          >
            <option value="">Select Delivery Area</option>
            {DELIVERY_AREAS.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>

          <button className="enter-btn">ENTER MARKET</button>
        </form>
      </div>
    </div>
  );
}
