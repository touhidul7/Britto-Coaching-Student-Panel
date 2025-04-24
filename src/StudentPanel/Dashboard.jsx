import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import  { Toaster } from "react-hot-toast";


// eslint-disable-next-line react/prop-types
const Dashboard = ({ data }) => {
    
    

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="mb-20"><Navbar data={data} /></div>
            <Outlet context={{ data }} />
        </div>
    );
};

export default Dashboard;