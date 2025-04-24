import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NoticeBoard = () => {
  const docimage = "https://cdn-icons-png.flaticon.com/128/2991/2991108.png";
  const downloadicon = "https://cdn-icons-png.flaticon.com/128/9131/9131795.png";
  const [noticeboard,setNoticeboard] = useState([])

  useEffect(()=>{
    axios.get(`http://192.168.1.9:8000/api/students/admission/${username}`)
    .then(function (response) {
      setNoticeboard(response.data.data)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  },[])

 /*  const noticeboard = [
    {
      title: "মধ্যবর্তী পরীক্ষার সময়সূচি প্রকাশিত",
      link: "https://schoolwebsite.com/notices/mid-term-exam-schedule",
      date: "২০২৪-১২-১০",
    },
    {
      title: "অভিভাবক-শিক্ষক সভার স্মরণিকার বার্তা",
      link: "https://schoolwebsite.com/notices/parent-teacher-meeting",
      date: "২০২৪-১২-০৮",
    },
    {
      title: "শীতকালীন ছুটির ঘোষণা",
      link: "https://schoolwebsite.com/notices/winter-vacation",
      date: "২০২৪-১২-১৫",
    },
    {
      title: "বার্ষিক ক্রীড়া প্রতিযোগিতার নিবন্ধন শুরু",
      link: "https://schoolwebsite.com/notices/sports-day-registration",
      date: "২০২৪-১২-১২",
    },
    {
      title: "বিজ্ঞান মেলার নির্দেশিকা",
      link: "https://schoolwebsite.com/notices/science-fair-guidelines",
      date: "২০২৪-১২-০৫",
    },
  ]; */

  return (
    <div className="py-16">
      <ul className="w-full divide-y px-40 divide-gray-200">
        {noticeboard.map((notice, index) => (
          <li key={index} className="pb-3 sm:pb-4 w-full pt-3">
            <div className="flex items-center space-x-4 rtl:space-x-reverse w-full">
              <div className="flex-shrink-0">
                <img className="w-8 h-8 rounded-full" src={docimage} alt="Notice" />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <Link to={notice.link}>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {notice.title}
                  </p>
                </Link>
                <p className="text-sm text-gray-500 truncate">{notice.date}</p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900">
                <button>
                  <img className="w-7" src={downloadicon} alt="Download" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoticeBoard;
