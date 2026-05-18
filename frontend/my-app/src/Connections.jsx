import axios from "axios";
import { BASE_URL } from "./utils/constent";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "./utils/connectionSlice";
import { Mail, Briefcase, UserCheck } from "lucide-react";

const Connections = () => {
  const connections = useSelector((state) => state.connection || []);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res.data.data));
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const validConnections = connections.filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (validConnections.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center text-center px-4">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <UserCheck size={40} className="text-gray-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">No Connections Yet</h1>
        <p className="text-gray-400 max-w-md">
          Start swiping on the feed to match with other developers and build your network.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] py-12 px-4 sm:px-6 relative">
      {/* Background glow effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">
            Your Connections
          </h1>
          <p className="text-gray-400 text-lg">
            People you've matched with. Start a collaboration!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {validConnections.map((connection) => (
            <div
              key={connection._id}
              className="group bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 rounded-3xl p-6 shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
            >
              <div className="flex flex-col items-center sm:items-start sm:flex-row gap-5">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
                  <img
                    src={connection?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="profile"
                    className="relative w-24 h-24 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white/20"
                    onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    {connection?.firstName || "Unknown"} {connection?.lastName || ""}
                  </h2>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-400 mt-1 text-sm">
                    <Mail size={14} />
                    <span className="truncate">{connection?.email || "No email"}</span>
                  </div>

                  {connection?.description && (
                    <p className="mt-3 text-sm text-gray-300 line-clamp-2">
                      {connection.description}
                    </p>
                  )}
                </div>
              </div>

              {connection?.skills?.length > 0 && (
                <div className="mt-5 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-400">
                    <Briefcase size={14} />
                    <span>Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {connection.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-4 flex gap-3">
                 <a href={`mailto:${connection?.email}`} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-sm font-medium transition-all border border-white/5 hover:border-white/20 text-center">
                    Send Email
                 </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;