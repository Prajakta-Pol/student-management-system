import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH POSTS
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://192.168.29.72:5000/api/app/posts");
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // POST ACHIEVEMENT
  const postAchievement = async () => {
    if (!text) return;

    try {
      await axios.post("http://192.168.29.72:5000/api/app/post", {
        userId: user.id,
        text,
      });

      setText("");
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-4 space-y-4 pb-20">

      <h1 className="text-xl font-bold">Welcome Back 👋</h1>

      {/* PROFILE COMPLETION */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold">Complete Your Profile</h2>

        <div className="w-full bg-gray-200 h-3 rounded-full mt-2">
          <div className="bg-green-500 h-3 rounded-full w-[60%]"></div>
        </div>

        <p className="text-sm mt-2 text-gray-500">60% completed</p>
      </div>

      {/* POST ACHIEVEMENT */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold">Post Achievement</h2>

        <textarea
          className="w-full border p-2 mt-2 rounded"
          placeholder="Share your achievement..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={postAchievement}
          className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>

      {/* FEED */}
      <div className="space-y-3">
        <h2 className="font-semibold">Campus Feed</h2>

        {posts.map((p) => (
          <div key={p.id} className="bg-white p-3 rounded shadow">
            <p>{p.text}</p>
          </div>
        ))}
      </div>

    </div>
  );
}