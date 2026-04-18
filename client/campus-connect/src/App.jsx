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
import EventDetails from "./pages/EventDetails";
import QRScanner from "./pages/QRScanner";
import AdminStats from "./pages/AdminStats";
// OPTIONAL (create later if needed)
// import Settings from "./pages/Settings";

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
        <Route path="/admin/stats" element={<AdminStats />} />
        {/* MAIN APP */}
        <Route path="/dashboard" element={<Dashboard />}>

          {/* CHILD ROUTES */}
          <Route path="home" element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="collaborate" element={<Collaborate />} />
          <Route path="resume" element={<Resume />} />
          <Route path="profile" element={<Profile />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="scan" element={<QRScanner />} />
          {/* DEFAULT ROUTE */}
          <Route index element={<Navigate to="home" replace />} />

        </Route>

        {/* FALLBACK (optional but recommended) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;