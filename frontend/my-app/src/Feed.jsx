import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./utils/constent";
import UserCard from "./UserCard";

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

  if (error) {
    return <h1 className="text-center text-2xl mt-10 text-red-400">{error}</h1>;
  }

  if (users.length === 0 && loading) {
    return <h1 className="text-center text-2xl mt-10">Loading users...</h1>;
  }

  if (users.length === 0) {
    return (
      <h1 className="text-center text-2xl mt-10">No Users Found</h1>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={loadMore}
            className="rounded-full bg-violet-600 px-6 py-3 text-white font-semibold hover:bg-violet-500 transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load more users"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;