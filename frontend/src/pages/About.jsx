import { Link } from "react-router-dom";

const principles = [
  "Clarity First",
  "Student Centric",
  "Open Feedback",
  "Privacy Driven",
];

const About = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-[14px] font-bold text-indigo-600 uppercase tracking-[0.3em] mb-6">
          Our Story
        </h2>

        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-10">
          We build tools for the curious.
        </h1>

        <div className="space-y-8 text-slate-600 text-[18px] leading-relaxed font-medium max-w-3xl">
          <p>
            EduTrack was created to keep learning simple, focused, and practical. We reduce friction between
            students and teachers so classrooms can spend less time on management and more time on progress.
          </p>
          <p>
            From dashboards to profile tools, every feature is built to support clear communication, steady
            growth, and better outcomes for everyone in the learning journey.
          </p>
        </div>

        <div className="mt-16 p-10 md:p-12 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 mb-10">Core Principles</h3>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {principles.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[16px] text-slate-600 font-semibold">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/register"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition font-medium"
          >
            Join EduTrack
          </Link>
          <Link
            to="/login"
            className="bg-white text-slate-900 border border-slate-300 px-6 py-3 rounded-md hover:bg-slate-50 transition font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
