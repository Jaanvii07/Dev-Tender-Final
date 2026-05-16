import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "./utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./utils/constent";

const Login = () => {

  const [state, setState] = React.useState("login");

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = React.useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
       BASE_URL+ "/login",
      {
        email: formData.email,
        password: formData.password
      },
      {
        withCredentials: true
      }
    );
    
    console.log(response.data);
    dispatch(addUser(response.data));
    navigate("/");

  } catch (error) {
    console.log(error);
    setError(error.response?.data?.message || "An error occurred");
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-black">
    <form
      onSubmit={handleSubmit}
      className="sm:w-87.5 w-full text-center bg-gray-900 border border-gray-800 rounded-2xl px-8"
    >
      <h1 className="text-white text-3xl mt-10 font-medium">
        {state === "login" ? "Login" : "Sign up"}
      </h1>

      <p className="text-gray-400 text-sm mt-2">
        Please sign in to continue
      </p>

      {state !== "login" && (
        <div className="flex items-center mt-6 w-full bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div className="flex items-center w-full mt-4 bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <input
          type="email"
          name="email"
          placeholder="Email id"
          className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center mt-4 w-full bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mt-4 text-left">
         <p className="text-red-500">{error}</p>
      </div>

      <button
        type="submit"
        className="mt-2 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition"
      >
        {state === "login" ? "Login" : "Sign up"}
      </button>

      <p
        onClick={() =>
          setState(prev => (prev === "login" ? "register" : "login"))
        }
        className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer"
      >
        {state === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
        <span className="text-indigo-400 hover:underline ml-1">
          click here
        </span>
      </p>
    </form>
    </div>
  );
};

export default Login;