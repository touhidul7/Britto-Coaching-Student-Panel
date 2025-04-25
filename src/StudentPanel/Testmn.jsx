/* eslint-disable react/prop-types */
import { useOutletContext } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./testimonial.css";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Testmn = () => {
  const backendApiUrl = import.meta.env.VITE_API_BASE_URL;
  const { data } = useOutletContext();

  /* --------------------------------------------------- */

  const [results, setResults] = useState();
  const [formData, setFormData] = useState();

  const calculateGrade = (marks) => {
    if (marks >= 80) return "A+";
    if (marks >= 70) return "A";
    if (marks >= 60) return "B";
    if (marks >= 40) return "C";
    if (marks >= 33) return "D";
    return "F";
  };

  const getGradePoint = (grade) => {
    switch (grade) {
      case "A+":
        return 5.0;
      case "A":
        return 4.0;
      case "B":
        return 3.0;
      case "C":
        return 2.0;
      case "D":
        return 1.0;
      case "F":
        return 0.0;
      default:
        return 0.0;
    }
  }; 

  const calculateGPA = (subjectsMarks) => {
    if (!subjectsMarks) return 0;

    const totalPoints = Object.values(subjectsMarks).reduce((sum, marks) => {
      const grade = calculateGrade(Number(marks));
      return sum + getGradePoint(grade);
    }, 0);

    return (totalPoints / Object.keys(subjectsMarks).length).toFixed(2); // Round GPA to 2 decimal places
  };

  const [terms, setTerms] = useState([]);
  /* Get Term */
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
  }, [backendApiUrl]);

  // get input data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /* Check Result Section-------------- */
  function handlesearchresult(e) {
    e.preventDefault();
    axios
      .get(`${backendApiUrl}/getExamResult/${data.studentId}`)
      .then(function (response) {
        const results = response.data.data;
        console.log(response.data.data);

        // Filter results based on the selected examination term and class
        const filteredResults = results.filter(
          (result) =>
            result.class === data.classname &&
            result.examination === formData.terms
        );

        if (filteredResults.length > 0) {
          setResults(filteredResults);
          console.log(filteredResults);
          toast.success("Successfully Loaded Data!");
        } else {
          setResults([]);
          toast.error("No results found for the selected term and class.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Result Not Found");
      });
  }

  const gpa = results?.length > 0 ? calculateGPA(results[0].subjects_marks) : null;

  /* -------------------------------------------------- */

  /* Pdf Download */

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
      pdf.save("testimonial.pdf");

      // Reset styles to original
      resultSection.style.width = "";
      resultSection.style.margin = "";
      resultSection.style.overflow = "";
    });
  };

  /*  */
  return (
    <div className=" min-h-screen flex flex-col items-center justify-cente r">
      <div className="px-10 py-10 w-full">
        <form onSubmit={handlesearchresult}>
          <FormSection title="Select Term">
            <div>
              <label htmlFor="classname" className="block mb-1">
                Select Terms
              </label>
              <select
                name="terms"
                id="terms"
                className="w-full border rounded px-2 py-1"
                onChange={handleInputChange}
              >
                <option value="">Select Terms</option>
                {terms?.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </FormSection>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
          >
            Apply for Testimonial
          </button>
        </form>
      </div>
      {results?.length > 0 && (
        <div>
          <div className="w-[1000px] h-[710px] mx-auto mt-5 border-[15px] border-[#15803D] p-10 bg-transparent shadow-lg relative testimonial">
            <div className="absolute inset-[15px] border-2 border-[#15803D] -z-10"></div>
            <div className="text-center mb-5">
              {/* <img
            src="./logo.jpg"
            alt="Bangladesh Logo"
            className="w-[70px] mx-auto mb-3"
          /> */}
              <h1 className="text-[#2DB75B] text-[30px] leading-tight font-semibold mb-">
                মেধা বিকাশ শিশু নিকেতন এন্ড কুরআন একাডেমি
              </h1>
              <h1 className="text-[#1A56DB] text-[25px] font-semibold my-1">
                Medha Bikash Shishoo Nikatan And Quran Academy
              </h1>
              <div className="text-center  font-[450] text-md">
                <p>
                  স্থাপিতঃ ২০<span className="font-poppins">১</span>৮ ইং,
                </p>
                <p>বিদ্যালয় কোডঃ ৭০৫০৮৩৩২০</p>
                <p>৩৩ নং ওয়ার্ড মহানগর, রংপুর।</p>
              </div>
            </div>
            <div className="text-[1rem] leading-7 text-gray-800">
              <h2 className="text-purple-700 text-[1.3rem] font-medium text-center">
                প্রশংসা পত্র
              </h2>
              <div className=" flex gap-2 flex-wrap justify-center py-20">
                <div>
                  <label className="block">
                    প্রযান করা যাচ্ছে যে, <strong>জনাব/বেশ</strong>:{" "}
                    <span className="mb-10">{data.studentNameBn}</span>
                    {/* <input
                  type="text"
                  value={data.studentNameBn}
                  placeholder="এখানে কিছু লিখুন"
                  className="border-b-dotted border-none w-[70%] outline-none p-0 pl-2 focus:outline-none focus:border-none"
                /> */}
                  </label>
                </div>
                <div>
                  <label className="block">পিতা : {data.fatherNameBn}</label>
                </div>
                <div>
                  <label className="block">মাতা : {data.motherNameBn}</label>
                </div>
                <div>
                  <label className="block">
                    গ্রাম/বাড়ি নং :{" "}
                    {data.villagePermanent +
                      ", " +
                      data.thanaPreset +
                      ", " +
                      data.distPermanent}
                  </label>
                </div>
                <p className="pl-0">
                  সে {data.classname} এ বার্ষিক পররীক্ষায় GPA {gpa} {" "}
                  {/* <input
              type="text"
              placeholder="0.00"
              className="outline-none overflow-visible border-none ring-0 focus:outline-none focus:border-none focus:ring-0 m-0 p-0 w-9 h-[30px]"
            /> {" "} */}
                  পেয়ে উত্তীর্ণ হয়েছে।
                </p>
              </div>

              <p className="pl-0 mt-3 text-center">
                আমার জানা মতে সে উত্তম চরিত্রের অধিকারী। আমি তার সর্বাঙ্গীন
                সাফল্য কামনা করি।
              </p>
            </div>
            <div className="mt-8 flex justify-between">
              <div className="text-center border-t border-black pt-2 w-[40%]">
                <strong>ভাইস প্রিন্সিপাল</strong>
                <br />
                মেধা বিকাশ শিশু নিকেতন
              </div>
              <div className="text-center border-t border-black pt-2 w-[40%]">
                <strong>প্রিন্সিপাল</strong>
                <br />
                মেধা বিকাশ শিশু নিকেতন
              </div>
            </div>
            <div className="mt-5 text-right text-sm text-gray-600">
              সপরিবেশ করা:
              ......................................................
            </div>
          </div>
          <div className="text-center">
          <button
            className="py-2 px-6 rounded-lg bg-[#2450c0] hover:bg-[#2a478f] text-white my-8"
            onClick={downloadResultAsPDF}
          >
            Download
          </button>
          </div>
        </div>
      )} 
    </div>
  );
};

export default Testmn;

const FormSection = ({ title, children }) => (
  <fieldset className="border border-green-600 p-4 mb-4 flex flex-col justify-end">
    <legend className="px-2 text-lg text-green-700">{title}</legend>
    <div className="grid grid-cols-1 gap-4">{children}</div>
  </fieldset>
);
