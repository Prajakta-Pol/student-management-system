import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [captcha, setCaptcha] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isMobileApp = window.Capacitor !== undefined;

  const handleLogin = async () => {
    setError("");

    if (!data.email || !data.password) {
      setError("Please fill all fields");
      return;
    }

    if (!isMobileApp && !captcha) {
      setError("Please complete captcha");
      return;
    }

    try {
      const res = await axios.post("http://192.168.29.72:5000/api/auth/login", {
        email: data.email,
        password: data.password,
        captcha: captcha || "mobile-bypass"
      });

      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "mentor") navigate("/mentor");
      else navigate("/dashboard");

    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Welcome Back 👋
        </h2>

        {error && <p className="text-red-300 text-center mb-3">{error}</p>}

        <div className="space-y-4">

          <input
            className="input"
            placeholder="Email"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />

          {/* ✅ Show captcha ONLY in web */}
          {!isMobileApp && (
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6Ldq9rgsAAAAALvm34GVkMbm-IN3DRMre1JS-YS8"
                onChange={(value) => setCaptcha(value)}
              />
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-white text-indigo-700 font-bold py-2 rounded-xl hover:scale-105 transition"
          >
            Login
          </button>

          {/* 🔥 Switch to Signup */}
          <p className="text-center text-white mt-3">
            Don't have an account?{" "}
            <span
              className="underline cursor-pointer font-bold"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>

        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.15);
          color: white;
          outline: none;
        }

        .input::placeholder {
          color: rgba(255,255,255,0.7);
        }
      `}</style>

    </div>
  );
}