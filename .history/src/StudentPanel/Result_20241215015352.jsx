/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";

const Result = () => {
  const [results, setResults] = useState([]); // Initialize as empty array
  const [formData, setFormData] = useState({
    terms: "", // to hold the selected term
  });

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

  // Get Exam Terms
  useEffect(() => {
    axios
      .get(`${backendApiUrl}/getExamName`)
      .then(function (response) {
        setTerms(response.data.data); // Set terms from API response
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Result Not Found");
      });
  }, [backendApiUrl]);

  // Handle input change for selecting exam term
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle searching result
  const handlesearchresult = (e) => {
    e.preventDefault();

    if (!formData.terms) {
      toast.error("Please select an exam term.");
      return;
    }

    axios
      .get(`${backendApiUrl}/getExamResult/${data.studentId}/${data.classname}`)
      .then(function (response) {
        // Filter results based on selected examination term
        const filteredResults = response.data.data.filter(
          (result) => result.examination === formData.terms
        );
        setResults(filteredResults); // Set filtered results
        toast.success("Successfully Loaded Data!");
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Result Not Found");
      });
  };

  return (
    <div className="container mx-auto my-10">
      <div className="px-10 py-10">
        <form onSubmit={handlesearchresult}>
          <FormSection title="Select Exam Term">
            <div>
              <label htmlFor="terms" className="block mb-1">
                Select Exam Terms
              </label>
              <select
                name="terms"
                id="terms"
                className="w-full border rounded px-2 py-1"
                onChange={handleInputChange}
                value={formData.terms} // Bind value for controlled input
              >
                <option value="">Select Exam Terms</option>
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

      {/* Result Header */}
      <div className="bg-gray-100 p-5 rounded-lg mb-8 text-center">
        <h1 className="text-xl font-bold">Your Exam Results</h1>
      </div>

      {/* Student Information */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 px-8 md:px-16">
          <div className="w-full md:w-1/2 space-y-4">
            <p className="text-lg font-medium">
              <strong>Father's Name:</strong> {data.fatherNameEn}
            </p>
            <p className="text-lg font-medium">
              <strong>Mother's Name:</strong> {data.motherNameEn}
            </p>
            <p className="text-lg font-medium">
              <strong>Date of Birth:</strong> {data.dob}
            </p>
            <p className="text-lg font-medium">
              <strong>Institute:</strong> Medha Bikash
            </p>
          </div>
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
              <strong>Result:</strong>
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
        <table className="table-auto w-full border border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">Examination</th>
              <th className="py-2 px-4">Subject</th>
              <th className="py-2 px-4">Grade</th>
            </tr>
          </thead>
          <tbody>
            {results?.map((result, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{result.examination}</td>
                {Object.entries(result.subjects_marks).map(([subject, mark], index) => (
                  <React.Fragment key={index}>
                    <td className="border px-4 py-2">{subject}</td>
                    <td className="border px-4 py-2">{calculateGrade(mark)}</td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Search Again Button */}
      <div className="text-center mt-8">
        <a href="#" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
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
