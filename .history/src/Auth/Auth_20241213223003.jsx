import { useState } from "react";
import Dashboard from "../StudentPanel/Dashboard";
import Login from "../StudentPanel/Login";
import toast from "react-hot-toast";

const Auth = () => {
    const [user, setUser] = useState(null);



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