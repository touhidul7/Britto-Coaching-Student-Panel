/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import SelectField from "../Components/SelectField";
import InputField from "../Components/InputField";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

const PayFee = () => {
  const [studentID, setStudentID] = useState("");
  const [result, setResult] = useState("");
  // const [classname, setClassname] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({});
  const [invoiceNumber, setInvoiceNumber] = useState("");
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

  const generateInvoice = (invoiceNo, studentID, formData, studentDetails) => {
    const doc = new jsPDF();

    // Header Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", 105, 20, { align: "center" });

    // Company Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Medha Bikash Shishu Niketan & Quran Academy", 20, 30);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Hosen Nagar Road, Azizullah, Ward No. 33, Metropolis, Rangpur.",
      20,
      35
    );
    doc.text("Phone: +880 1717084442", 20, 45);
    doc.text("Email: mbsn2918@gmail.com", 20, 50);

    // Invoice Details
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice Number: ${invoiceNo}`, 140, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 35);
    doc.text(`Student ID: ${studentID}`, 140, 40);

    // Separator Line
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);

    // Student and Course Information
    doc.setFont("helvetica", "bold");
    doc.text("Student Information", 20, 65);

    doc.setFont("helvetica", "normal");
    // Aligning Student Name
    doc.text(`Student Name: ${studentDetails.studentNameEn || "N/A"}`, 20, 75);

    // Aligning Phone Number
    doc.text(`Phone: ${studentDetails.motherMobile || "N/A"}`, 20, 85);

    // Student details in two columns
    const colX = 150; // Second column starts here (for aligning data)
    doc.text(`Class Name: ${studentDetails.classname || "N/A"}`, colX, 65);
    doc.text(`Transaction ID: ${formData.pDetails || "N/A"}`, 140, 50);
    doc.text(`Amount of Fee: ${formData.amount || "N/A"}`, colX, 75);
    doc.text(`Fee Month: ${formData.cDate || "N/A"}`, colX, 85);

    // Table Header
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, 110);
    doc.text("Amount", 170, 110);

    // Table Data
    doc.setFont("helvetica", "normal");
    doc.text("Amount of Fee", 20, 120);
    doc.text(`${formData.amount || "N/A"} BDT`, 170, 120);

    // Separator Line
    doc.line(20, 130, 190, 130);

    // Total
    doc.setFont("helvetica", "bold");
    doc.text("Total", 20, 140);
    doc.text(`${formData.amount || "N/A"} BDT`, 170, 140);

    // Footer Section
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for choosing our services.", 105, 160, {
      align: "center",
    });

    doc.save("Invoice.pdf");
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const dateString = date.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD format
    const randomNum = Math.floor(Math.random() * 10000); // Generates a random 4-digit number
    const newInvoiceNumber = `INV-${dateString}-${randomNum}`;
    setInvoiceNumber(newInvoiceNumber);
  };

  useEffect(() => {
    generateInvoiceNumber();
  }, []);

  const handleSearch = async () => {

    try {
      // Make a request to your API with the student ID
      const response = await fetch(
        `http://127.0.0.1:8000/api/students/admission/${studentID}`
      );

      // Check if the response is successful
      if (!response.ok) {
        toast.error("No student found with the provided ID and class.");
        throw new Error("No student found with the provided ID and class.");
      }

      // Parse the JSON response
      const data = await response.json();

      // Assuming the structure of the response is: { student: { ...studentDetails } }
      const foundStudent = data.student;
    }




















    toast("searching...");
    try {
      // Make a request to your API with the student ID
      const response = await fetch(
        `http://127.0.0.1:8000/api/students/admission/${studentID}`
      );

      // Check if the response is successful
      if (!response.ok) {
        toast.error("No student found with the provided ID and class.");
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
        toast.success("Student Data Loaded Successfuly!");
        setErrorMessage("");
      } else {
        setStudentDetails(null);
        toast.error("No student found with the provided ID and class.");
        setErrorMessage("No student found with the provided ID and class.");
      }
    } catch (error) {
      setStudentDetails(null);
      toast.error("No student found with the provided ID and class.");
      setErrorMessage(
        error.message || "An error occurred while fetching data."
      );
    }
    console.log(studentDetails);
  };

  // collect feeeeeee ###########################

  const feeHandle = async (e) => {
    toast("Submiting Fee Request...");
    e.preventDefault();
    // Prepare data to send via Web3Forms
    const web3FormData = new FormData();
    web3FormData.append("access_key", "f5d5e90f-6ea7-455b-b93a-9819968e2790");
    web3FormData.append("studentName", studentDetails.studentNameEn || "N/A");
    web3FormData.append("studentId", studentID || "N/A");
    web3FormData.append("paymentMethod", formData.pType || "N/A");
    web3FormData.append("paymentNumber", formData.pRef || "N/A");
    web3FormData.append("transactionId", studentDetails.trxid || "N/A");
    web3FormData.append("amount", formData.amount || "N/A");
    web3FormData.append("className", studentDetails.classname || "N/A");

    try {
      setResult("Sending...");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3FormData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        toast.success("Data sent to Web3Forms!");
        console.log("Web3Forms Response:", data);
      } else {
        setResult("Failed to submit the form.");
        console.error("Web3Forms Error:", data);
      }
    } catch (error) {
      setResult("An error occurred during submission.");
      toast.error("An error occurred while sending data to Web3Forms.");
      console.error("Web3Forms Submission Error:", error);
    }
    try {
      const finalFormData = {
        ...formData,
        stdName: studentDetails.studentNameEn,
        roll: studentID,
        course: studentDetails.classname,
      };
      const formDataToSend = new FormData();
      Object.entries(finalFormData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      console.log(formDataToSend);

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
        generateInvoice(invoiceNumber, studentID, formData, studentDetails);
      } else {
        toast.error("Failed to submit the form.");
      }
    } catch (error) {
      toast.error("An error occurred during local submission.");
      console.error("Submission Error:", error);
    }

    generateInvoiceNumber();
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-8">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-center mb-4">
          Search Student Details
        </h2>
        <div>
          <form className="p-6">
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
              <form onSubmit={feeHandle}>
                <input type="hidden" name="subject" value="Monthly Fee" />
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
                  type="submit"
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
