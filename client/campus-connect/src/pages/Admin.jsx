import { useState } from "react";
import axios from "axios";

export default function Admin() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    organizer: "",
    location: "",
    eventDate: "",
    points: 0,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createEvent = async () => {
    try {
      const res = await axios.post(
        "http://192.168.29.72:5000/api/app/admin/create-event",
        form
      );

      alert("Event Created!\nQR Token: " + res.data.qrToken);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-4 space-y-3">

      <h1 className="text-xl font-bold">Admin Panel 🎯</h1>

      <input className="input" name="title" placeholder="Title" onChange={handleChange} />
      <input className="input" name="description" placeholder="Description" onChange={handleChange} />
      <input className="input" name="organizer" placeholder="Organizer" onChange={handleChange} />
      <input className="input" name="location" placeholder="Location" onChange={handleChange} />
      <input className="input" name="eventDate" placeholder="Date" onChange={handleChange} />
      <input className="input" name="points" placeholder="Points" onChange={handleChange} />

      <button
        onClick={createEvent}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Create Event
      </button>

      <style>{`
        .input {
          width: 100%;
          padding: 10px;
          margin-top: 8px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
      `}</style>
    </div>
  );
}