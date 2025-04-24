import { useEffect, useState } from "react";
import Dashboard from "../StudentPanel/Dashboard";
import Login from "../StudentPanel/Login";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Auth = () => {
  const [user, setUser] = useState(null);
  const [studentId, setStudentId] = useState();
  const [checkData, setCheckData] = useState([])

  // GET request for remote image in node.js
  useEffect(() => {
    axios.get(`http://192.168.1.9:8000/api/students/admission/${studentId}`)
      .then(function (response) {
        // handle success
        setCheckData(response.data.student);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      console.log(studentId);
  }, [studentId])


  

  // login handler

  function handleLogin({ username }) {

    axios.get(`http://192.168.1.9:8000/api/students/admission/${username}`)
    .then(function (response) {
      // handle success
      setCheckData(response.data.student);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })

    // check login

    if (checkData.length !=0) {
      setUser(true);
      toast.success("Successfully Logged In!");
    } else {
      console.log('heelo');
      
      setUser(null);
      toast.error("Wrong Username or Password");
    }
  }


  return user ? (
    <Dashboard />
  ) : (
    <>
      <Login fuction={handleLogin} />
      <Toaster/>
    </>
  );
};

export default Auth;