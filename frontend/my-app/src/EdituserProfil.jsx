import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "./utils/constent";
import { User, Mail, Camera, Save, Lock, Info, Activity } from "lucide-react";

const EdituserProfil = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    gender: user?.gender || "",
    photoUrl: user?.photoUrl || "",
    description: user?.description || "",
    skills: user?.skills?.join(", ") || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await axios.patch(BASE_URL + '/profile/edit', formData, {
        withCredentials: true
      });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: error.response?.data || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setMessage({ type: "error", text: "Please provide both current and new password" });
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await axios.patch(BASE_URL + '/profile/updatePassword', passwordData, {
        withCredentials: true
      });
      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage({ type: "error", text: error.response?.data || "Failed to update password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-400">Manage your account details and preferences</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border text-sm text-center backdrop-blur-md ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <User className="text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} 
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} 
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium">Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} 
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all outline-none appearance-none">
                      <option value="" className="bg-gray-900">Select Gender</option>
                      <option value="Male" className="bg-gray-900">Male</option>
                      <option value="Female" className="bg-gray-900">Female</option>
                      <option value="Other" className="bg-gray-900">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                    <Camera size={16} /> Profile Photo URL
                  </label>
                  <input type="text" name="photoUrl" value={formData.photoUrl} onChange={handleChange} 
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                    <Activity size={16} /> Skills (comma separated)
                  </label>
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                    <Info size={16} /> About You
                  </label>
                  <textarea rows="4" name="description" value={formData.description} onChange={handleChange} placeholder="Tell others about yourself..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all outline-none resize-none" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-purple-500/25 disabled:opacity-70">
                  <Save size={18} /> Save Profile Changes
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Area: Photo Preview & Security */}
          <div className="space-y-6">
            
            {/* Photo Preview Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
              <div className="relative mb-4 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <img
                  src={formData.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="Profile preview"
                  className="relative w-32 h-32 rounded-full object-cover border-4 border-white/10 shadow-xl"
                  onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
                />
              </div>
              <h3 className="text-lg font-bold text-white">{formData.firstName || "Your"} {formData.lastName || "Name"}</h3>
              <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
            </div>

            {/* Security / Password Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <Lock className="text-pink-400" />
                <h2 className="text-lg font-semibold text-white">Security</h2>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">Current Password</label>
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-pink-500/50 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">New Password</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-pink-500/50 outline-none transition-all" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-sm font-medium transition-all border border-white/5 hover:border-white/20">
                  Update Password
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EdituserProfil;