import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./utils/constent";
import { removeUser } from "./utils/userSlice";
import { Bell, LogOut, User, Users, HeartHandshake } from "lucide-react";

const NavBar = () => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const fetchRequestCount = async () => {
      if (!user) {
        setRequestCount(0);
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/user/request/review`, {
          withCredentials: true,
        });
        setRequestCount(res.data.connectionRequest?.length || 0);
      } catch (error) {
        console.error("Error fetching request count:", error);
        setRequestCount(0);
      }
    };

    fetchRequestCount();

    const handleRequestUpdated = () => {
      fetchRequestCount();
    };

    window.addEventListener("requestUpdated", handleRequestUpdated);
    return () => {
      window.removeEventListener("requestUpdated", handleRequestUpdated);
    };
  }, [user]);

  const handlelogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, {
        withCredentials: true
      });
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="navbar sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3 transition-all duration-300">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-extrabold tracking-tight hover:scale-105 transition-transform">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            DevTender
          </span>
        </Link>
      </div>

      <div className="flex-none gap-4">
        {user ? (
          <div className="dropdown dropdown-end">
            <div className="flex items-center gap-3 cursor-pointer" tabIndex={0} role="button">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-white">
                  {user.firstName}
                </p>
                <p className="text-xs text-gray-400">Developer</p>
              </div>
              
              <div className="relative">
                <div className="avatar ring-2 ring-purple-500/50 ring-offset-2 ring-offset-[#0a0a0a] rounded-full transition-all hover:ring-pink-500">
                  <div className="w-10 rounded-full">
                    <img alt="User profile" src={user.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
                  </div>
                </div>
                {requestCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white ring-2 ring-[#0a0a0a]">
                    {requestCount}
                  </span>
                )}
              </div>
            </div>

            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-4 z-[1] p-3 shadow-2xl bg-[#111827]/95 backdrop-blur-2xl rounded-2xl w-60 border border-white/10 text-gray-200">
              <div className="px-4 py-3 border-b border-white/5 mb-2">
                <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>

              <li>
                <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 rounded-xl transition-colors">
                  <User size={16} className="text-purple-400" />
                  <span>Edit Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/connections" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 rounded-xl transition-colors">
                  <Users size={16} className="text-blue-400" />
                  <span>Connections</span>
                </Link>
              </li>
              <li>
                <Link to="/requests" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 rounded-xl transition-colors justify-between">
                  <div className="flex items-center gap-3">
                    <Bell size={16} className="text-pink-400" />
                    <span>Requests</span>
                  </div>
                  {requestCount > 0 && (
                    <span className="badge badge-sm bg-pink-500/20 text-pink-300 border-none px-2">{requestCount} new</span>
                  )}
                </Link>
              </li>
              
              <div className="divider my-1 before:bg-white/5 after:bg-white/5"></div>
              
              <li>
                <button onClick={handlelogout} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors">
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none rounded-xl hover:opacity-90 transition-opacity">
            Sign In
          </Link>
        )}
      </div>
    </div>
  )
}

export default NavBar