import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PopupForm from "../../components/PopupForm.jsx";
import { LogOut, Package, ListOrdered, PlusCircle, Trash2, Edit, X, UploadCloud, Tag, CheckCircle, Clock, ShoppingBag, Phone } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

export default function AdminDashboard() {
    const navigate = useNavigate();

    // ------------------ SECURITY & LOGOUT ------------------
    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin");
        if (isAdmin !== "true") navigate("/admin/login");
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        navigate("/admin/login");
    };

    // ------------------ STATES ------------------
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('inventory');

    const [stats, setStats] = useState({
        totalOrders: 0,
        activeInventory: 0,
        pendingRequests: 0
    });

    const API = `${API_BASE_URL}/api`;
    const BASE_URL = API_BASE_URL;

    // ------------------ DATA FETCHING ------------------

    const fetchProducts = useCallback(async () => {
        try {
            // Fetches all products so we can filter them into 'approved' and 'pending' in the UI
            const res = await fetch(`${API}/admin/products`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            }
        } catch (err) {
            console.error("❌ Failed to fetch products", err);
        }
    }, [API]);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await fetch(`${API}/admin/orders`);
            const data = await res.json();
            if (Array.isArray(data)) setOrders(data);
        } catch (err) {
            console.error("❌ Failed to fetch orders", err);
        }
    }, [API]);

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`${API}/admin/stats`);
            const data = await res.json();
            if (data) setStats(data);
        } catch (err) {
            console.error("❌ Failed to fetch admin stats", err);
        }
    }, [API]);

    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchStats();

        const intervalId = setInterval(() => {
            fetchProducts();
            fetchOrders();
            fetchStats();
        }, 20000);

        return () => clearInterval(intervalId);
    }, [fetchProducts, fetchOrders, fetchStats]);

    // ------------------ FILTERING ------------------
    const approvedProducts = products.filter(p => p.status === 'approved');
    const pendingProducts = products.filter(p => p.status === 'pending');
    const displayedProducts = activeTab === 'inbox' ? pendingProducts : approvedProducts;

    // ------------------ HELPERS ------------------
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://placehold.co/160x160/f3f4f6/a1a1aa?text=No+Image";
        if (imagePath.startsWith("http")) return imagePath;
        return `${BASE_URL}${imagePath}`;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-KE', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // ------------------ CRUD & APPROVAL LOGIC ------------------

    const handleApprove = async (product) => {
        if (!window.confirm(`Approve "${product.name}" for the public shop?`)) return;

        try {
            const res = await fetch(`${API}/admin/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...product, 
                    status: 'approved' // Flip status to approved
                })
            });

            if (res.ok) {
                alert("Product is now live!");
                fetchProducts();
                fetchStats();
            }
        } catch (err) {
            console.error("Approval failed", err);
        }
    };

    const saveProduct = async (data) => {
        try {
            const method = editProduct ? "PUT" : "POST";
            const url = editProduct
                ? `${API}/admin/products/${editProduct.id}`
                : `${API}/admin/products`;

            // Admin-added items should be approved immediately
            const finalData = { ...data, status: 'approved' };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalData),
            });

            if (res.ok) {
                setShowPopup(false);
                setEditProduct(null);
                fetchProducts();
                fetchStats();
            }
        } catch (err) {
            console.error("❌ Save error:", err);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await fetch(`${API}/admin/products/${id}`, { method: "DELETE" });
            fetchProducts();
            fetchStats();
        } catch (err) {
            console.error("❌ Delete error", err);
        }
    };

    // ------------------ UI COMPONENTS ------------------

    const TabButton = ({ tabName, count, icon, currentActive }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center gap-2 p-3 text-lg font-bold transition duration-300 rounded-t-lg
                ${currentActive === tabName ? 'bg-white text-green-700 border-b-4 border-green-700' : 'text-gray-500 hover:text-green-700'}`}
        >
            {icon}
            {tabName === 'inbox' ? 'Submission Inbox' : 'Active Inventory'}
            <span className={`px-2 py-0.5 rounded-full text-sm font-semibold ${count > 0 && tabName === 'inbox' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                {count}
            </span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {/* Header */}
            <div className="bg-white shadow-md p-5 flex justify-between items-center border-b border-gray-200 sticky top-0 z-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">COM Admin Panel</h1>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition flex items-center gap-2">
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div className="p-6 max-w-7xl mx-auto">
                {/* Stats Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-green-100 p-6 rounded-xl shadow-lg flex items-center justify-between border-l-4 border-green-600">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 uppercase">Total Orders</p>
                            <p className="text-3xl font-bold text-green-700 mt-1">{stats.totalOrders}</p>
                        </div>
                        <ListOrdered size={40} className="text-green-600 opacity-50"/>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between border-l-4 border-gray-400">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 uppercase">Active Inventory</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.activeInventory}</p>
                        </div>
                        <Package size={40} className="text-gray-500 opacity-50"/>
                    </div>
                    <div className={`p-6 rounded-xl shadow-lg flex items-center justify-between border-l-4 ${stats.pendingRequests > 0 ? 'bg-red-100 border-red-600' : 'bg-white border-blue-400'}`}>
                        <div>
                            <p className="text-sm font-semibold text-gray-600 uppercase">Pending Requests</p>
                            <p className="text-3xl font-bold text-red-700 mt-1">{stats.pendingRequests}</p>
                        </div>
                        <Clock size={40} className="text-red-600 opacity-50"/>
                    </div>
                </div>

                {/* Product Management Section */}
                <div className="bg-white rounded-xl shadow-xl">
                    <div className="p-6 flex justify-between items-center border-b pb-4">
                        <h2 className="text-3xl font-bold text-green-700 flex items-center gap-2">
                            <ShoppingBag size={28} /> Product Management
                        </h2>
                        <button onClick={() => { setEditProduct(null); setShowPopup(true); }} className="bg-green-700 text-white px-5 py-2 rounded-xl shadow-md hover:bg-green-800 transition flex items-center gap-2 font-medium">
                            <PlusCircle size={20} /> Add Product
                        </button>
                    </div>

                    <div className="flex border-b border-gray-200 p-2 space-x-4 ml-4">
                        <TabButton tabName="inventory" count={approvedProducts.length} icon={<Package size={20} />} currentActive={activeTab} />
                        <TabButton tabName="inbox" count={pendingProducts.length} icon={<Clock size={20} />} currentActive={activeTab} />
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayedProducts.length === 0 ? (
                                <p className="col-span-full text-center text-gray-500 py-10">No products to show in this tab.</p>
                            ) : (
                                displayedProducts.map((p) => (
                                    <div key={p.id} className="bg-white p-4 shadow-lg rounded-lg border border-gray-100 flex flex-col hover:shadow-xl transition">
                                        <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${p.type === 'second-hand' ? 'bg-orange-500 text-white' : 'bg-green-600 text-white'}`}>
                                                {p.type}
                                            </span>
                                        </div>
                                        <p className="font-extrabold mt-3 text-2xl text-green-700">KES {p.price}</p>
                                        {activeTab === 'inbox' && (
        <div className="mt-3 text-sm text-gray-700 space-y-1 bg-gray-50 p-3 rounded-lg">
        <p><strong>Category:</strong> {p.category}</p>
        <p><strong>Pickup Location:</strong> {p.location}</p>
        <p className="text-gray-600"><strong>Description:</strong> {p.description}</p>
    </div>
)}

                                        <div className="flex items-center text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded-lg">
                                            <Phone size={14} className="text-blue-500 mr-2" />
                                            <span>
                                                Seller: {p.type === 'second-hand' ? p.sellerPhone : 'Admin'}
                                                </span>
                                        </div>
                                        <div className="flex gap-3 mt-4 pt-4 border-t">
                                            {activeTab === 'inbox' ? (
                                                <button onClick={() => handleApprove(p)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex-1 flex items-center justify-center gap-2 text-sm font-bold">
                                                    <CheckCircle size={16} /> Approve
                                                </button>
                                            ) : (
                                                <button onClick={() => { setEditProduct(p); setShowPopup(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex-1 flex items-center justify-center gap-2 text-sm font-bold">
                                                    <Edit size={16} /> Edit
                                                </button>
                                            )}
                                            <button onClick={() => deleteProduct(p.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex-1 flex items-center justify-center gap-2 text-sm font-bold">
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="mt-14 bg-white p-6 rounded-xl shadow-xl">
                    <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2 border-b pb-4">
                        <ListOrdered size={28} /> Customer Orders
                    </h2>
                    {orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left table-auto">
                                <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                                    <tr>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Phone</th>
                                        <th className="p-4">Product</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">location</th>
                                        <th className="p-4">price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((o) => (
                                        <tr key={o.id} className="border-b hover:bg-green-50">
                                            <td className="p-4 font-semibold">{o.customername}</td>
                                            <td className="p-4 text-green-700">{o.phone}</td>
                                            <td className="p-4">{o.productname}</td>
                                            <td className="p-4 text-xs">{formatDate(o.date)}</td>
                                            <td className="p-4">{o.location}</td>
                                            <td className="p-4">{o.productprice}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-center py-10">No orders found.</p>}
                </div>
            </div>

            {showPopup && (
                <PopupForm
                    initialData={editProduct}
                    onSave={saveProduct}
                    onClose={() => { setShowPopup(false); setEditProduct(null); }}
                />
            )}
        </div>
    );
}