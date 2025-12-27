import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, KeyRound } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ CRITICAL FIX: Ensure this matches your backend port (8080)
  // AND the correct route (/api/auth/login based on your server.js structure)
  const API_URL = "http://com-backend-d56z.onrender.com/api/auth/login"; 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // We send 'pin' because your authRoutes.js expects 'pin', NOT 'password'
    // based on the code you shared earlier: const { pin } = req.body;
    const credentials = {
        pin: password // Mapping the input 'password' to the expected 'pin' key
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        // Check content type to prevent crashing on non-JSON responses
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Received non-JSON response from server");
        }

        const data = await response.json();

        if (response.ok && data.success) {
            localStorage.setItem("isAdmin", "true");
            navigate("/admin/dashboard");
        } else {
            setError(data.error || "Invalid PIN. Try again.");
        }
    } catch (err) {
        console.error("Login error:", err);
        setError("Server connection failed. Is the backend running on port 8080?");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ fontFamily: 'Oswald, sans-serif' }}>
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-gray-200">
        <div className="text-center mb-6">
            <Lock size={48} className="text-green-700 mx-auto mb-2"/>
            <h2 className="text-3xl font-bold text-gray-900 tracking-wide">ADMIN ACCESS</h2>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm text-center">
                {error}
            </div>
        )}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Admin PIN"
          className="w-full p-4 border border-gray-300 rounded-xl mb-6 text-gray-800 focus:ring-2 focus:ring-green-500 transition"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-700 w-full p-4 rounded-xl text-white font-bold text-lg hover:bg-green-800 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
            {isLoading ? "Checking..." : <><KeyRound size={20}/> LOG IN</>}
        </button>
      </form>
    </div>
  );
}