import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

export default function Resume() {
  const [profile, setProfile] = useState(null);
  const resumeRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(`http://10.210.127.194:5000/api/app/profile/${user.id}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.log(err));
  }, []);

  // 🔥 EXPORT PDF FUNCTION
  const exportPDF = () => {
    const element = resumeRef.current;

    const opt = {
      margin: 0.5,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (!profile) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="title">Resume</h1>
        <button className="btn" onClick={exportPDF}>
          Export PDF
        </button>
      </div>

      {/* RESUME */}
      <div ref={resumeRef} className="resume">

        {/* NAME */}
        <h2 className="name">{profile.fullName || "Your Name"}</h2>
        <p className="sub">
          {profile.email} • {profile.phone}
        </p>
        <p className="sub">
          {profile.department} • {profile.college}
        </p>

        <hr />

        {/* SUMMARY */}
        <Section title="Summary">
          <p>{profile.goal || "Passionate student..."}</p>
        </Section>

        {/* SKILLS */}
        <Section title="Skills">
          <div className="tags">
            {(profile.techSkills || "").split(",").map((s, i) => (
              s.trim() && <span key={i}>{s}</span>
            ))}
          </div>
        </Section>

        {/* PROJECTS */}
        <Section title="Projects">
          <p>• Student Activity Management System</p>
          <p>• AI-based Building Automation System</p>
        </Section>

        {/* LINKS */}
        <Section title="Links">
          {profile.github && <p>GitHub: {profile.github}</p>}
          {profile.linkedin && <p>LinkedIn: {profile.linkedin}</p>}
        </Section>

      </div>

      {/* STYLES */}
      <style>{`
        .title {
          font-size: 22px;
          font-weight: 700;
        }

        .btn {
          background: #2563eb;
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 14px;
        }

        .resume {
          background: white;
          padding: 24px;
          border-radius: 14px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        .name {
          font-size: 24px;
          font-weight: 700;
          color: #2563eb;
        }

        .sub {
          font-size: 13px;
          color: gray;
        }

        .section {
          margin-top: 16px;
        }

        .section h3 {
          font-size: 13px;
          font-weight: 600;
          color: #2563eb;
          border-left: 4px solid #2563eb;
          padding-left: 8px;
          margin-bottom: 6px;
        }

        .tags span {
          background: #eef2ff;
          padding: 4px 8px;
          border-radius: 8px;
          margin: 3px;
          display: inline-block;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}

// SECTION COMPONENT
function Section({ title, children }) {
  return (
    <div className="section">
      <h3>{title}</h3>
      {children}
    </div>
  );
}