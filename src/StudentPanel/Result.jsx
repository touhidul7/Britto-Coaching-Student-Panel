/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiDownload2Fill } from "react-icons/ri";
import { useOutletContext } from "react-router-dom";

const Result = () => {
  const [results, setResults] = useState();
  const [formData, setFormData] = useState();

  const { data } = useOutletContext();
  console.log(data);

  const backendApiUrl = import.meta.env.VITE_API_BASE_URL;

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

        // Filter results based on the selected examination term and class
        const filteredResults = results.filter(
          (result) =>
            result.class === data.classname &&
            result.examination === formData.terms
        );

        if (filteredResults.length > 0) {
          setResults(filteredResults);
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

  const gpa =
    results?.length > 0 ? calculateGPA(results[0].subjects_marks) : null;

  /* Pdf Download */

  // Function to handle the PDF download
  const downloadResultAsPDF = () => {
    const resultSection = document.querySelector(".Result-Section");

    // Apply desktop styles to ensure consistent layout
    resultSection.style.width = "800px"; // Fixed width for desktop view
    resultSection.style.margin = "auto"; // Center the content

    html2canvas(resultSection, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("exam-result.pdf");

      // Reset styles to original
      resultSection.style.width = "";
      resultSection.style.margin = "";
    });
  };
  /*  */

  return (
    <div className="container mx-auto my-10">
      <div className="px-10 py-10">
        <form onSubmit={handlesearchresult}>
          <FormSection title="Select Exam Term">
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
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
          >
            Search Result
          </button>
        </form>
      </div>
      {results?.length > 0 && (
        <div className="Result Download Button w-full text-right flex justify-end p-6">
          <button
            onClick={downloadResultAsPDF}
            className="w-fit text-md flex gap-2 items-center font-bold "
          >
            Download <RiDownload2Fill size={25} />
          </button>
        </div>
      )}

      {/* Result Section */}
      <div className="Result-Section p-6">
        {/* Result Header */}
        <div className="bg-gray-100 p-5 rounded-lg mb-8 text-center">
          <h1 className="text-xl font-bold">
            Medha Bikash Shishu Niketan & Quran Academy Exam Result
          </h1>
        </div>

        {/* Student Information */}
        <div className="mb-12 px-8 md:px-16">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Left Column */}
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex items-center border border-gray-300 p-4 rounded-md">
                <span className="w-1/2 font-medium">Father's Name</span>
                <span className="w-1/2 text-left">
                  <b>:</b> {data.fatherNameEn}
                </span>
              </div>
              <div className="flex items-center border border-gray-300 p-4 rounded-md">
                <span className="w-1/2 font-medium">Mother's Name</span>
                <span className="w-1/2 text-left">
                  <b>:</b> {data.motherNameEn}
                </span>
              </div>
              <div className="flex items-center border border-gray-300 p-4 rounded-md">
                <span className="w-1/2 font-medium">Date of Birth</span>
                <span className="w-1/2 text-left">
                  <b>:</b> {data.dob}
                </span>
              </div>
              <div className="flex items-center border border-gray-300 p-4 rounded-md">
                <span className="w-1/2 font-medium">Institute</span>
                <span className="w-1/2 text-left">
                  <b>:</b> Medha Bikash
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex items-center border border-gray-300 p-4 rounded-md">
                <span className="w-1/2 font-medium">Student's Name</span>
                <span className="w-1/2 text-left">
                  <b>:</b> {data.studentNameEn}
                </span>
              </div>
              <div className="flex items-center border border-gray-300 p-4 rounded-md">
                <span className="w-1/2 font-medium">Roll No</span>
                <span className="w-1/2 text-left">
                  <b>:</b> {data.studentId}
                </span>
              </div>
              <div className="flex items-center border border-gray-300 p-4 rounded-md">
                <span className="w-1/2 font-medium">Student Class</span>
                <span className="w-1/2 text-left">
                  <b>:</b> {data.classname}
                </span>
              </div>
              <div className="flex items-center border border-gray-300 p-4 rounded-md">
                <span className="w-1/2 font-medium">Result (GPA)</span>
                <span className="w-1/2 text-left">
                  <b>: </b>
                  {gpa ? `${gpa} (A+)` : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* GPA Information */}
        <div className="alert alert-info text-center bg-blue-100 mb-6 text-blue-800 p-4 rounded-md">
          <h3 className="text-center text-xl font-semibold ">Mark Sheet</h3>
        </div>

        {/* Grade Sheet Table */}

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-6 text-center">Serial No</th>
                <th className="py-3 px-6 text-center">Subject</th>
                <th className="py-3 px-6 text-center">Marks</th>
                <th className="py-3 px-6 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {results?.length > 0 ? (
                Object.entries(results[0].subjects_marks).map(
                  ([subject, marks], index) => {
                    const grade = calculateGrade(Number(marks));
                    return (
                      <tr
                        className="text-center border-t border-gray-200"
                        key={index}
                      >
                        <td className="border px-6 py-4">{index + 1}</td>
                        <td className="border px-6 py-4">{subject}</td>
                        <td className="border px-6 py-4">{marks}</td>
                        <td className="border px-6 py-4">{grade}</td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td colSpan="4" className="text-center border px-6 py-4">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search Again Button */}
      <div className="text-center mt-8">
        <a
          href="#"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Search Again
        </a>
      </div>
    </div>
  );
};

export default Result;

const FormSection = ({ title, children }) => (
  <fieldset className="border border-green-600 p-4 mb-4 flex flex-col justify-end">
    <legend className="px-2 text-lg text-green-700">{title}</legend>
    <div className="grid grid-cols-1 gap-4">{children}</div>
  </fieldset>
);
