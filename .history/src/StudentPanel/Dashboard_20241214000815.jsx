import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";

const Dashboard = ({data}) => {
    return (
        <div>
             <Toaster position="top-center" reverseOrder={false} />
            <div className="mb-10"><Navbar data={data}/></div>
            <Outlet/>
        </div>
    );
};

export default Dashboard;