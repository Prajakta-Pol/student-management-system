import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";

export default function Home() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    points: 0,
    events: 0,
    certifications: 0,
    collaborations: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.id) return;

    const fetchDashboard = async () => {
      try {
        const res = await API.get(`/app/dashboard/${user.id}`);
        setStats(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 3000);

    return () => clearInterval(interval);

  }, [user?.id]);

  // 🔥 DUMMY DATA
  const recentActivity = [
    "Registered for Hackathon 2025",
    "Added React certification",
    "Mentor approved project submission",
    "Joined Web Dev collaboration team",
  ];

  const upcomingEvents = [
    { title: "AI Workshop", date: "Apr 20" },
    { title: "Resume Building Session", date: "Apr 22" },
    { title: "Industry Talk: Cloud Computing", date: "Apr 25" },
  ];

  return (
    <div className="p-4 space-y-5 pb-20">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <p className="text-gray-500 text-sm">
          Here's your progress overview
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3">

        <div className="card flex gap-3 items-center">
          <div className="icon">⭐</div>
          <div>
            <p className="text-gray-500 text-sm">Activity Points</p>
            <h2 className="text-xl font-bold">{stats.points}</h2>
          </div>
        </div>

        <div className="card flex gap-3 items-center">
          <div className="icon">📅</div>
          <div>
            <p className="text-gray-500 text-sm">Events Attended</p>
            <h2 className="text-xl font-bold">{stats.events}</h2>
          </div>
        </div>

        <div className="card flex gap-3 items-center">
          <div className="icon">🎓</div>
          <div>
            <p className="text-gray-500 text-sm">Certifications</p>
            <h2 className="text-xl font-bold">{stats.certifications}</h2>
          </div>
        </div>

        <div className="card flex gap-3 items-center">
          <div className="icon">👥</div>
          <div>
            <p className="text-gray-500 text-sm">Collaborations</p>
            <h2 className="text-xl font-bold">{stats.collaborations}</h2>
          </div>
        </div>

      </div>

      {/* PROFILE PROGRESS */}
      <div className="card">
        <div className="flex justify-between mb-2">
          <p className="text-sm font-medium">Profile Completion</p>
          <span className="text-sm text-blue-600 font-semibold">88%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full w-[88%]"></div>
        </div>

        <button
          onClick={() => navigate("/dashboard/profile")}
          className="mt-3 text-blue-600 text-sm font-semibold"
        >
          Complete Profile →
        </button>
      </div>

      {/* TWO SECTIONS */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* RECENT */}
        <div className="card">
          <h2 className="font-semibold mb-3">Recent Activity</h2>

          {recentActivity.map((a, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <span className="text-blue-500">•</span>
              <p className="text-sm text-gray-600">{a}</p>
            </div>
          ))}
        </div>

        {/* UPCOMING */}
        <div className="card">
          <h2 className="font-semibold mb-3">Upcoming Events</h2>

          {upcomingEvents.map((e, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg mb-2">
              <div>
                <p className="text-sm font-medium">{e.title}</p>
                <p className="text-xs text-gray-500">{e.date}</p>
              </div>

              {/* 🔥 UPDATED BUTTON */}
              <button
                onClick={() => navigate("/dashboard/events")}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded"
              >
                Register
              </button>

            </div>
          ))}
        </div>

      </div>

      {/* STYLES */}
      <style>{`
        .card {
          background: white;
          padding: 14px;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
      `}</style>

    </div>
  );
}