import { useNavigate } from "react-router-dom";

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="h-screen relative">

      {/* BACKGROUND IMAGE */}
      <img
        src="/image.png"   // 👉 put your image in public folder
        alt="campus"
        className="absolute w-full h-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute w-full h-full bg-black/60"></div>

      {/* CONTENT */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-6 text-center">

        <h1 className="text-4xl font-bold mb-4">
          StudentLife 🎓
        </h1>

        <p className="max-w-md text-gray-200 mb-6">
          Enter a smarter campus experience.  
          Track your growth, connect with peers, and unlock opportunities.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-white px-6 py-2 rounded-lg"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}