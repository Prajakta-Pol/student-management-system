import { Outlet, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b shadow-sm">

        <h1 className="text-lg font-semibold text-gray-800">
          Campus Connect
        </h1>

        <div className="flex items-center gap-3">

          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
            {user?.name?.[0] || "U"}
          </div>

          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-600 hover:text-red-500"
          >
            Logout
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>

      {/* BOTTOM NAV */}
      <div className="bg-white border-t shadow-sm">
        <div className="flex justify-around py-2 text-xs text-gray-600">

          <button onClick={() => navigate("/dashboard/home")} className="navItem">
            <span className="text-lg">🏠</span>
            <span>Home</span>
          </button>

          <button onClick={() => navigate("/dashboard/events")} className="navItem">
            <span className="text-lg">📅</span>
            <span>Events</span>
          </button>

          <button onClick={() => navigate("/dashboard/collaborate")} className="navItem">
            <span className="text-lg">👥</span>
            <span>Collab</span>
          </button>

          <button onClick={() => navigate("/dashboard/resume")} className="navItem">
            <span className="text-lg">📄</span>
            <span>Resume</span>
          </button>

          <button onClick={() => navigate("/dashboard/profile")} className="navItem">
            <span className="text-lg">👤</span>
            <span>Profile</span>
          </button>

        </div>
      </div>

      <style>{`
        .navItem {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-weight: 500;
        }
      `}</style>

    </div>
  );
}