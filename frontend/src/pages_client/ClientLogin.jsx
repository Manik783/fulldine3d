import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/client/login`,
        { email, password }
      );

      if (response.status === 200) {
        alert("Login successful!");
        // Perform actions like saving the token or redirecting
        const rest_id = response.data.client.rest_id;

        localStorage.setItem("token", response.data.token);
        navigate(`/clientdashboard/${rest_id}`);
      } else {
        alert(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Client Log In
        </h2>
        <form className="mt-6" onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-gray-500">
          Log in as admin ?{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Admin panel
          </a>
        </p>
      </div>
    </div>
  );
};

export default ClientLogin;
