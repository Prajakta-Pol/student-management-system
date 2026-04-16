import { Home, Users, Calendar, FileText, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: "Home", icon: Home, path: "/dashboard/home" },
    { name: "Collaborate", icon: Users, path: "/dashboard/collaborate" },
    { name: "Events", icon: Calendar, path: "/dashboard/events" },
    { name: "Resume", icon: FileText, path: "/dashboard/resume" },
    { name: "Profile", icon: User, path: "/dashboard/profile" },
  ];

  return (
    <div className="flex justify-around items-center bg-white shadow-lg border-t py-3 fixed bottom-0 w-full">

      {tabs.map((tab, i) => {
        const Icon = tab.icon;
        const active = location.pathname === tab.path;

        return (
          <button
            key={i}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center text-xs transition ${
              active ? "text-indigo-600 scale-110" : "text-gray-500"
            }`}
          >
            <Icon size={20} />
            <span>{tab.name}</span>
          </button>
        );
      })}

    </div>
  );
}