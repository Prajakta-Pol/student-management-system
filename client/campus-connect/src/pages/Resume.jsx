import { useEffect, useState } from "react";
import axios from "axios";

/* MAIN COMPONENT */
export default function Resume() {
  const [profile, setProfile] = useState(null);
  const [template, setTemplate] = useState("modern");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
  `http://192.168.29.72:5000/api/app/resume/${user.id}`
);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">Resume 📄</h1>

      {/* TEMPLATE SWITCH */}
      <div className="mb-4 space-x-2">
        <button onClick={() => setTemplate("modern")} className="btn">
          Modern
        </button>
        <button onClick={() => setTemplate("classic")} className="btn">
          Classic
        </button>
        <button onClick={() => setTemplate("minimal")} className="btn">
          Minimal
        </button>
      </div>

      <ResumePreview profile={profile} template={template} />
    </div>
  );
}

/* TEMPLATE SWITCHER */
function ResumePreview({ profile, template }) {
  if (template === "modern") return <ModernTemplate profile={profile} />;
  if (template === "classic") return <ClassicTemplate profile={profile} />;
  return <MinimalTemplate profile={profile} />;
}

/* MODERN TEMPLATE */
function ModernTemplate({ profile }) {
  return (
    <div className="bg-white p-6 md:p-8 space-y-5 max-w-[800px] mx-auto shadow border rounded-lg">

      {/* HEADER */}
      <div className="border-b-2 border-blue-600 pb-4">
        <h1 className="text-2xl font-bold text-blue-700">{profile.name}</h1>
        <p className="text-gray-500">
          {profile.department} · {profile.year}
        </p>

        <div className="flex gap-3 text-sm text-gray-500 mt-2">
          <span>{profile.email}</span>
          <span>{profile.phone}</span>
        </div>
      </div>

      {profile.bio && <p className="italic text-gray-600">{profile.bio}</p>}

      {/* EDUCATION */}
      {profile.academics?.length > 0 && (
        <Section title="Education">
          {profile.academics.map((ac) => (
            <div key={ac.id}>
              <p className="font-medium">
                {ac.degree} in {ac.field}
              </p>
              <p className="text-xs text-gray-500">
                {ac.institution} · {ac.startYear}-{ac.endYear}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* SKILLS */}
      {profile.skills?.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span
                key={s.id}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
              >
                {s.name} ({s.level})
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* PROJECTS */}
      {profile.projects?.length > 0 && (
        <Section title="Projects">
          {profile.projects.map((p) => (
            <div key={p.id}>
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-gray-500">{p.description}</p>
              <p className="text-xs text-gray-400">
                Tech: {p.techStack.join(", ")}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* CERTIFICATIONS */}
      {profile.certifications?.length > 0 && (
        <Section title="Certifications">
          {profile.certifications.map((c) => (
            <div key={c.id}>
              <p className="font-medium">{c.title}</p>
              <p className="text-xs text-gray-500">
                {c.issuer} · {c.date}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* INTERESTS */}
      {profile.interests?.length > 0 && (
        <Section title="Interests">
          <p className="text-xs">
            {profile.interests.join(" · ")}
          </p>
        </Section>
      )}
    </div>
  );
}

/* CLASSIC TEMPLATE */
function ClassicTemplate({ profile }) {
  return (
    <div className="bg-white p-6 space-y-4 max-w-[800px] mx-auto shadow border rounded-lg">
      <div className="text-center border-b pb-4">
        <h1 className="font-bold uppercase">{profile.name}</h1>
        <p className="text-xs">{profile.email} | {profile.phone}</p>
      </div>
    </div>
  );
}

/* MINIMAL TEMPLATE */
function MinimalTemplate({ profile }) {
  return (
    <div className="bg-white p-6 space-y-4 max-w-[800px] mx-auto shadow border rounded-lg">
      <h1 className="font-semibold">{profile.name}</h1>
      <p className="text-xs text-gray-500">{profile.email}</p>
    </div>
  );
}

/* SECTION */
function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-blue-700 font-semibold uppercase text-sm mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}