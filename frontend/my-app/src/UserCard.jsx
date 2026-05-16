import axios from "axios";
import { X, Heart } from "lucide-react";
import { BASE_URL } from "./utils/constent";

const UserCard = ({ user }) => {
  if (!user) return null;

  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    description,
    skills,
  } = user;

  const handleRequest = async (status) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/send/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      alert(res.data.message);
    } catch (error) {
      console.error("Error sending request:", error);
      const message = error?.response?.data?.message || error.message;
      alert(`Request failed: ${message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] px-4 bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0b1120]">
      
      <div className="w-full max-w-sm rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#111827]/90">

        {/* Top Section */}
        <div className="h-44 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 relative flex justify-center">

          {/* Profile Image */}
          <div className="absolute top-12">
            <img
              src={
                photoUrl ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="user"
              className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-xl"
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-24 px-6 pb-6 text-white">

          {/* Name */}
          <h2 className="text-3xl font-bold tracking-wide">
            {firstName} {lastName}
          </h2>

          {/* Age + Gender */}
          {(age || gender) && (
            <p className="text-gray-300 mt-2 text-sm">
              {age && `${age} years old`}
              {age && gender && " • "}
              {gender}
            </p>
          )}

          {/* Description */}
          {description && (
            <p className="mt-5 text-gray-400 leading-7 text-sm">
              {description}
            </p>
          )}

          {/* Skills */}
          {skills?.length > 0 && (
            <div className="mt-6">

              <h3 className="text-sm font-semibold text-violet-400 mb-3">
                Skills
              </h3>

              <div className="flex flex-wrap gap-2">

                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full border border-violet-500 text-sm text-gray-200 bg-white/5"
                  >
                    {skill}
                  </span>
                ))}

              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-around items-center mt-8 pt-5 border-t border-white/10">

            <button
              onClick={() => handleRequest("ignore")}
              className="flex flex-col items-center gap-2 text-rose-400 hover:scale-110 transition"
            >
              <div className="w-14 h-14 rounded-full border-2 border-rose-500 flex items-center justify-center">
                <X size={28} />
              </div>

              <span className="text-sm">Ignore</span>
            </button>

            <button
              onClick={() => handleRequest("interested")}
              className="flex flex-col items-center gap-2 text-emerald-400 hover:scale-110 transition"
            >
              <div className="w-14 h-14 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                <Heart size={24} fill="currentColor" />
              </div>

              <span className="text-sm">Interested</span>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default UserCard;