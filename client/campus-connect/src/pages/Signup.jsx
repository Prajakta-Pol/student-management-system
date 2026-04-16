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
        captcha: captcha || "mobile-bypass",
      });

      setMessage("Account created successfully!");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">

        <div className="text-center mb-6">
          <div className="text-3xl">🎓</div>
          <h2 className="text-2xl font-bold mt-2">Create Account</h2>
          <p className="text-gray-500 text-sm">
            Sign up to your Student Lifecycle account
          </p>
        </div>

        {message && <p className="text-green-600 text-center mb-3">{message}</p>}
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <div className="space-y-4">

          <input className="input" name="fullName" placeholder="Full Name" onChange={handleChange} />
          <input className="input" name="email" placeholder="Email" onChange={handleChange} />
          <input className="input" name="phone" placeholder="Phone Number" onChange={handleChange} />

          <select name="role" onChange={handleChange} className="input">
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
          </select>

          <input className="input" type="password" name="password" placeholder="Password" onChange={handleChange} />
          <input className="input" type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />

          {!isMobileApp && (
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6Ldq9rgsAAAAALvm34GVkMbm-IN3DRMre1JS-YS8"
                onChange={(value) => setCaptcha(value)}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-blue-600 font-semibold cursor-pointer"
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