import { useState, useRef } from "react";
import { API } from "../api";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const qrRef = useRef();

  const [form, setForm] = useState({
    title: "",
    description: "",
    organizer: "",
    location: "",
    eventDate: "",
    points: "",
    registrationLink: "",
    message: ""
  });

  const [qrData, setQrData] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const createEvent = async () => {
    try {
      const res = await API.post("/app/admin/create-event", form);

      const data = {
        eventId: res.data.eventId,
        qrToken: res.data.qrToken
      };

      setQrData(JSON.stringify(data));
      setSuccess("🎉 Event created successfully!");

    } catch (err) {
      setError("❌ Failed to create event");
    }
  };

  // ✅ DOWNLOAD QR
  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = url;
    a.download = "event-qr.png";
    a.click();
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto pb-20">

      {/* HEADER (CLICK = LOGOUT) */}
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/login")}
      >
        Admin Dashboard 🎯
      </h1>

      {/* NAV BUTTON */}
      <button
        onClick={() => navigate("/admin/stats")}
        className="btn-secondary"
      >
        View Analytics 📊
      </button>

      {/* STATUS */}
      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}

      {/* FORM */}
      <div className="card space-y-3">

        <input name="title" placeholder="Event Title" onChange={handleChange} className="input" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="input" />
        <input name="organizer" placeholder="Organizer" onChange={handleChange} className="input" />
        <input name="location" placeholder="Venue" onChange={handleChange} className="input" />
        <input name="eventDate" placeholder="Date" onChange={handleChange} className="input" />
        <input name="points" placeholder="Points" onChange={handleChange} className="input" />
        <input name="registrationLink" placeholder="Registration Link" onChange={handleChange} className="input" />
        <textarea name="message" placeholder="Exciting Message" onChange={handleChange} className="input" />

        <button onClick={createEvent} className="btn">
          Create Event
        </button>
      </div>

      {/* QR */}
      {qrData && (
        <div className="card text-center space-y-3" ref={qrRef}>
          <h2 className="font-semibold">Event QR</h2>

          <div className="flex justify-center bg-white p-3 rounded">
            <QRCodeCanvas value={qrData} size={200} />
          </div>

          <button onClick={downloadQR} className="btn">
            Download QR
          </button>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        .card {
          background: white;
          padding: 16px;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 10px;
        }

        .btn {
          background: #2563eb;
          color: white;
          padding: 12px;
          border-radius: 10px;
          width: 100%;
        }

        .btn-secondary {
          background: #111827;
          color: white;
          padding: 10px;
          border-radius: 10px;
          width: 100%;
        }

        .success {
          background: #dcfce7;
          color: #166534;
          padding: 10px;
          border-radius: 10px;
        }

        .error {
          background: #fee2e2;
          color: #991b1b;
          padding: 10px;
          border-radius: 10px;
        }
      `}</style>

    </div>
  );
}