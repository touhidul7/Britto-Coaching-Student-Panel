/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";

const Result = () => {
  const [results, setResults] = useState();
  const [formData, setFormData] = useState();

  const { data } = useOutletContext();
  const backendApiUrl = import.meta.env.VITE_API_BASE_URL;

  const calculateGrade = (marks) => {
    if (marks >= 80) return 'A';
    if (marks >= 60) return 'B';
    if (marks >= 40) return 'C';
    if (marks >= 20) return 'D';
    return 'F';
  };


  const [terms, setTerms] = useState([]);
  /* Get Term */
  useEffect(() => {
    axios
      .get(`${backendApiUrl}/getExamName`)
      .then(function (response) {
        setTerms(response.data.data);
        //toast.success("Successfully Loaded Data!");
      })
      .catch(function (error) {
        // handle error
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
        console.log('API Response:', response.data); // Log the full response
  
        const results = response.data.data; // Array of results
  
        // Filter results based on the selected examination term and class
        const filteredResults = results.filter(
          (result) => result.class === data.classname && result.examination === formData.terms
        );
  
        if (filteredResults.length > 0) {
          setResults(filteredResults);  // Set the filtered results
          toast.success("Successfully Loaded Data!");
        } else {
          setResults([]);  // Clear results if no match
          toast.error("No results found for the selected term and class.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Result Not Found");
      });
  }
  
  
  

  console.log(results);


  /* check result end */

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
                {
                  terms?.map(item => {
                    return (
                      <option key={item.id} value={item.name}>{item.name} </option>
                    )
                  })
                }

                {/* {terms.map((term, index) => (
                  <option key={index} value={term.examination}>{term.examination} </option>
                ))} */}

              </select>
            </div>
          </FormSection>
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full">Search Result</button>
        </form>
      </div>

      {/* Result Header */}
      <div className="bg-gray-100 p-5 rounded-lg mb-8 text-center">
        <h1 className="text-xl font-bold">Your Exam Results</h1>
      </div>

      {/* Student Information */}
      {/* Student Information */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 px-8 md:px-16">
          {/* Left Column */}
          <div className="w-full md:w-1/2 space-y-4">
            <p className="text-lg font-medium">
              <strong>Father's Name:</strong> {data.fatherNameEn}
            </p>
            <p className="text-lg font-medium">
              <strong>Mother's Name:</strong> {data.motherNameEn}
            </p>
            <p className="text-lg font-medium">
              <strong>Date of Birth:</strong> {data.dob} {/* Update with correct data field */}
            </p>
            <p className="text-lg font-medium">
              <strong>Institute:</strong> Medha Bikash
            </p>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 space-y-4">
            <p className="text-lg font-medium">
              <strong>Student's Name:</strong> {data.studentNameEn}
            </p>
            <p className="text-lg font-medium">
              <strong>Roll No:</strong> {data.studentId}
            </p>
            <p className="text-lg font-medium">
              <strong>Student Status:</strong> {data.status === 0 ? "Pending" : "Active"}
            </p>
            <p className="text-lg font-medium">
              <strong>Result:</strong> {/* Add dynamic result status here */}
            </p>
          </div>
        </div>
      </div>


      {/* GPA Information */}
      <div className="alert alert-info text-center bg-blue-100 text-blue-800 p-4 rounded-md">
        <strong>GPA:</strong>
      </div>

      {/* Grade Sheet Table */}
      <h3 className="text-center text-xl font-semibold mb-6">Grade Sheet</h3>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Serial No</th>
              <th className="py-3 px-6 text-left">Subject</th>
              <th className="py-3 px-6 text-left">Marks</th>
              <th className="py-3 px-6 text-left">Grade</th>
            </tr>
          </thead>
          <tbody>
            {results?.length > 0 ? (
              Object.entries(results[0].subjects_marks).map(([subject, marks], index) => {
                const grade = calculateGrade(Number(marks)); // Calculate grade
                return (
                  <tr className="text-center border-t border-gray-200" key={index}>
                    <td className="border px-6 py-4">{index + 1}</td>
                    <td className="border px-6 py-4">{subject}</td>
                    <td className="border px-6 py-4">{marks}</td>
                    <td className="border px-6 py-4">{grade}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center border px-6 py-4">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
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