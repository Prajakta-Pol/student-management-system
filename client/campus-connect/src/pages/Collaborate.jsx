import { useEffect, useState } from "react";
import axios from "axios";

export default function Collaborate() {
  const [posts, setPosts] = useState([]);
  const [skillFilter, setSkillFilter] = useState("");
  const [memberFilter, setMemberFilter] = useState("");

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

  // FETCH POSTS
  const fetchPosts = async () => {
    const res = await axios.get("http://192.168.29.72:5000/api/team", {
      params: {
        skill: skillFilter,
        members: memberFilter
      }
    });
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // CREATE TEAM
  const createPost = async () => {
    if (!form.eventTitle || !form.requiredSkills || !form.email) {
      alert("Fill required fields");
      return;
    }

    await axios.post("http://192.168.29.72:5000/api/team/create", {
      ...form,
      creatorId: user.id
    });

    fetchPosts();
  };

  // JOIN TEAM
  const joinTeam = async (teamId) => {
    await axios.post("http://192.168.29.72:5000/api/team/join", {
      teamId,
      userId: user.id,
      message: "Interested to join"
    });

    alert("Request Sent");
  };

  return (
    <div className="p-4 space-y-4">

      <h1 className="text-xl font-bold">Event Collaboration Hub</h1>

      {/* FILTER */}
      <div className="flex gap-2">
        <input
          placeholder="Skill (React, ML...)"
          onChange={(e) => setSkillFilter(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="Members Needed"
          onChange={(e) => setMemberFilter(e.target.value)}
          className="border p-2"
        />
        <button onClick={fetchPosts} className="bg-blue-500 text-white px-3">
          Search
        </button>
      </div>

      {/* CREATE TEAM */}
      <div className="bg-white p-4 shadow space-y-2">
        <input placeholder="Event Title *"
          onChange={(e) => setForm({...form, eventTitle: e.target.value})}
          className="border p-2 w-full"
        />

        <input placeholder="Event Link"
          onChange={(e) => setForm({...form, eventLink: e.target.value})}
          className="border p-2 w-full"
        />

        <input placeholder="Total Members *"
          onChange={(e) => setForm({...form, totalMembers: e.target.value})}
          className="border p-2 w-full"
        />

        <input placeholder="Current Members *"
          onChange={(e) => setForm({...form, currentMembers: e.target.value})}
          className="border p-2 w-full"
        />

        <input placeholder="Required Members *"
          onChange={(e) => setForm({...form, requiredMembers: e.target.value})}
          className="border p-2 w-full"
        />

        <input placeholder="Required Skills *"
          onChange={(e) => setForm({...form, requiredSkills: e.target.value})}
          className="border p-2 w-full"
        />

        <input placeholder="Email *"
          onChange={(e) => setForm({...form, email: e.target.value})}
          className="border p-2 w-full"
        />

        <input placeholder="LinkedIn (optional)"
          onChange={(e) => setForm({...form, linkedin: e.target.value})}
          className="border p-2 w-full"
        />

        <button onClick={createPost} className="bg-green-600 text-white px-4 py-2">
          Create Team
        </button>
      </div>

      {/* POSTS */}
      {posts.map((p) => (
        <div key={p.id} className="bg-gray-100 p-3 rounded">
          <h2 className="font-bold">{p.eventTitle}</h2>
          <p>{p.requiredSkills}</p>
          <p>{p.currentMembers}/{p.totalMembers} members</p>

          <button
            onClick={() => joinTeam(p.id)}
            className="bg-indigo-500 text-white px-3 py-1 mt-2"
          >
            Request to Join
          </button>
        </div>
      ))}

    </div>
  );
}