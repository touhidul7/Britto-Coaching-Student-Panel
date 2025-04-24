/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { useOutletContext } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./testimonial.css";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InputField from "../Components/InputField";

const AdmitCard = () => {
  const { data } = useOutletContext();
  const [classes, setClasses] = useState(null);
  const [formData, setFormData] = useState();
  const [terms, setTerms] = useState([]);
  const [studentID, setStudentID] = useState();
  const [date, setDate] = useState();
  const [feeStatus, setFeeStatus] = useState();
  const [error, setError] = useState();

  const backendApiUrl = import.meta.env.VITE_API_BASE_URL;

  /* Term Name Input */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /* Verify Fee Payment */

  const handleSearch = () => {
    axios
      .get(
        `${backendApiUrl}/student/getExamFee/${data.studentId}/${date}`
      )
      .then(function (response) {
        // handle success
        setFeeStatus(response.data.examFees);
        toast.success("Admit Card Generated Successfully")
      })
      .catch(function (error) {
        // handle error
        setError("No Data Found");
        toast.error("Exam Fee Not Paid Or Exam Not Found");
        setFeeStatus('')
      });

    // setSubmitData(false);
  };

  console.log(feeStatus);

  /* ------------------------ */

  /* Fetch Data From Backend */

  useEffect(() => {
    axios
      .get(`${backendApiUrl}/getExamName`)
      .then(function (response) {
        setTerms(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Result Not Found");
      });
    axios
      .get(`${backendApiUrl}/getCourse/${data.classname}`)
      .then(function (response) {
        setClasses(response.data.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, [backendApiUrl]);

  // Function to handle the PDF download
  const downloadResultAsPDF = () => {
    const resultSection = document.querySelector(".testimonial");

    // Ensure content is fully visible
    resultSection.style.width = "1000px"; // Adjust width for landscape layout
    resultSection.style.height = "710px"; // Adjust width for landscape layout
    resultSection.style.margin = "auto"; // Center the content
    resultSection.style.overflow = "visible"; // Ensure nothing is hidden

    html2canvas(resultSection, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Initialize jsPDF in landscape mode
      const pdf = new jsPDF("l", "mm", "a4"); // 'l' specifies landscape

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add image to the PDF and scale it to fit the page
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("admitcard.pdf");

      // Reset styles to original
      resultSection.style.width = "";
      resultSection.style.margin = "";
      resultSection.style.overflow = "";
    });
  };

  /*  */
  return (
    <>
      <div className="px-10 py-10 lg:w-[70%] m-auto">
        <form>
          <FormSection title="Generate Admit Card">
            <InputField
              label="Exam Time"
              name="date"
              type="month"
              onChange={(e) => setDate(e.target.value)}
            />
            <div>
              <label htmlFor="classname" className="block mb-1">
                Select Exam Terms
              </label>
              <select
                name="terms"
                id="terms"
                className="w-full border rounded px-2 py-1"
                onChange={handleInputChange}
              >
                <option value="">Select Exams Terms</option>
                {terms?.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </FormSection>
        </form>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
        >
          Generate Admit Card
        </button>
      </div>
      {feeStatus && feeStatus ? (
        <div className=" min-h-screen flex flex-col items-center justify-center">
        <div className="w-[1000px] flex flex-col justify-between h-[710px] mx-auto mt-5 border-[15px] border-[#15803D] p-10 bg-transparent shadow-lg relative testimonial">
          <div className="absolute inset-[15px] border-2 border-[#15803D] -z-10"></div>
          <div>
            <div className="text-center mb-2">
              {/* <img
         src="./logo.jpg"
         alt="Bangladesh Logo"
         className="w-[70px] mx-auto mb-3"
       /> */}
              <h1 className="text-[#2DB75B] text-[30px] leading-tight font-semibold m-0 p-0 -mt-4">
                মেধা বিকাশ শিশু নিকেতন এন্ড কোরআন একাডেমি
              </h1>
              <h1 className="text-[#1A56DB] text-[22px] font-semibold -mt-2">
                Medha Bikash Shisho Niketan And Quran Academy
              </h1>
              <div className="text-center  font-[450] text-md">
                <p>
                  স্থাপিতঃ ২০<span className="font-poppins">১</span>৮ ইং,
                </p>
                <p>বিদ্যালয় কোডঃ ৭০৫০৮৩৩২০</p>
                <p>৩৩ নং ওয়ার্ড মহানগর, রংপুর।</p>
              </div>
            </div>
            <div className="idcard-content">
              <div className="text-center flex flex-col items-center justify-center">
                <p className="text-center text-xl font-semibold">
                  {formData?.terms}
                </p>
                <h2 className="text-purple-700 text-[1.3rem] w-fit font-medium text-center pt-1 px-5 rounded-md ">
                  প্রশংসা পত্র
                </h2>
              </div>
              <div className="flex w-full justify-between">
                {/* Information Col 1 */}
                <div className=" flex flex-col justify-start w-[40%] gap-2">
                  <div className="flex items-center">
                    <span className="w-1/2 font-bold">Student Name</span>
                    <span className="w-1/2 text-left">
                      <b>:</b> {data.studentNameEn}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-1/2 font-bold">Father's Name</span>
                    <span className="w-1/2 text-left">
                      <b>:</b> {data.fatherNameEn}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-1/2 font-bold">Mother's Name</span>
                    <span className="w-1/2 text-left">
                      <b>:</b> {data.motherNameEn}
                    </span>
                  </div>
                </div>
                {/* Information Col 2 */}

                <div className=" flex flex-col justify-start w-[40%] gap-2">
                  <div className="flex items-center">
                    <span className="w-1/2 font-bold">ID</span>
                    <span className="w-1/2 text-left">
                      <b>:</b> {data.studentId}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-1/2 font-bold">Gender</span>
                    <span className="w-1/2 text-left">
                      <b>:</b> {data.gender}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-1/2 font-bold">Student Class</span>
                    <span className="w-1/2 text-left">
                      <b>:</b> {data.classname}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="subjects-section flex flex-col justify-center w-full">
            <div className="heading text-center text-xl font-bold pb-4">
              NAME OF SUBJECTS
            </div>
            {/* Make the grid box contents center course*/}
            <div className="subjects grid grid-cols-3 gap-2">
              {classes?.map((courses, i) => (
                <div key={i} className="w-3/3 text-left font-medium">
                  {courses.course}
                </div>
              ))}
            </div>
          </div>

          <div className="">
            <div className="Content pt-2">
              <div className="hading font-bold mb-1">Directions:</div>
              <div className=" pl-4">
                <p>
                  1. The Examinee must bring the Admit Card in the Examination
                  Hall and without any electronic device.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <div className="text-center border-t border-black pt-2 w-[40%]">
                <strong>পরিচালক</strong>
                <br />
                মেধা বিকাশ শিশু নিকেতন
              </div>
              <div className="text-center border-t border-black pt-2 w-[40%]">
                <strong>প্রধান শিক্ষক</strong>
                <br />
                মেধা বিকাশ শিশু নিকেতন
              </div>
            </div>
          </div>
        </div>
        <button
          className="py-2 px-6 rounded-lg bg-[#2450c0] hover:bg-[#2a478f] text-white my-8"
          onClick={downloadResultAsPDF}
        >
          Download
        </button>
      </div>
      ) : (
        <div className="text-center text-lg font-bold">Fee Not Paid Or Exam Not Available</div>
      )}
    </>
  );
};

export default AdmitCard;
const FormSection = ({ title, children }) => (
  <fieldset className="border border-green-600 p-4 mb-4 flex flex-col justify-end">
    <legend className="px-2 text-lg text-green-700">{title}</legend>
    <div className="grid grid-cols-1 gap-4">{children}</div>
  </fieldset>
);
