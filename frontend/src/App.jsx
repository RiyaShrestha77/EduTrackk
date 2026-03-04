import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Course from "./pages/Course";
import CreateCourse from "./pages/CreateCourse";
import CourseDetails from "./pages/CourseDetails";
import Student from "./pages/Student";
import Assignment from "./pages/Assigment";
import CreateAssignment from "./pages/CreateAssigment";
import AssignmentSubmissions from "./pages/AssigmentSubmissions";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./protected/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Toaster />
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/profile" element={<ProtectedRoute allowedRoles={["student", "instructor", "admin"]} element={<Profile />} />} />

            <Route path="/studentdashboard" element={<ProtectedRoute allowedRoles={["student"]} element={<StudentDashboard />} />} />
            <Route path="/teacherdashboard" element={<ProtectedRoute allowedRoles={["instructor", "admin"]} element={<TeacherDashboard />} />} />
            <Route path="/admindashboard" element={<ProtectedRoute allowedRoles={["admin"]} element={<TeacherDashboard />} />} />
            <Route path="/students" element={<ProtectedRoute allowedRoles={["instructor", "admin"]} element={<Student />} />} />

            <Route path="/courses" element={<ProtectedRoute allowedRoles={["student", "instructor", "admin"]} element={<Course />} />} />
            <Route path="/createcourse" element={<ProtectedRoute allowedRoles={["instructor", "admin"]} element={<CreateCourse />} />} />
            <Route path="/createcourse/:id" element={<ProtectedRoute allowedRoles={["instructor", "admin"]} element={<CreateCourse />} />} />
            <Route path="/course/:id" element={<ProtectedRoute allowedRoles={["student", "instructor", "admin"]} element={<CourseDetails />} />} />

            <Route path="/assignments/:courseId" element={<ProtectedRoute allowedRoles={["student", "instructor", "admin"]} element={<Assignment />} />} />
            <Route path="/createassignment/:courseId" element={<ProtectedRoute allowedRoles={["instructor", "admin"]} element={<CreateAssignment />} />} />
            <Route path="/createassignment/:courseId/:assignmentId" element={<ProtectedRoute allowedRoles={["instructor", "admin"]} element={<CreateAssignment />} />} />
            <Route path="/assignment-submissions/:assignmentId" element={<ProtectedRoute allowedRoles={["instructor", "admin"]} element={<AssignmentSubmissions />} />} />
            <Route path="/submissions/:assignmentId" element={<ProtectedRoute allowedRoles={["instructor", "admin"]} element={<AssignmentSubmissions />} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
