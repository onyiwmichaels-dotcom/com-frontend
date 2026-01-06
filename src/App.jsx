import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";

import Entry from "./pages/Entry";
import Home from "./pages/Home";
import Products from "./pages/Products"; // ✅ IMPORT THE NEW MASTER PAGE
import SellItem from "./pages/SellItem";

// Removed NewProducts, SecondHand, and ProductDetails (No longer needed)

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Support from "./pages/Support";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entry" element={<Entry />} />

        {/* ✅ NEW UNIVERSAL SHOP ROUTE */}
        {/* This handles New, Second-Hand, Categories, and Search */}
        <Route path="/shop" element={<Products />} />

        <Route path="/sell-item" element={<SellItem />} />

        {/* REMOVED: /new-products, /second-hand, and /product/:id */}
        {/* Product details are now shown in a Modal inside /shop */}

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/support" element={<Support />} />
      </Routes>

      <Analytics />
    </div>
  );
}

export default App;