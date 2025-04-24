import { useEffect, useState } from "react";
import Dashboard from "../StudentPanel/Dashboard";
import Login from "../StudentPanel/Login";
import toast from "react-hot-toast";
import axios from "axios";

const Auth = () => {
    const [user, setUser] = useState(null);
// GET request for remote image in node.js
useEffect(()=>{
  axios({
    method: 'get',
    url: 'http://bit.ly/2mTM3nY',
    responseType: 'stream'
  })
    .then(function (response) {
      response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
    });
  
},[])



    function handleLogin({ username }) {
        if (username === "1234") {
          
          setUser(true);
          toast.success("Successfully Logged In!");
        } else {
          setUser(null);
          toast.error("Wrong Username or Password");
        }
      }


    return user ? (
        <Dashboard />
      ) : (
        <>
          <Login fuction={handleLogin}/>
        </>
      );
};

export default Auth;