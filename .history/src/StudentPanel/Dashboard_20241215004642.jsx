import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const Dashboard = ({data}) => {
    const backendApiUrl = import.meta.env.VITE_API_BASE_URL;
    const [terms, setTerms] = useState();
     /* Get Term */
  useEffect(() => {
    axios
      .get(`${backendApiUrl}/getExamName`)
      .then(function (response) {
        setTerms(response.data.data);
        toast.success("Successfully Loaded Data!");
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        toast.error("Result Not Found");
      });
  }, [backendApiUrl]);
    
    return (
        <div>
             <Toaster position="top-center" reverseOrder={false} />
            <div className="mb-20"><Navbar data={data}/></div>
            <Outlet context={{data}}/>
        </div>
    );
};

export default Dashboard;