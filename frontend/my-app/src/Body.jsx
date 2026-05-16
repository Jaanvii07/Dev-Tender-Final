import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import { addUser } from './utils/userSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from './utils/constent'

const Body = () => {
   
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userData = useSelector((store) => store.user.user)
  const fatchUser=async()=>{
       if(userData){
         return;
       }
       try {
            const res=await axios.get(BASE_URL+ '/profile/view', {
              withCredentials:true
            });
            dispatch(addUser(res.data));
       } catch (error) {
            if(error.response && error.response.status === 401){
                 navigate("/login");
            }
            console.log(error);
       }
  }

  useEffect(()=>{
    fatchUser();
  }, []);
 
  return (
    <div>
        <NavBar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Body