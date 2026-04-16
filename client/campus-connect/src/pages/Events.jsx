import { useEffect, useState } from "react";
import axios from "axios";

export default function Events() {
  const [events, setEvents] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://192.168.29.72:5000/api/app/events");
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FIXED API
  const joinEvent = async (id) => {
    try {
      await axios.post("http://192.168.29.72:5000/api/app/register-event", {
        userId: user.id,
        eventId: id,
      });

      alert("🎉 Registered Successfully!");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-4 space-y-4 pb-20">
      <h1 className="text-xl font-bold">Events 🎯</h1>

      {events.length === 0 ? (
        <p className="text-gray-500">No events available</p>
      ) : (
        events.map((e) => (
          <div key={e.id} className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">{e.title}</h2>
            <p className="text-gray-600">{e.description}</p>
            <p className="mt-1">🏆 Points: {e.points}</p>

            <button
              onClick={() => joinEvent(e.id)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
              Register Event
            </button>
          </div>
        ))
      )}
    </div>
  );
}