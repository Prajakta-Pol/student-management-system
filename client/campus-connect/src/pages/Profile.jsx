import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    const res = await axios.get(
      `http://10.210.127.194:5000/api/app/profile/${user.id}`
    );
    if (res.data) setForm(res.data);
  };

  const saveProfile = async () => {
    await axios.post("http://10.210.127.194:5000/api/app/profile", {
      userId: user.id,
      ...form
    });
    setIsEditing(false);
    fetchProfile();
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* HEADER */}
      <div className="profile-header">
        <div className="avatar">
          {form.profileImage ? (
            <img src={form.profileImage} />
          ) : (
            form.fullName?.charAt(0) || "U"
          )}
        </div>

        <h2 className="name">{form.fullName || "Student Name"}</h2>
        <p className="email">{form.email || "email@example.com"}</p>
      </div>

      <div className="p-4 space-y-5">

        {!isEditing ? (
          <>
            {/* BASIC INFO */}
            <div className="card">
              <h3 className="section-title">Basic Information</h3>

              <div className="info-grid">
                <Info label="USN" value={form.usn} />
                <Info label="Department" value={form.department} />
                <Info label="College" value={form.college} />
                <Info label="Phone" value={form.phone} />
              </div>
            </div>

            {/* GOAL */}
            <div className="card">
              <h3 className="section-title">Career Goal</h3>
              <p className="text">{form.goal || "-"}</p>
            </div>

            {/* SKILLS */}
            <div className="card">
              <h3 className="section-title">Skills</h3>
              <p><b>Tech:</b> {form.techSkills || "-"}</p>
              <p><b>Soft:</b> {form.softSkills || "-"}</p>
            </div>

            <button className="btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <div className="card space-y-3">
            <h3 className="section-title">Edit Profile</h3>

            <input type="file" onChange={handleImage} />

            <div className="grid-2">
              <input className="input" name="fullName" value={form.fullName || ""} onChange={handleChange} placeholder="Full Name" />
              <input className="input" name="usn" value={form.usn || ""} onChange={handleChange} placeholder="USN" />
            </div>

            <div className="grid-2">
              <input className="input" name="email" value={form.email || ""} onChange={handleChange} placeholder="Email" />
              <input className="input" name="phone" value={form.phone || ""} onChange={handleChange} placeholder="Phone" />
            </div>

            <input className="input" name="department" value={form.department || ""} onChange={handleChange} placeholder="Department" />
            <input className="input" name="college" value={form.college || ""} onChange={handleChange} placeholder="College" />

            <textarea className="input" name="goal" value={form.goal || ""} onChange={handleChange} placeholder="Career Goal" />

            <input className="input" name="techSkills" value={form.techSkills || ""} onChange={handleChange} placeholder="Tech Skills" />
            <input className="input" name="softSkills" value={form.softSkills || ""} onChange={handleChange} placeholder="Soft Skills" />

            <input className="input" name="github" value={form.github || ""} onChange={handleChange} placeholder="GitHub" />
            <input className="input" name="linkedin" value={form.linkedin || ""} onChange={handleChange} placeholder="LinkedIn" />

            <button className="btn-save" onClick={saveProfile}>Save</button>
            <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        )}
      </div>

      <style>{`
        .profile-header {
          background: linear-gradient(to right, #E0AC69, #2563eb);
          color: white;
          text-align: center;
          padding: 30px 10px;
          border-radius: 0 0 20px 20px;
        }

        .name {
          font-size: 20px;
          font-weight: 600;
        }

        .email {
          font-size: 13px;
          opacity: 0.9;
        }

        .avatar {
          width: 80px;
          height: 80px;
          margin: auto;
          border-radius: 50%;
          background: white;
          color: #E0AC69;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card {
          background: white;
          padding: 16px;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 10px;
          border-left: 4px solid #2563eb;
          padding-left: 8px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .text {
          color: #555;
        }

        .input {
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .btn {
          width: 100%;
          background: #2563eb;
          color: white;
          padding: 10px;
          border-radius: 10px;
        }

        .btn-save {
          background: #16a34a;
          color: white;
          padding: 10px;
          border-radius: 10px;
        }

        .btn-cancel {
          background: gray;
          color: white;
          padding: 10px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

/* SMALL COMPONENT */
function Info({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: "12px", color: "#888" }}>{label}</p>
      <p style={{ fontWeight: "500" }}>{value || "-"}</p>
    </div>
  );
}