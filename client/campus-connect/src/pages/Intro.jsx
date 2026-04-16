import { useNavigate } from "react-router-dom";

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <h1 className="text-3xl font-bold mb-4">Campus Growth 🚀</h1>
      <p className="mb-6 text-center px-6">
        Track your journey. Build your resume. Find your team.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-black px-6 py-2 rounded-xl"
        >
          Sign Up
        </button>

        <button
          onClick={() => navigate("/login")}
          className="border px-6 py-2 rounded-xl"
        >
          Login
        </button>
      </div>
    </div>
  );
}