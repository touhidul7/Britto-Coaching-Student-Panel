/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import InputField from "./Components/InputField";
import SelectField from "./Components/SelectField";
import FormSection from "./Components/FormSection";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const App = () => {
  const [formData, setFormData] = useState({});
  const [studentID, setStudentID] = useState();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [result, setResult] = useState("");

  const backendApiUrl = import.meta.env.VITE_API_BASE_URL;
  /*  */
  const [classes, setClasses] = useState([]); // State to store the fetched data
  const [error, setError] = useState(null); // State to handle any errors
  const [loading, setLoading] = useState(true);

  // generate student id
  const generateNumber = () => {
    // Generate a random 6-character number
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    setStudentID(randomNumber);

    // Update the student ID in formData
    setFormData((prevData) => ({
      ...prevData,
      studentid: randomNumber,
    }));

    console.log(`Generated Random Number: ${randomNumber}`);
  };
 
  /* Fetch class data */

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${backendApiUrl}/getClass`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Assuming the API returns JSON
        setClasses(data); // Update state with the fetched data
      } catch (error) {
        setError(error.message); // Handle errors
        console.log(error.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchClasses();
  },[backendApiUrl]);

  /* Fetch class data end */

  // generate random number

  const generateInvoiceNumber = () => {
    const date = new Date();
    const dateString = date.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD format
    const randomNum = Math.floor(Math.random() * 10000); // Generates a random 4-digit number
    const newInvoiceNumber = `INV-${dateString}-${randomNum}`;
    setInvoiceNumber(newInvoiceNumber);
  };

  useEffect(() => {
    generateNumber();
    generateInvoiceNumber();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const generateInvoice = (invoiceNo, studentID, formData) => {
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
    doc.text(`Student Name: ${formData.studentNameEn || "N/A"}`, 20, 75);

    // Aligning Phone Number
    doc.text(`Phone: ${formData.motherMobile || "N/A"}`, 20, 85);

    // Student details in two columns
    const colX = 150; // Second column starts here (for aligning data)
    doc.text(`Class Name: ${formData.classname || "N/A"}`, colX, 65);
    doc.text(`Admission Fee: ${formData.amount || "N/A"}`, colX, 75);
    doc.text(`Admission Date: ${formData.admissiondate || "N/A"}`, colX, 85);

    // Table Header
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, 110);
    doc.text("Amount", 170, 110);

    // Table Data
    doc.setFont("helvetica", "normal");
    doc.text("Admission Fee", 20, 120);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send via Web3Forms
    const web3FormData = new FormData();
    web3FormData.append("access_key", "f5d5e90f-6ea7-455b-b93a-9819968e2790");
    web3FormData.append("studentName", formData.studentNameEn || "N/A");
    web3FormData.append("studentId", studentID || "N/A");
    web3FormData.append("paymentMethod", formData.paymentmethod || "N/A");
    web3FormData.append("paymentNumber", formData.pyamentnumber || "N/A");
    web3FormData.append("transactionId", formData.trxid || "N/A");
    web3FormData.append("className", formData.classname || "N/A");

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

    // Continue with other form submissions (e.g., your API)
    try {
      const finalFormData = {
        ...formData,
        invoice: invoiceNumber,
        studentId: studentID,
        session: "2024-2025",
      };
      const formDataToSend = new FormData();
      Object.entries(finalFormData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await axios.post(
        `${backendApiUrl}/students/admission`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Student record created successfully!");
      } else {
        toast.error("Failed to submit the form.");
      }
    } catch (error) {
      toast.error("An error occurred during local submission.");
      console.error("Submission Error:", error);
    }

    generateNumber();
    generateInvoiceNumber();
    generateInvoice(invoiceNumber, studentID, formData);
  };

  const genderOptions = [
    { label: "Select Gender", value: "" },
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const bloodGroupOptions = [
    { label: "N/A", value: "na" },
    { label: "A+", value: "a+" },
    { label: "B+", value: "b+" },
    { label: "AB+", value: "ab+" },
    { label: "O+", value: "o+" },
    { label: "A-", value: "a-" },
    { label: "B-", value: "b-" },
    { label: "AB-", value: "ab-" },
    { label: "O-", value: "o-" },
  ];

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
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center lg:py-8 pb-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white w-full max-w-5xl lg:rounded-lg shadow-lg p-0">
        <img className="lg:rounded-t-lg" src="./img/Form-Heading.jpg" alt="" />
        <form className="p-6" onSubmit={handleSubmit}>
          {/* Student Information */}
          <FormSection title="Student Information">
            <InputField
              label="Student Image (jpg/png)"
              type="file"
              name="studentImage"
              onChange={handleFileChange}
            />
            <InputField
              label="Student Name (English)"
              name="studentNameEn"
              onChange={handleInputChange}
            />
            <InputField
              label="Student Name (Bangla)"
              name="studentNameBn"
              onChange={handleInputChange}
            />
             <InputField
              label="Birth Certificate No."
              type="number"
              name="birthCertificate"
              onChange={handleInputChange}
            />
            <InputField
              label="Date of Birth"
              type="date"
              name="dob"
              onChange={handleInputChange}
            />
            <InputField
              label="Email (Optional)"
              requried={false}
              type="email"
              name="email"
              onChange={handleInputChange}
            />

            <SelectField
              label="Gender"
              name="gender"
              options={genderOptions}
              value={formData.gender}
              onChange={handleInputChange}
            />
            <SelectField
              label={"Blood Group"}
              name="bloodGroup"
              options={bloodGroupOptions}
              value={formData.bloodGroup}
              onChange={handleInputChange}
            />
           
            {/*  <InputField
              label="Birth Certificate (jpg / png support)"
              type="file"
              name="birthCertificateFile"
              onChange={handleFileChange}
            /> */}
          </FormSection>

          {/* Parents Information */}
          <FormSection title="Parents Information">
            <InputField
              label="Father Name (English)"
              name="fatherNameEn"
              onChange={handleInputChange}
            />
            <InputField
              label="Father Name (Bangla)"
              name="fatherNameBn"
              onChange={handleInputChange}
            />
            <InputField
              label="Mother Name (English)"
              name="motherNameEn"
              onChange={handleInputChange}
            />
            <InputField
              label="Mother Name (Bangla)"
              name="motherNameBn"
              onChange={handleInputChange}
            />
            <InputField
              label="Father Mobile Number"
              name="fatherMobile"
              onChange={handleInputChange}
            />
            <InputField
              label="Mother Mobile Number"
              name="motherMobile"
              onChange={handleInputChange}
            />
            <InputField
              label="National ID Number"
              name="nid"
              onChange={handleInputChange}
            />
            {/* <InputField
              label="Parents NID (jpg / png support)"
              type="file"
              name="parentsNidFile"
              onChange={handleFileChange}
            /> */}
          </FormSection>

          {/* Present Address */}
          <FormSection title="Present Address">
            <InputField
              label="Village/Road"
              name="villagePreset"
              onChange={handleInputChange}
            />
            <InputField
              label="Post"
              name="postPreset"
              onChange={handleInputChange}
            />
            <InputField
              label="Thana"
              name="thanaPreset"
              onChange={handleInputChange}
            />
            <InputField
              label="District"
              name="distPreset"
              onChange={handleInputChange}
            />
          </FormSection>

          <FormSection title="Permanent Address">
            <InputField
              label="Village/Road"
              name="villagePermanent"
              onChange={handleInputChange}
            />
            <InputField
              label="Post"
              name="postPermanent"
              onChange={handleInputChange}
            />
            <InputField
              label="Thana"
              name="thanaPermanent"
              onChange={handleInputChange}
            />
            <InputField
              label="District"
              name="distPermanent"
              onChange={handleInputChange}
            />
          </FormSection>

          {/* Student Admission Information */}
          <FormSection title="Student Admission Information">
            <div>
              <label htmlFor="classname" className="block mb-1">
                Select Class
              </label>
              <select
                name="classname"
                id="classname"
                className="w-full border rounded px-2 py-1"
                onChange={handleInputChange}
              >
                <option value="">Choose </option>
                {classes.map((item, index) => (
                  <option key={index} value={item.class}>
                    {item.class}
                  </option>
                ))}
              </select>
            </div>

            {/* <SelectField
              label="Select Class"
              name="classname"
              options={classes}
              value={classes.class} // Pass the current value from formData
              onChange={handleInputChange}
            /> */}
            {/*  <InputField
              label="Session"
              name="session"
              value="2024-2025"
              onChange={handleInputChange}
            /> */}

            <InputField
              label="Amount"
              type="number"
              name="amount"
              onChange={handleInputChange}
            />
            <InputField
              label=""
              name="studentId"
              type="hidden"
              onChange={handleInputChange}
              value={studentID}
            />
          </FormSection>

          {/* Payment Information */}
          <FormSection title="Payment Information">
            <SelectField
              label="Select Payment Method"
              name="paymentmethod"
              options={PaymentOptions}
              value={formData.paymentmethod}
              onChange={handleInputChange}
            />
            <InputField
              label="Payment Phone Number"
              name="pyamentnumber"
              onChange={handleInputChange}
            />
            <InputField
              label="Transaction ID"
              name="trxid"
              onChange={handleInputChange}
            />
            <InputField
              label="Admission Date"
              name="admissiondate"
              type="date"
              onChange={handleInputChange}
            />
          </FormSection>

          {/* Save Button */}
          <div className="text-center mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
