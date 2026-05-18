import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./utils/constent";
import UserCard from "./UserCard";
import { Users, AlertTriangle } from "lucide-react";

const PAGE_SIZE = 12;

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFeed = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/feed?page=${page}&limit=${PAGE_SIZE}`, {
          withCredentials: true,
        });

        const fetchedUsers = res.data.user || [];
        setUsers((prev) => [...prev, ...fetchedUsers]);
        setHasMore(fetchedUsers.length === PAGE_SIZE);
      } catch (error) {
        console.log(error);
        setError(error?.response?.data?.message || error.message || "Unable to load feed");
      } finally {
        setLoading(false);
      }
    };

    getFeed();
  }, [page]);

  const loadMore = () => {
    setPage((current) => current + 1);
  };

  const handleUserAction = (userId) => {
    setUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  if (error) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center px-4">
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-8 rounded-3xl max-w-md text-center backdrop-blur-xl">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-70" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Feed</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (users.length === 0 && loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
        <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-xl">
          <Users size={48} className="text-gray-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">No More Users</h1>
        <p className="text-gray-400 max-w-md text-lg mb-8">
          You've seen everyone in your feed! Check back later for new developers to connect with.
        </p>
        {hasMore && (
           <button
             type="button"
             onClick={loadMore}
             className="px-6 py-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-all font-semibold"
           >
             Try Loading More
           </button>
        )}
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-8 relative min-h-screen flex flex-col">
      {/* Background Glows */}
      <div className="absolute top-0 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col flex-1">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-4 tracking-tight">
            Discover Developers
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Swipe left to ignore, or right to send a connection request. Build your network!
          </p>
        </div>

        {/* Stack Layout */}
        <div className="flex-1 flex flex-col justify-center items-center mb-10 w-full relative">
          {/* Explicit height wrapper for absolute children */}
          <div className="relative w-full max-w-sm h-[580px] mx-auto">
            {users.slice(0, 3).reverse().map((user, index, arr) => {
              // Map index: because of reverse(), the last element in the mapped array 
              // is actually users[0], which means we want it to be on top.
              // We compute depth where depth=0 is the top card.
              const depth = arr.length - 1 - index; 
              
              return (
                <div 
                  key={user._id} 
                  className="absolute top-0 left-0 w-full transition-all duration-300 ease-out"
                  style={{
                    zIndex: 100 - depth,
                    transform: `translateY(${depth * 20}px) scale(${1 - depth * 0.04})`,
                    opacity: 1 - depth * 0.3,
                    pointerEvents: depth === 0 ? "auto" : "none"
                  }}
                >
                  <UserCard user={user} onAction={handleUserAction} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading Indicator at the bottom if running out */}
        {(users.length < 3 && hasMore && !loading) && (
          <div className="flex justify-center mt-4">
             <button
               onClick={loadMore}
               className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
             >
               Load next batch...
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;