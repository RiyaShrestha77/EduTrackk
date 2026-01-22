import { Link } from "react-router-dom";
import edu from "../assets/edu.png";

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={edu}
            alt="EduTrack Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-semibold text-gray-800">
            EduTrack
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-black font-medium"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-gray-700 hover:text-black font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
