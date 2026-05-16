import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./utils/constent";

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
      alert(res.data.message);
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
    return <div className="text-center mt-10">Loading requests...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-400">{error}</div>;
  }

  if (requests.length === 0) {
    return <div className="text-center mt-10">No incoming requests found.</div>;
  }

  return (
    <div className="px-4 py-6 space-y-4">
      <h1 className="text-2xl font-semibold text-white mb-4">Incoming Requests</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {requests.map((request) => (
          <div key={request._id} className="p-6 rounded-3xl border border-white/10 bg-[#111827]/90 text-white">
            <h2 className="text-xl font-semibold">
              {request.fromUserId?.firstName} {request.fromUserId?.lastName}
            </h2>
            <p className="text-gray-400 mt-2">
              {request.fromUserId?.description || "No description provided."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {request.fromUserId?.skills?.map((skill, index) => (
                <span key={index} className="px-3 py-1 rounded-full bg-violet-500/20 text-sm text-violet-200">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-300">
              Request status: <span className="font-medium">{request.status}</span>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => handleReview(request._id, "accepted")}
                disabled={loading}
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => handleReview(request._id, "rejected")}
                disabled={loading}
                className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
