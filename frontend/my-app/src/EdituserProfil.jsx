// EdituserProfil.jsx

import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "./utils/constent";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
       const res=await axios.patch(BASE_URL+ '/profile/edit' ,{
          ...formData,
       } , {
        withCredentials:true
       });
       console.log(res.data);
       alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex justify-center items-center px-4 py-10">

      <div className="w-full max-w-2xl bg-[#111827] rounded-3xl shadow-2xl border border-gray-800 p-8">

        {/* Heading */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            Edit Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Update your profile information
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* First Name + Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="text-gray-300 text-sm block mb-2">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="w-full bg-[#1f2937] text-white border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-violet-500"
              />

            </div>

            <div>

              <label className="text-gray-300 text-sm block mb-2">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="w-full bg-[#1f2937] text-white border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-violet-500"
              />

            </div>

          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="text-gray-300 text-sm block mb-2">
                Age
              </label>

              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                className="w-full bg-[#1f2937] text-white border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-violet-500"
              />

            </div>

            <div>

              <label className="text-gray-300 text-sm block mb-2">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#1f2937] text-white border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-violet-500"
              >
                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

          </div>

          {/* Photo URL */}
          <div>

            <label className="text-gray-300 text-sm block mb-2">
              Profile Photo URL
            </label>

            <input
              type="text"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="Enter image URL"
              className="w-full bg-[#1f2937] text-white border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-violet-500"
            />

          </div>

          {/* Skills */}
          <div>

            <label className="text-gray-300 text-sm block mb-2">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              className="w-full bg-[#1f2937] text-white border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-violet-500"
            />

          </div>

          {/* Description */}
          <div>

            <label className="text-gray-300 text-sm block mb-2">
              About
            </label>

            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write something about yourself..."
              className="w-full bg-[#1f2937] text-white border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-violet-500 resize-none"
            />

          </div>

          {/* Preview Image */}
          {formData.photoUrl && (

            <div className="flex justify-center">

              <img
                src={formData.photoUrl}
                alt="preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-violet-500"
              />

            </div>

          )}

          {/* Submit Button */}
          <button

            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-pink-500 text-white py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition"
          >
            Save Profile
          </button>

        </form>
      </div>
    </div>
  );
};

export default EdituserProfil;