import React from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Mock Data
const attendanceData = [
  { day: "Mon", Attendance: 1 },
  { day: "Tue", Attendance: 1 },
  { day: "Wed", Attendance: 0 },
  { day: "Thu", Attendance: 1 },
  { day: "Fri", Attendance: 1 },
];

const gradesData = [
  { subject: "Math", Grade: 88 },
  { subject: "Science", Grade: 92 },
  { subject: "English", Grade: 85 },
  { subject: "History", Grade: 90 },
];

const upcomingAssignments = [
  { title: "Math Homework 5", dueDate: "2026-01-28" },
  { title: "Science Lab Report", dueDate: "2026-01-30" },
  { title: "English Essay", dueDate: "2026-02-02" },
];

const notifications = [
  { message: "New announcement: Parent-Teacher meeting on Feb 5", time: "1d ago" },
  { message: "Your Math homework has been graded", time: "2d ago" },
];

const StudentDashboard = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      label: "My Profile",
      onClick: () => navigate("/profile"),
    },
    {
      label: "Courses",
      onClick: () => navigate("/courses"),
    },
    {
      label: "Assignments",
      onClick: () => {
        const section = document.getElementById("assignments-section");
        if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    },
    {
      label: "Grades",
      onClick: () => {
        const section = document.getElementById("grades-section");
        if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard - Edu Track</h1>

      {/* Attendance & Grades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Attendance Chart */}
        <div id="grades-section" className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Weekly Attendance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={attendanceData}>
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(val) => (val ? "Present" : "Absent")} />
              <Tooltip formatter={(val) => (val ? "Present" : "Absent")} />
              <Line type="monotone" dataKey="Attendance" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grades Chart */}
        <div id="assignments-section" className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Grades Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={gradesData}>
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Grade" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Assignments & Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Upcoming Assignments */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Upcoming Assignments</h2>
          <ul className="space-y-3">
            {upcomingAssignments.map((assignment, idx) => (
              <li key={idx} className="border-b pb-2">
                <p className="font-semibold">{assignment.title}</p>
                <p className="text-gray-500 text-sm">Due: {assignment.dueDate}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Notifications */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <ul className="space-y-3">
            {notifications.map((note, idx) => (
              <li key={idx} className="border-b pb-2">
                <p className="text-gray-700">{note.message}</p>
                <p className="text-gray-400 text-xs">{note.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={link.onClick}
              className="bg-indigo-500 text-white p-4 rounded-lg text-center cursor-pointer hover:bg-indigo-600 transition"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
