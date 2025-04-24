import { useState } from "react";
import FormSection from "../Components/FormSection";
import SelectField from "../Components/SelectField";
import InputField from "../Components/InputField";

const PayFee = () => {
  const [studentID, setStudentID] = useState("");
  const [classname, setClassname] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const classOptions = [
    { label: "Select Class", value: "" },
    { label: "Class 1", value: "class 1" },
    { label: "Class 2", value: "class 2" },
    { label: "Class 3", value: "class 3" },
    { label: "Class 4", value: "class 4" },
    { label: "Class 5", value: "class 5" },
    { label: "Class 6", value: "class 6" },
    { label: "Class 7", value: "class 7" },
  ];

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
      if (foundStudent && foundStudent.classname === classname) {
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
  };
  

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-8">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-center mb-4">
          Search Student Details
        </h2>
        <div>
          <FormSection title="Student Information">
            <InputField
              label="Student ID"
              name="studentid"
              onChange={(e) => setStudentID(e.target.value)}
            />

            <SelectField
              label="Select Class"
              name="classname"
              options={classOptions}
              value={classname || ""} // Pass the current value from formData
              onChange={(e) => setClassname(e.target.value)}
            />
          </FormSection>
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
                  : {studentDetails.studentid || "N/A"}
                </div>
              </div>
              <div className="flex justify-between items-center border border-gray-200 px-6 py-2 rounded-md">
                <div className="text-lg font-bold ">Student Class</div>
                <div className="text-lg capitalize w-64 ">
                  : {studentDetails.classname || "N/A"}
                </div>
              </div>
              <div className="flex justify-between items-center border border-gray-200 px-6 py-2 rounded-md">
                <div className="text-lg font-bold ">Monthly Fee</div>
                <div className="text-lg w-64">: 1000</div>
              </div>
              <form>
                <FormSection title="Payment Information">
                  <SelectField
                    label="Select Payment"
                    name="paymentmethod"
                    options={PaymentOptions}
                  />
                  <InputField
                    label="Payment Phone Number"
                    name="pyamentnumber"
                  />
                  <InputField label="Transaction ID" name="trxid" />
                  <InputField
                    label="Select Month"
                    name="feemonth"
                    type="month"
                  />
                </FormSection>
                <button
                  onClick={handleSearch}
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
