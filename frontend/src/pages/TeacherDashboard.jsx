import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// Mock Data
const summaryData = [
  { title: "Total Students", value: 80 },
  { title: "Classes Teaching", value: 5 },
  { title: "Pending Assignments", value: 12 },
  { title: "Exams to Grade", value: 3 },
];

const attendanceData = [
  { day: "Mon", Attendance: 70 },
  { day: "Tue", Attendance: 65 },
  { day: "Wed", Attendance: 68 },
  { day: "Thu", Attendance: 72 },
  { day: "Fri", Attendance: 60 },
];

const gradesData = [
  { subject: "Math", AverageGrade: 85 },
  { subject: "Science", AverageGrade: 88 },
  { subject: "English", AverageGrade: 82 },
  { subject: "History", AverageGrade: 90 },
];

const upcomingAssignments = [
  { title: "Math Homework 5", dueDate: "2026-01-28" },
  { title: "Science Lab Report", dueDate: "2026-01-30" },
];

const notifications = [
  { message: "Staff meeting on Feb 1", time: "1d ago" },
  { message: "New syllabus update for Science", time: "2d ago" },
];

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      label: "My Classes",
      onClick: () => navigate("/courses"),
    },
    {
      label: "Students",
      onClick: () => navigate("/students"),
    },
    {
      label: "Assignments",
      onClick: () => {
        toast("Open a course first, then click Assignments.", { icon: "i" });
        navigate("/courses");
      },
    },
    {
      label: "Reports",
      onClick: () => {
        toast("Reports page is not added yet. Opening students page.", { icon: "i" });
        navigate("/students");
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard - Edu Track</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {summaryData.map((card, idx) => (
          <div key={idx} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-gray-500">{card.title}</h2>
            <p className="text-2xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Attendance & Grades Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Attendance Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Class Attendance Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Attendance" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grades Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Average Grades by Subject</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={gradesData}>
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="AverageGrade" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Assignments & Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Upcoming Assignments */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Assignments to Review</h2>
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

export default TeacherDashboard;
