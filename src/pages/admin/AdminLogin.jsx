import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, KeyRound } from "lucide-react";
// Import the helper instead of the raw URL to prevent path errors
import { apiPost } from "../../config/api"; 

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      /**
       * We use the apiPost helper. 
       * 1. It automatically adds "/api" to the base URL.
       * 2. It sends the request to the endpoint "/auth/login".
       * 3. It maps the input 'password' to the expected 'pin' key for the backend.
       */
      const data = await apiPost("/auth/login", { pin: password });

      // If apiPost doesn't throw an error, it means the response was ok and JSON was parsed
      if (data.success) {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin/dashboard");
      } else {
        setError(data.error || "Invalid PIN. Try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      // If the error message is the HTML 404 from earlier, we give a friendly message
      setError(err.message.includes("<!DOCTYPE") 
        ? "Server configuration error (404). Contact support." 
        : "Server connection failed. Check your internet or if the backend is awake.");
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
          className="w-full p-4 border border-gray-300 rounded-xl mb-6 text-gray-800 focus:ring-2 focus:ring-green-500 transition outline-none"
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