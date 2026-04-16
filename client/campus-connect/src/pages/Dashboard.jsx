import { Outlet, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* SCREEN CONTENT */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>

      {/* BOTTOM NAV */}
      <BottomNav navigate={navigate} />
    </div>
  );
}