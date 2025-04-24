/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";

const Result = () => {
  const [resutls, setResults] = useState();
  const [formData, setFormData] = useState();

  const { data } = useOutletContext();
  console.log(data);
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
    console.log(terms);

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
      .get(`${backendApiUrl}/getExamResult/${data.studentId}/${data.classname}`)
      .then(function (response) {
        setResults(response.data.data);
        toast.success("Successfully Loaded Data!");
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        toast.error("Result Not Found");
      });
  }

  console.log(resutls);

  /* check result end */

  return (
    <div className="container mx-auto my-10">
      <div className="px-10 py-10">
        <form onSubmit={handlesearchresult}>
          <FormSection title="Select Exam Term">
            <div>
              <label htmlFor="classname" className="block mb-1">
                Select Class
              </label>
              <select
                name="Term"
                id="term"
                className="w-full border rounded px-2 py-1"
                onChange={handleInputChange}
              >
                {terms.map((term, index) => (
                  <option key={index} value={term.examination}>{term.examination} </option>
                ))}

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
      <div className="mb-8">
        <div className="flex  justify-around gap-8 w-full px-16">
          <div className="w-full md:w-1/2">
            <p>
              <strong>Father's Name:</strong>
            </p>
            <p>
              <strong>Mother's Name:{data.motherNameEn}</strong>
            </p>
            <p>
              <strong>Date of Birth: {data.fatherNameEn}</strong>
            </p>
            <p>
              <strong>Institute: Medha Bikash </strong>
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <p>
              <strong>Student's Name: {data.studentNameEn}</strong>
            </p>
            <p>
              <strong>Roll No: {data.studentId}</strong>
            </p>
            <p>
              <strong>
                Student Stutus: {data.status == 0 ? "Pending" : "Active"}
              </strong>
            </p>
            <p>
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
              <th className="py-2 px-4">Serial No</th>
              <th className="py-2 px-4">Subject</th>
              <th className="py-2 px-4">Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="border px-4 py-2">1</td>
              <td className="border px-4 py-2">BANGLA</td>
              <td className="border px-4 py-2">A-</td>
            </tr>
            <tr className="text-center">
              <td className="border px-4 py-2">2</td>
              <td className="border px-4 py-2">ENGLISH</td>
              <td className="border px-4 py-2">A-</td>
            </tr>
            <tr className="text-center">
              <td className="border px-4 py-2">3</td>
              <td className="border px-4 py-2">MATHEMATICS</td>
              <td className="border px-4 py-2">B</td>
            </tr>
            <tr className="text-center">
              <td className="border px-4 py-2">4</td>
              <td className="border px-4 py-2">
                BANGLADESH AND GLOBAL STUDIES
              </td>
              <td className="border px-4 py-2">A-</td>
            </tr>
            <tr className="text-center">
              <td className="border px-4 py-2">5</td>
              <td className="border px-4 py-2">ISLAM AND MORAL EDUCATION</td>
              <td className="border px-4 py-2">A</td>
            </tr>
            <tr className="text-center">
              <td className="border px-4 py-2">6</td>
              <td className="border px-4 py-2">SCIENCE</td>
              <td className="border px-4 py-2">A</td>
            </tr>
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