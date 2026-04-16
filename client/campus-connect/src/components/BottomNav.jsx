import { Home, Calendar, Users, FileText, User } from "lucide-react";

export default function BottomNav({ navigate }) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-2 shadow-sm">

      <button onClick={() => navigate("/dashboard/home")} className="navItem">
        <Home size={20} />
        <span>Home</span>
      </button>

      <button onClick={() => navigate("/dashboard/events")} className="navItem">
        <Calendar size={20} />
        <span>Events</span>
      </button>

      <button onClick={() => navigate("/dashboard/collaborate")} className="navItem">
        <Users size={20} />
        <span>Collab</span>
      </button>

      <button onClick={() => navigate("/dashboard/resume")} className="navItem">
        <FileText size={20} />
        <span>Resume</span>
      </button>

      <button onClick={() => navigate("/dashboard/profile")} className="navItem">
        <User size={20} />
        <span>Profile</span>
      </button>

      <style>{`
        .navItem {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 11px;
          color: #555;
        }

        .navItem:active {
          color: #2563eb;
        }
      `}</style>
    </div>
  );
}