import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./utils/constent";
import { Check, X, Bell, UserPlus } from "lucide-react";

export const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/user/request/review`, {
          withCredentials: true,
        });
        setRequests(res.data.connectionRequest || []);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError(err?.response?.data?.message || err.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleReview = async (requestId, status) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      const updated = requests.filter((request) => request._id !== requestId);
      setRequests(updated);
      window.dispatchEvent(new Event("requestUpdated"));
    } catch (err) {
      console.error("Error reviewing request:", err);
      setError(err?.response?.data?.message || err.message || "Failed to review request");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center">
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-2xl max-w-md text-center">
          <X className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <h2 className="text-lg font-bold mb-1">Error Loading Requests</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center text-center px-4">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <Bell size={40} className="text-gray-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">No Incoming Requests</h1>
        <p className="text-gray-400 max-w-md">
          When someone is interested in your profile, their request will appear here. Keep exploring the feed!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] py-12 px-4 sm:px-6 relative">
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-3 flex items-center justify-center gap-3">
            <UserPlus className="text-pink-400" /> Connection Requests
          </h1>
          <p className="text-gray-400 text-lg">
            Review your pending invites to connect.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {requests.map((request) => (
            <div key={request._id} className="group bg-white/5 backdrop-blur-lg border border-white/10 hover:border-pink-500/30 rounded-3xl p-6 shadow-xl hover:shadow-pink-500/10 transition-all duration-300">
              
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
                  <img
                    src={request.fromUserId?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="user profile"
                    className="relative w-16 h-16 rounded-full object-cover border-2 border-white/20"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors">
                    {request.fromUserId?.firstName} {request.fromUserId?.lastName}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {request.fromUserId?.description || "No description provided."}
                  </p>
                </div>
              </div>

              {request.fromUserId?.skills?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {request.fromUserId.skills.slice(0, 5).map((skill, index) => (
                    <span key={index} className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-gray-300 border border-white/10">
                      {skill}
                    </span>
                  ))}
                  {request.fromUserId.skills.length > 5 && (
                    <span className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-gray-400 border border-white/10">
                      +{request.fromUserId.skills.length - 5}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleReview(request._id, "accepted")}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50"
                >
                  <Check size={18} /> Accept
                </button>
                <button
                  type="button"
                  onClick={() => handleReview(request._id, "rejected")}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 hover:border-rose-500/50 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50"
                >
                  <X size={18} /> Reject
                </button>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Requests;
