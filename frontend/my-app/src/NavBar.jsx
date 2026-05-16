import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./utils/constent";
import { useDispatch } from "react-redux";
import { removeUser } from "./utils/userSlice";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const user=useSelector(state=>state.user.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();
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

  const handlelogout=async()=>{
      try{
      await axios.post(BASE_URL+ "/logout",{},{
        withCredentials:true
      });
      dispatch(removeUser());
      navigate("/login");
    }
    catch(error){
      console.log(error);
    }
  }

  return (
    <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">DevTender</Link>
        </div>
        <div className="flex gap-2">
          {user && (
          <div className="dropdown dropdown-end mx-5 flex">
            <p className="px-4">Welcome {user.firstName}</p>
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li><Link to="/connections">Connections</Link></li>
              <li>
                <Link to="/requests" className="justify-between">
                  Requests
                  {requestCount > 0 && (
                    <span className="badge badge-secondary">{requestCount}</span>
                  )}
                </Link>
              </li>
              <li onClick={handlelogout}><a>Logout</a></li>
            </ul>
          </div>
          )}
        </div>
      </div>
  )
}

export default NavBar