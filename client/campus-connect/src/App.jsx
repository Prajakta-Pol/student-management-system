import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Intro from "./pages/Intro";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Home from "./pages/Home";
import Events from "./pages/Events";
import Collaborate from "./pages/Collaborate";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Mentor from "./pages/Mentor";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH FLOW */}
        <Route path="/" element={<Intro />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/mentor" element={<Mentor />} />
        
        {/* MAIN APP */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="home" element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="collaborate" element={<Collaborate />} />
          <Route path="resume" element={<Resume />} />
          <Route path="profile" element={<Profile />} />

          {/* default route inside dashboard */}
          <Route index element={<Navigate to="home" replace />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;