import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    points: 0,
    events: 0,
    certifications: 0,
    collaborations: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 FETCH DASHBOARD DATA
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `http://192.168.29.72:5000/api/app/dashboard/${user.id}`
        );

        console.log("DASHBOARD DATA:", res.data); // 🔥 DEBUG
        setStats(res.data);
      } catch (err) {
        console.log("Dashboard error:", err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="p-4 space-y-4">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <p className="text-gray-500 text-sm">
          Here's your progress overview
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 gap-3">

        <div className="card">
          <p className="text-gray-500 text-sm">Activity Points</p>
          <h2 className="text-xl font-bold">{stats.points}</h2>
        </div>

        <div className="card">
          <p className="text-gray-500 text-sm">Events Attended</p>
          <h2 className="text-xl font-bold">{stats.events}</h2>
        </div>

        <div className="card">
          <p className="text-gray-500 text-sm">Certifications</p>
          <h2 className="text-xl font-bold">{stats.certifications}</h2>
        </div>

        <div className="card">
          <p className="text-gray-500 text-sm">Collaborations</p>
          <h2 className="text-xl font-bold">{stats.collaborations}</h2>
        </div>

      </div>

      {/* PROFILE */}
      <div className="card">
        <p className="font-medium mb-2">Profile</p>

        <button
          onClick={() => navigate("/dashboard/profile")}
          className="text-blue-600 text-sm font-semibold"
        >
          Complete Profile →
        </button>
      </div>

      {/* STYLES */}
      <style>{`
        .card {
          background: white;
          padding: 14px;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}