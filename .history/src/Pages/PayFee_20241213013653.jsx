/* eslint-disable react/prop-types */
import { useState } from "react";
import SelectField from "../Components/SelectField";
import InputField from "../Components/InputField";
import axios from "axios";
import toast from "react-hot-toast";

const PayFee = () => {
  const [studentID, setStudentID] = useState("");
  // const [classname, setClassname] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const PaymentOptions = [
    { label: "Select Payment", value: "" },
    { label: "Bkash", value: "bkash" },
    { label: "Nagad", value: "nagad" },
    { label: "Cash", value: "cash" },
  ];

  const handleSearch = async () => {
    try {
      // Make a request to your API with the student ID
      const response = await fetch(`http://127.0.0.1:8000/api/students/admission/${studentID}`);

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("No student found with the provided ID and class.");
      }


      // Parse the JSON response
      const data = await response.json();

      // Assuming the structure of the response is: { student: { ...studentDetails } }
      const foundStudent = data.student;
      console.log(foundStudent);
      // Check if the student exists and if the class matches
      if (foundStudent) {
        setStudentDetails(foundStudent);
        setErrorMessage("");
      } else {
        setStudentDetails(null);
        setErrorMessage("No student found with the provided ID and class.");
      }
    } catch (error) {
      setStudentDetails(null);
      setErrorMessage(error.message || "An error occurred while fetching data.");
    }
    console.log(studentDetails);

  };

  const feeHandle = async () =>{
    try {
      const finalFormData = { ...formData, stdName: studentDetails.studentNameEn, roll: studentID };
      const formDataToSend = new FormData();
      Object.entries(finalFormData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
  
      const response = await axios.post(
        "http://127.0.0.1:8000/api/students/fee",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.data.success) {
        toast.success("Fees Payment successfully!");
      } else {
        toast.error("Failed to submit the form.");
      }
    } catch (error) {
      toast.error("An error occurred during local submission.");
      console.error("Submission Error:", error);
    }
  }


  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-8">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-center mb-4">
          Search Student Details
        </h2>
        <div>
        <form className="p-6" onSubmit={feeHandle}>
          <FormSection title="Student Information">
            <InputField
              label="Student ID"
              name="studentid"
              onChange={(e) => setStudentID(e.target.value)}
            />
          </FormSection>
          </form>
          {/*  */}
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
        >
          Search
        </button>
        <div className="details py-6">
          {errorMessage && (
            <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
          )}

          {studentDetails && (
            <div className="flex flex-col justify-start gap-2">
              <div className="flex justify-between items-center border border-gray-200 px-6 py-2 rounded-md">
                <div className="text-lg font-bold ">Name</div>
                <div className="text-lg w-64">
                  : {studentDetails.studentNameEn || "N/A"}
                </div>
              </div>
              <div className="flex justify-between items-center border border-gray-200 px-6 py-2 rounded-md">
                <div className="text-lg font-bold ">Phone</div>
                <div className="text-lg w-64">
                  : {studentDetails.motherMobile || "N/A"}
                </div>
              </div>
              <div className="flex justify-between items-center border border-gray-200 px-6 py-2 rounded-md">
                <div className="text-lg font-bold ">Student ID</div>
                <div className="text-lg w-64">
                  : {studentDetails.studentId || "N/A"}
                </div>
              </div>
              <div className="flex justify-between items-center border border-gray-200 px-6 py-2 rounded-md">
                <div className="text-lg font-bold ">Student Class</div>
                <div className="text-lg capitalize w-64 ">
                  : {studentDetails.classname || "N/A"}
                </div>
              </div>
              {/* <div className="flex justify-between items-center border border-gray-200 px-6 py-2 rounded-md">
                <div className="text-lg font-bold ">Monthly Fee</div>
                <div className="text-lg w-64">: 1000</div>
              </div> */}
              <form>
                <FormSection title="Payment Information">
                  <SelectField
                    label="Select Payment"
                    name="pType"
                    options={PaymentOptions}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Payment Phone Number"
                    name="pRef"
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Fee Amount"
                    name="amount"
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Transaction ID"
                    name="pDetails" 
                    onChange={handleInputChange}
                    />
                  <InputField
                    label="Select Month"
                    name="cDate"
                    type="month"
                    onChange={handleInputChange}
                  />
                </FormSection>
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
                >
                  Submit Payment
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayFee;


const FormSection = ({ title, children }) => (
  <fieldset className="border border-green-600 p-4 mb-4">
    <legend className="px-2 text-lg text-green-700">{title}</legend>
    <div className="grid grid-cols-1 gap-4">{children}</div>
  </fieldset>
);