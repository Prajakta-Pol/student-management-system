import { useEffect, useState } from "react";
import axios from "axios";

export default function Mentor() {
  const [students, setStudents] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [skill, setSkill] = useState("");

  const mentor = JSON.parse(localStorage.getItem("user"));

  const fetchStudents = async () => {
    const res = await axios.get("http://192.168.29.72:5000/api/app/mentor/students");
    setStudents(res.data);
  };

  const submitFeedback = async (studentId) => {
    await axios.post("http://192.168.29.72:5000/api/app/mentor/feedback", {
      userId: studentId,
      mentorId: mentor.id,
      feedback,
      skillApproved: skill
    });

    alert("Feedback submitted ✅");
    setFeedback("");
    setSkill("");
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-4 space-y-4 pb-20">
      <h1 className="text-xl font-bold">Mentor Dashboard 🧑‍🏫</h1>

      {students.map((s) => (
        <div key={s.id} className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">{s.fullName}</h2>
          <p className="text-gray-500">Points: {s.points}</p>

          <textarea
            placeholder="Write feedback..."
            className="w-full border p-2 mt-2 rounded"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <input
            placeholder="Approve skill (e.g. React)"
            className="w-full border p-2 mt-2 rounded"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />

          <button
            onClick={() => submitFeedback(s.id)}
            className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded"
          >
            Submit
          </button>
        </div>
      ))}
    </div>
  );
}