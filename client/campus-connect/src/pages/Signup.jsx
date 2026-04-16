import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const isMobileApp = window.Capacitor !== undefined;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "student",
  });

  const [captcha, setCaptcha] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isMobileApp && !captcha) {
      setError("Please complete captcha");
      return;
    }

    try {
      await axios.post("http://192.168.29.72:5000/api/auth/signup", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
        captcha: captcha || "mobile-bypass"
      });

      setMessage("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">

        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Create Account 🚀
        </h2>

        {message && <p className="text-green-300 text-center mb-3">{message}</p>}
        {error && <p className="text-red-300 text-center mb-3">{error}</p>}

        <div className="space-y-3">

          <input className="input" name="fullName" placeholder="Full Name" onChange={handleChange} />
          <input className="input" name="email" placeholder="Email" onChange={handleChange} />
          <input className="input" name="phone" placeholder="Phone Number" onChange={handleChange} />

          <select name="role" onChange={handleChange} className="input">
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
          </select>

          <input className="input" type="password" name="password" placeholder="Password" onChange={handleChange} />
          <input className="input" type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />

          {/* ✅ Show captcha ONLY in web */}
          {!isMobileApp && (
            <ReCAPTCHA
              sitekey="6Ldq9rgsAAAAALvm34GVkMbm-IN3DRMre1JS-YS8"
              onChange={(value) => setCaptcha(value)}
            />
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-white text-purple-700 font-bold py-2 rounded-xl hover:scale-105 transition"
          >
            Sign Up
          </button>

          {/* 🔥 Switch to Login */}
          <p className="text-center text-white mt-3">
            Already have an account?{" "}
            <span
              className="underline cursor-pointer font-bold"
              onClick={() => navigate("/login")}
            >
              Login
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

        select.input option {
          color: black;
        }
      `}</style>

    </div>
  );
}