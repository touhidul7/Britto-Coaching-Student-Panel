import {  useState } from "react";
import Dashboard from "../StudentPanel/Dashboard";
import Login from "../StudentPanel/Login";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Auth = () => {
  const [user, setUser] = useState(null);
  const [data,setData] = useState([])
  // login handler
  const backendApiUrl = import.meta.env.VITE_API_BASE_URL;

  function handleLogin({ username }) {

    axios.get(`${backendApiUrl}/students/admission/${username}`)
      .then(function (response) {
        if (response.data.student.length != 0 && response.data.student.status == 1) {
          setUser(true);
          toast.success("Successfully Logged In!");
          setData(response.data.student)
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setUser(null);
        toast.error("Wrong Username or Password");
      })
  }


  return user ? (
    <Dashboard data={data}/>
  ) : (
    <>
      <Login fuction={handleLogin} />
      <Toaster />
    </>
  );
};

export default Auth;