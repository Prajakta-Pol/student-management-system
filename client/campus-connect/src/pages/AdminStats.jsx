import { useEffect, useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminStats() {
  const [data, setData] = useState({
    totalEvents: 0,
    events: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await API.get("/app/admin/stats");
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="p-4 space-y-4 pb-20 max-w-xl mx-auto">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Admin Analytics 📊</h1>
        <p className="text-gray-500 text-sm">
          Overview of created events
        </p>
      </div>

      {/* TOTAL EVENTS */}
      <div className="card text-center">
        <p className="text-gray-500">Total Events</p>
        <h2 className="text-3xl font-bold">{data.totalEvents}</h2>
      </div>

      {/* EVENTS LIST */}
      <div className="space-y-3">
        <h2 className="font-semibold">Created Events</h2>

        {data.events.length === 0 ? (
          <p className="text-gray-400 text-sm">No events created yet</p>
        ) : (
          data.events.map((e) => (
            <div key={e.id} className="card space-y-1">
              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-gray-500 text-sm">{e.eventDate}</p>
              <p className="text-xs text-gray-400">{e.location}</p>
            </div>
          ))
        )}
      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/admin")}
        className="btn"
      >
        Back to Admin
      </button>

      {/* STYLES */}
      <style>{`
        .card {
          background: white;
          padding: 16px;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .btn {
          width: 100%;
          background: #2563eb;
          color: white;
          padding: 12px;
          border-radius: 10px;
          font-weight: 600;
        }
      `}</style>

    </div>
  );
}