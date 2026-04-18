import { useEffect, useState } from "react";
import { API } from "../api";

export default function Collaborate() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    eventTitle: "",
    eventDescription: "",
    eventLink: "",
    totalMembers: "",
    currentMembers: "",
    requiredMembers: "",
    requiredSkills: "",
    email: "",
    linkedin: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 🔥 FETCH ALL TEAMS
  // =========================
  const fetchPosts = async () => {
    try {
      const res = await API.get("/app/team");
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // =========================
  // ✅ CREATE TEAM
  // =========================
  const createPost = async () => {
    setMessage("");
    setError("");

    if (!form.eventTitle || !form.requiredSkills || !form.email) {
      setError("Please fill required fields ❌");
      return;
    }

    try {
      await API.post("/app/team/create", {
        creatorId: user.id,
        eventTitle: form.eventTitle,
        eventDescription: form.eventDescription || "",
        eventLink: form.eventLink || "",
        totalMembers: Number(form.totalMembers) || 0,
        currentMembers: Number(form.currentMembers) || 0,
        requiredMembers: Number(form.requiredMembers) || 0,
        requiredSkills: form.requiredSkills,
        email: form.email,
        linkedin: form.linkedin || ""
      });

      setMessage("🎉 Team created successfully!");

      setForm({
        eventTitle: "",
        eventDescription: "",
        eventLink: "",
        totalMembers: "",
        currentMembers: "",
        requiredMembers: "",
        requiredSkills: "",
        email: "",
        linkedin: ""
      });

      fetchPosts();

    } catch (err) {
      setError(err.response?.data?.error || "Failed to create team ❌");
    }
  };

  // =========================
  // 🔥 JOIN TEAM
  // =========================
  const joinTeam = async (teamId) => {
    setMessage("");
    setError("");

    try {
      await API.post("/app/team/join", {
        teamId,
        userId: user.id,
        message: "Interested to join"
      });

      setMessage("✅ Request sent successfully!");

    } catch (err) {
      setError("Failed to send request ❌");
    }
  };

  return (
    <div className="p-4 space-y-5 pb-24 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold text-center">
        Collaboration Hub 🤝
      </h1>

      {/* STATUS */}
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      {/* =========================
          CREATE TEAM FORM
      ========================= */}
      <div className="card space-y-2">

        <input
          placeholder="Event Title *"
          value={form.eventTitle}
          onChange={(e) => setForm({ ...form, eventTitle: e.target.value })}
          className="input"
        />

        <input
          placeholder="Required Skills *"
          value={form.requiredSkills}
          onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
          className="input"
        />

        <input
          placeholder="Email *"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input"
        />

        <button onClick={createPost} className="btn">
          Create Team
        </button>

      </div>

      {/* =========================
          🔥 AVAILABLE TEAMS
      ========================= */}
      <div className="space-y-3">

        <h2 className="font-semibold text-lg">Available Teams</h2>

        {posts.map((p) => (
          <div key={p.id} className="card">

            <h2 className="font-semibold">{p.eventTitle}</h2>
            <p className="text-sm text-gray-500">{p.requiredSkills}</p>

            <p className="text-xs mb-2">
              {p.currentMembers}/{p.totalMembers} members
            </p>

            {/* 🔥 JOIN BUTTON */}
            {p.creatorId !== user.id ? (
              <button
                onClick={() => joinTeam(p.id)}
                className="btn-join"
              >
                Request to Join
              </button>
            ) : (
              <span className="text-xs text-gray-400">
                Your Team
              </span>
            )}

          </div>
        ))}

      </div>

      {/* =========================
          STYLES
      ========================= */}
      <style>{`
        .card {
          background: white;
          padding: 14px;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .input {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }

        .btn {
          background: #2563eb;
          color: white;
          padding: 10px;
          border-radius: 10px;
          font-weight: 600;
          width: 100%;
        }

        .btn-join {
          background: #16a34a;
          color: white;
          padding: 8px;
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