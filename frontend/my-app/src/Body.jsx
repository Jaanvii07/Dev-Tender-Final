import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import { addUser } from './utils/userSlice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from './utils/constent'

const Body = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userData = useSelector((store) => store.user?.user)
  const [isInitializing, setIsInitializing] = useState(true)

  const fetchUser = async () => {
    if (userData) {
      setIsInitializing(false);
      return;
    }
    try {
      const res = await axios.get(BASE_URL + '/profile/view', {
        withCredentials: true
      });
      dispatch(addUser(res.data));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
      console.log(error);
    } finally {
      setIsInitializing(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-purple-500/30">
      <NavBar />
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Body