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
      const res = await axios.post("http://10.210.127.194:5000/api/auth/login", {
        email: data.email,
        password: data.password,
        captcha: captcha || "mobile-bypass",
      });

      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "mentor") navigate("/mentor");
      else navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">

        <div className="text-center mb-6">
          <div className="text-3xl">🎓</div>
          <h2 className="text-2xl font-bold mt-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">
            Sign in to your Student Lifecycle account
          </p>
        </div>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

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
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-blue-600 font-semibold cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ddd;
          outline: none;
          font-size: 14px;
        }

        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.1);
        }
      `}</style>
    </div>
  );
}