import { useState } from "react";
import axios from "axios";
import { X, Heart, Sparkles } from "lucide-react";
import { BASE_URL } from "./utils/constent";

const UserCard = ({ user, onAction }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [swipeAction, setSwipeAction] = useState(null);
  const [isRemoved, setIsRemoved] = useState(false);
  const [flyOut, setFlyOut] = useState(null); // 'left' or 'right'

  if (!user || isRemoved) return null;

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

  const resetCard = () => {
    setOffset({ x: 0, y: 0 });
    setSwipeAction(null);
    setIsDragging(false);
    setDragStart({ x: 0, y: 0 });
    setFlyOut(null);
  };

  const handleRequest = async (status) => {
    if (loading) return;
    setLoading(true);

    // Trigger fly out animation
    const direction = status === "interested" ? "right" : "left";
    setFlyOut(direction);

    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error sending request:", error);
      // If the API fails (e.g., "Connection request already exists"),
      // we still want to remove the card from the UI so the user isn't stuck.
    } finally {
      // Wait for the fly-out animation to finish before removing from DOM
      setTimeout(() => {
        if (onAction) {
          onAction(_id);
        } else {
          setIsRemoved(true);
        }
      }, 300);
      
      setLoading(false);
    }
  };

  const handlePointerDown = (event) => {
    if (loading || flyOut) return;
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging || flyOut) return;
    const x = event.clientX - dragStart.x;
    const y = event.clientY - dragStart.y;
    setOffset({ x, y });
    setSwipeAction(x > 0 ? "interested" : x < 0 ? "ignore" : null);
  };

  const handlePointerEnd = async (event) => {
    if (!isDragging || flyOut) return;
    const threshold = 120;
    const { x } = offset;

    if (Math.abs(x) > threshold) {
      if (x > 0) {
        await handleRequest("interested");
      } else {
        await handleRequest("ignore");
      }
    } else {
      resetCard();
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  let finalTransform = `translate(${offset.x}px, ${offset.y}px) rotate(${offset.x / 20}deg)`;
  if (flyOut === 'right') {
    finalTransform = `translate(150vw, ${offset.y}px) rotate(45deg)`;
  } else if (flyOut === 'left') {
    finalTransform = `translate(-150vw, ${offset.y}px) rotate(-45deg)`;
  }

  const cardStyle = {
    transform: finalTransform,
    transition: isDragging ? "none" : "transform 300ms ease-out",
    touchAction: "none",
    cursor: loading ? "not-allowed" : isDragging ? "grabbing" : "grab",
  };

  const actionLabel = swipeAction === "interested" || flyOut === "right" ? "INTERESTED" : swipeAction === "ignore" || flyOut === "left" ? "IGNORE" : null;
  const actionColor = swipeAction === "interested" || flyOut === "right" ? "text-emerald-400 border-emerald-400" : swipeAction === "ignore" || flyOut === "left" ? "text-rose-400 border-rose-400" : "opacity-0";

  return (
    <div
      className="w-full relative group perspective-1000 select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      style={cardStyle}
    >
      <div className="bg-[#111827]/90 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-300 group-hover:border-purple-500/30">
        
        {/* Swipe Overlay Indicator */}
        <div className={`absolute top-8 left-1/2 -translate-x-1/2 z-20 px-6 py-2 rounded-full border-2 font-black text-xl tracking-widest bg-black/50 backdrop-blur-md transition-opacity duration-200 pointer-events-none ${actionColor}`}>
          {actionLabel}
        </div>

        {/* Header Image Area */}
        <div className="h-48 relative overflow-hidden bg-gray-900 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-pink-500/40 to-transparent mix-blend-overlay z-10"></div>
          <img
            src={photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="cover"
            className="w-full h-full object-cover filter blur-sm scale-110 opacity-50 pointer-events-none"
            onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10"></div>
          
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur-md opacity-60"></div>
              <img
                src={photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="user"
                className="relative w-28 h-28 rounded-full border-4 border-[#0a0a0a] object-cover bg-[#0a0a0a] pointer-events-none"
                onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="pt-14 px-6 pb-6 text-center">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex justify-center items-center gap-2">
            {firstName} {lastName}
          </h2>

          {(age || gender) && (
            <p className="text-purple-400 mt-1 text-sm font-medium">
              {age && `${age} years`}
              {age && gender && " • "}
              {gender}
            </p>
          )}

          {description && (
            <p className="mt-4 text-gray-400 text-sm line-clamp-3 leading-relaxed px-2">
              "{description}"
            </p>
          )}

          {skills?.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-center gap-2 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <Sparkles size={14} className="text-pink-500" /> Core Skills
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {skills.slice(0, 5).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 5 && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
                    +{skills.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-6 mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => handleRequest("ignore")}
              disabled={loading || flyOut}
              className="group relative flex flex-col items-center gap-2 text-rose-400 transition disabled:opacity-50 z-30 relative"
            >
              <div className="w-14 h-14 rounded-full border-2 border-rose-500/50 bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-rose-500/50">
                <X size={26} strokeWidth={3} />
              </div>
            </button>

            <button
              onClick={() => handleRequest("interested")}
              disabled={loading || flyOut}
              className="group relative flex flex-col items-center gap-2 text-emerald-400 transition disabled:opacity-50 z-30 relative"
            >
              <div className="w-14 h-14 rounded-full border-2 border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-emerald-500/50">
                <Heart size={24} fill="currentColor" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;