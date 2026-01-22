const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm">
        
        {/* Left */}
        <p>
          © {new Date().getFullYear()} EduTrack. All rights reserved.
        </p>

        {/* Right */}
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-black">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-black">
            Terms of Service
          </a>
          <a href="#" className="hover:text-black">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
