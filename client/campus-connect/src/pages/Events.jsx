import { useEffect, useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchEvents();
    fetchAttendance();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/app/events");
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await API.get(`/app/user/${user.id}/attendance`);
      setAttendance(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const isAttended = (title) =>
    attendance.some((a) => a.title === title && a.verified === 1);

  return (
    <div className="p-4 space-y-4 pb-20">

      <h1 className="text-2xl font-bold">Events 🎯</h1>

      {events.length === 0 ? (
        <p className="text-gray-400 text-sm">No events available</p>
      ) : (
        events.map((e) => (
          <div key={e.id} className="card space-y-2">

            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{e.title}</h2>
              <span className="text-xs text-gray-500">{e.eventDate}</span>
            </div>

            <p className="text-sm text-gray-500 line-clamp-2">
              {e.description}
            </p>

            {isAttended(e.title) && (
              <span className="text-green-600 text-xs font-medium">
                ✅ Attended
              </span>
            )}

            <button
              onClick={() => navigate(`/dashboard/events/${e.id}`)}
              className="btn"
            >
              View Details
            </button>

          </div>
        ))
      )}

      <style>{`
        .card {
          background: white;
          padding: 14px;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .btn {
          width: 100%;
          background: #2563eb;
          color: white;
          padding: 10px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>

    </div>
  );
}