import axios from "axios";
import { BASE_URL } from "./utils/constent";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "./utils/connectionSlice";

const Connections = () => {

  const connections = useSelector(
    (state) => state.connection || []
  );

  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {

      const res = await axios.get(
        BASE_URL + "/user/connections",
        {
          withCredentials: true,
        }
      );

      dispatch(addConnection(res.data.data));

    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // Remove null/undefined connections
  const validConnections = connections.filter(Boolean);

  if (validConnections.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <h1 className="text-2xl font-semibold text-gray-400">
          No connections found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">

      <h1 className="text-4xl font-bold text-center mb-10 text-white">
        Your Connections
      </h1>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">

        {validConnections.map((connection) => (

          <div
            key={connection._id}
            className="bg-base-100 shadow-xl rounded-2xl p-5 flex flex-col md:flex-row items-center md:items-start gap-5"
          >

            {/* Profile Image */}
            <img
              src={
                connection?.photoUrl ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-primary"
            />

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">

              <h2 className="text-2xl font-bold">
                {connection?.firstName || "Unknown"}{" "}
                {connection?.lastName || ""}
              </h2>

              <p className="text-gray-400 mt-1">
                {connection?.email || "No email"}
              </p>

              {connection?.description && (
                <p className="mt-3 text-gray-300">
                  {connection.description}
                </p>
              )}

              {connection?.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">

                  {connection.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="badge badge-primary badge-outline p-3"
                    >
                      {skill}
                    </span>
                  ))}

                </div>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Connections;