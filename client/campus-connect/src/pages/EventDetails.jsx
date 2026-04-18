import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [event, setEvent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        if (!user?.id) return;

        const res = await API.get("/app/events");
        const found = res.data.find((e) => String(e.id) === String(id));

        if (!found) return;

        setEvent(found);

        const att = await API.get(`/app/user/${user.id}/attendance`);
        setAttendance(att.data);

      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, [id, user?.id]);

  const isAttended = attendance.some(
    (a) => a.title === event?.title && a.verified === 1
  );

  const isRegistered = attendance.some(
    (a) => a.title === event?.title
  );

  const register = async () => {
    try {
      setError("");
      setMessage("");

      await API.post("/app/register-event", {
        userId: user.id,
        eventId: event.id
      });

      setMessage("🎉 Registered successfully!");

      setAttendance((prev) => [
        ...prev,
        { title: event.title, verified: 0 }
      ]);

      setTimeout(() => {
        navigate("/dashboard/scan");
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed ❌");
    }
  };

  if (!event) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 space-y-4 pb-20">

      <h1 className="text-xl font-bold">{event.title}</h1>

      {/* STATUS */}
      {message && (
        <div className="success">{message}</div>
      )}

      {error && (
        <div className="error">{error}</div>
      )}

      {/* EVENT DETAILS */}
      <div className="card space-y-2">
        <p className="text-sm text-gray-600">{event.description}</p>

        <p className="text-sm">📍 {event.location}</p>
        <p className="text-sm">📅 {event.eventDate}</p>
        <p className="text-sm">🏆 {event.points} points</p>

        {event.message && (
          <p className="text-blue-600 text-sm">{event.message}</p>
        )}

        {event.registrationLink && (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 text-sm underline"
          >
            Open Registration Form
          </a>
        )}
      </div>

      {/* BUTTON LOGIC */}
      {isAttended ? (
        <button className="btn-disabled">
          ✅ Attended
        </button>
      ) : isRegistered ? (
        <button
          onClick={() => navigate("/dashboard/scan")}
          className="btn-primary"
        >
          Scan QR
        </button>
      ) : (
        <button
          onClick={register}
          className="btn-success"
        >
          Register
        </button>
      )}

      <style>{`
        .card {
          background: white;
          padding: 14px;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .btn-primary {
          width: 100%;
          background: #4f46e5;
          color: white;
          padding: 12px;
          border-radius: 10px;
          font-weight: 600;
        }

        .btn-success {
          width: 100%;
          background: #16a34a;
          color: white;
          padding: 12px;
          border-radius: 10px;
          font-weight: 600;
        }

        .btn-disabled {
          width: 100%;
          background: #9ca3af;
          color: white;
          padding: 12px;
          border-radius: 10px;
        }

        .success {
          background: #dcfce7;
          color: #166534;
          padding: 10px;
          border-radius: 10px;
          font-size: 14px;
        }

        .error {
          background: #fee2e2;
          color: #991b1b;
          padding: 10px;
          border-radius: 10px;
          font-size: 14px;
        }
      `}</style>

    </div>
  );
}