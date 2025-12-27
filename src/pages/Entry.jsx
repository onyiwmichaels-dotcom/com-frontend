import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LOCATIONS = [
  "Njaka",
  "ChukaTown",
  "Ndagani",
  "Shule",
  "Mungoni",
  "Lowlands",
  "Slaughter",
  "Juveras",
  "Royals",
  "Other",
];

export default function Entry() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const enterMarket = () => {
    if (!name.trim() || !phone.trim()) {
      alert("Please enter your name and phone number.");
      return;
    }

    // Save user info locally
    localStorage.setItem("comUser", JSON.stringify({ name, phone, location }));

    navigate("/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl text-white font-bold mb-6 text-center">
          Welcome to Chuka Online Market
        </h1>

        <label className="text-gray-300">Your Name</label>
        <input
          type="text"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          placeholder="Enter name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="text-gray-300">Phone Number</label>
        <input
          type="text"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          placeholder="07xx xxx xxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="text-gray-300">Delivery Area (Optional)</label>
        <select
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">Choose location</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <button
          onClick={enterMarket}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg font-bold"
        >
          Enter Market
        </button>
      </div>
    </div>
  );
}
