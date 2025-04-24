/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";

const NoticeBoard = () => {
  const docimage = "https://cdn-icons-png.flaticon.com/128/2991/2991108.png";
  const downloadicon = "https://cdn-icons-png.flaticon.com/128/9131/9131795.png";
  const [noticeboard,setNoticeboard] = useState([])

  const backendApiUrl = import.meta.env.VITE_API_BASE_URL;
  const backendFileUrl = import.meta.env.VITE_FILE_BASE_URL;
  // const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

  useEffect(()=>{
    axios.get(`${backendApiUrl}/getResult`)
    .then(function (response) {
      setNoticeboard(response.data.data)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  },[])

 
  return (
    <div className="py-16">
      {noticeboard.length !=0?(
           <ul className="w-full divide-y lg:px-40 px-6 divide-gray-200">
        
           {noticeboard.map((notice, index) => (
             <li key={index} className="pb-3 sm:pb-4 w-full pt-3">
               <div className="flex items-center space-x-4 rtl:space-x-reverse w-full">
                 <div className="flex-shrink-0">
                   <img className="w-8 h-8 " src={docimage} alt="Notice" />
                 </div>
                 <div className="flex-1 min-w-0 w-full">
                  
                     <p className="text-sm font-medium text-gray-900 truncate">
                       {notice.name}
                     </p>
                   
                   <p className="text-sm text-gray-500 truncate">{notice.date}</p>
                 </div>
                 <div className="inline-flex items-center text-base font-semibold text-gray-900">
                   <a href={`${backendFileUrl}/admin/result/${notice.rFile}`} target="_blank">
                     <img className="w-7" src={downloadicon} alt="Download" />
                   </a>
                 </div>
               </div>
             </li>
           ))}
         </ul>
        ):(
          <div className="text-center text-2xl text-gray-900">No Notice Available To Show</div>
        )}
     
    </div>
  );
};

export default NoticeBoard;
