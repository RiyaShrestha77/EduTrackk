import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUserApi } from "../services/api";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getDashboardPath = (role) => {
    if (role === "instructor" || role === "teacher") return "/teacherdashboard";
    if (role === "admin") return "/teacherdashboard";
    return "/studentdashboard";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and Password are required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await loginUserApi({
        emailOrUsername: formData.email,
        password: formData.password,
      });

      if (!data?.token) {
        toast.error(data?.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user || {}));

      toast.success("Login successful");
      navigate(getDashboardPath(data?.user?.role));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid email/username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="EduTrack Logo" className="h-20 w-60 object-contain" />
        </div>

        <p className="text-center text-gray-500 mb-6">Student Management System</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Email or Username</label>
            <input
              type="text"
              name="email"
              placeholder="Enter your email or username"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
            />
          </div>

          <div className="text-right -mt-2">
            <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-black hover:underline font-medium">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
