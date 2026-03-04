import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getProfileApi, updateProfileApi } from "../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await getProfileApi();
      setUser(data);

      const names = (data.username || "").trim().split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ");

      setFormData({
        firstName,
        lastName,
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
      });

      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const username = `${formData.firstName} ${formData.lastName}`.trim();
      if (!username) {
        toast.error("Name cannot be empty");
        return;
      }

      await updateProfileApi({ username });
      toast.success("Profile updated successfully");
      setEditing(false);
      fetchProfile();
    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);
    }
  };

  const initials = useMemo(() => {
    const f = formData.firstName?.[0] || "";
    const l = formData.lastName?.[0] || "";
    return (f + l).toUpperCase() || "U";
  }, [formData.firstName, formData.lastName]);

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!user) return <div className="p-6">No profile data found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        <aside className="md:w-1/4">
          <div className="bg-white rounded-2xl shadow-md p-5 space-y-3">
            <h2 className="font-semibold text-lg">Account</h2>
            <Link to="/studentdashboard" className="block text-sm text-gray-700 hover:text-black">
              Student Dashboard
            </Link>
            <Link to="/teacherdashboard" className="block text-sm text-gray-700 hover:text-black">
              Teacher Dashboard
            </Link>
            <Link to="/teacherdashboard" className="block text-sm text-gray-700 hover:text-black">
              Admin/Teacher Dashboard
            </Link>
          </div>
        </aside>

        <main className="md:w-3/4 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-gray-500">Manage your account information</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="border rounded-xl p-6 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full mb-4 bg-black text-white flex items-center justify-center text-3xl font-bold">
                {initials}
              </div>
              <h2 className="font-semibold text-lg text-center">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-gray-500 capitalize">{user.role || "student"}</p>

              <span className="mt-3 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                Active User
              </span>
            </section>

            <section className="lg:col-span-2 border rounded-xl p-6">
              <h3 className="font-semibold mb-6">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  readOnly={!editing}
                />
                <InfoInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  readOnly={!editing}
                />
                <InfoInput
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  readOnly
                />
                <InfoInput
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  readOnly
                />
                <InfoInput
                  label="Location"
                  name="address"
                  value={formData.address}
                  readOnly
                />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                {editing ? (
                  <>
                    <button
                      onClick={() => {
                        setEditing(false);
                        const names = (user.username || "").trim().split(" ");
                        setFormData((prev) => ({
                          ...prev,
                          firstName: names[0] || "",
                          lastName: names.slice(1).join(" "),
                        }));
                      }}
                      className="px-6 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-black text-white rounded-lg">
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)} className="px-6 py-2 bg-black text-white rounded-lg">
                    Edit Profile
                  </button>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

const InfoInput = ({ label, value, onChange, name, readOnly }) => (
  <div>
    <label className="text-sm text-gray-500 mb-1 block">{label}</label>
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        className="bg-transparent w-full outline-none text-sm"
      />
    </div>
  </div>
);

export default Profile;
