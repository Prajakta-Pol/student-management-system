import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    fullName: "",
    usn: "",
    email: "",
    phone: "",
    department: "",
    college: "",
    goal: "",
    techSkills: "",
    softSkills: "",
    github: "",
    linkedin: "",
    portfolio: "",
    profileImage: "" // ✅ NEW
  });

  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://192.168.29.72:5000/api/app/profile/${user.id}`
      );
      if (res.data) {
        setForm(res.data);
    } 
  }catch (err) {
      console.log(err);
    }
  };

  const saveProfile = async () => {
    await axios.post("http://192.168.29.72:5000/api/app/profile", {
      userId: user.id,
      ...form
    });
    setIsEditing(false);
    fetchProfile();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ IMAGE HANDLER
  const handleImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  // ✅ LIMIT SIZE (1MB)
  if (file.size > 1024 * 1024) {
    alert("Image too large! Please select image under 1MB.");
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    setForm({
      ...form,
      profileImage: reader.result
    });
  };

  reader.readAsDataURL(file);
};

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">

      {/* HEADER */}
      <div className="bg-white p-4 shadow flex items-center gap-3">
        <div className="avatar">
          {form.profileImage ? (
            <img src={form.profileImage} className="img" />
          ) : (
            form.fullName?.charAt(0) || "U"
          )}
        </div>

        <div>
          <h2 className="font-bold text-lg">
            {form.fullName || user?.name || "Student Name"}
          </h2>
          <p className="text-sm text-gray-500">
            {form.email || "email@example.com"}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* 🔥 VIEW MODE */}
        {!isEditing ? (
          <>
            <div className="card">
              <h3 className="title">Basic Information</h3>

              <div className="row">
                <div><label>USN</label><p>{form.usn || "-"}</p></div>
                <div><label>Department</label><p>{form.department || "-"}</p></div>
              </div>

              <div className="row">
                <div><label>College</label><p>{form.college || "-"}</p></div>
                <div><label>Phone</label><p>{form.phone || "-"}</p></div>
              </div>
            </div>

            <div className="card">
              <h3 className="title">Career Goal</h3>
              <p>{form.goal || "-"}</p>
            </div>

            <div className="card">
              <h3 className="title">Skills</h3>
              <p><b>Tech:</b> {form.techSkills || "-"}</p>
              <p><b>Soft:</b> {form.softSkills || "-"}</p>
            </div>

            <button className="btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (

        /* ✏️ EDIT MODE */
          <div className="card space-y-2">

            <h3 className="title">Edit Profile</h3>

            {/* IMAGE UPLOAD */}
            <input type="file" onChange={handleImage} />

            <input className="input" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" />
            <input className="input" name="usn" value={form.usn} onChange={handleChange} placeholder="USN" />
            <input className="input" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
            <input className="input" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />

            <input className="input" name="department" value={form.department} onChange={handleChange} placeholder="Department" />
            <input className="input" name="college" value={form.college} onChange={handleChange} placeholder="College" />

            <textarea className="input" name="goal" value={form.goal} onChange={handleChange} placeholder="Goal" />

            <input className="input" name="techSkills" value={form.techSkills} onChange={handleChange} placeholder="Tech Skills" />
            <input className="input" name="softSkills" value={form.softSkills} onChange={handleChange} placeholder="Soft Skills" />

            <input className="input" name="github" value={form.github} onChange={handleChange} placeholder="GitHub" />
            <input className="input" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn" />

            <button className="btn-save" onClick={saveProfile}>Save</button>
            <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        )}
      </div>

      <style>{`
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #4f46e5;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card {
          background: white;
          padding: 15px;
          border-radius: 12px;
        }

        .row {
          display: flex;
          justify-content: space-between;
        }

        .row div {
          width: 48%;
        }

        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }

        .btn {
          width: 100%;
          background: #4f46e5;
          color: white;
          padding: 10px;
          border-radius: 10px;
        }

        .btn-save {
          background: green;
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