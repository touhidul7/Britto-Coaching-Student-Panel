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
  const [invoiceNumber, setInvoiceNumber] = useState('');

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

  // generate random number

  const generateInvoiceNumber = () => {
    const date = new Date();
    const dateString = date.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD format
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
    doc.text("Hosen Nagar Road, Azizullah, Ward No. 33, Metropolis, Rangpur.", 20, 35);
    doc.text("Phone: +880 1717084442", 20, 45);
    doc.text("Email: mbsn2918@gmail.com", 20, 50);
  
    // Student ID
    doc.setFont("helvetica", "bold");
    doc.text(`Student ID: ${studentID}`, 150, 45);
  
    // Invoice Details
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice Number: ${invoiceNo}`, 140, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 35);
  
    // Separator Line
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);
  
    // Student and Course Information
    doc.setFont("helvetica", "bold");
    doc.text("Student Information", 20, 65);
  
    doc.setFont("helvetica", "normal");
    doc.text(`Student Name: ${formData.studentNameEn || "N/A"}`, 20, 75);
    doc.text(`Phone: ${formData.motherMobile || "N/A"}`, 20, 85);
    doc.text(`Class Name: ${formData.classname || "N/A"}`, 105, 75);
    doc.text(`Admission Fee: ${formData.amount || "N/A"}`, 105, 85);
    doc.text(`Admission Date: ${formData.admissiondate || "N/A"}`, 105, 95);
  
    // Table Header
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, 110);
    doc.text("Amount", 150, 110, { align: "right" });
  
    // Table Data
    doc.setFont("helvetica", "normal");
    doc.text("Admission Fee", 20, 120);
    doc.text(`${formData.amount || "N/A"} BDT`, 150, 120, { align: "right" });
  
    // Separator Line
    doc.line(20, 130, 190, 130);
  
    // Total
    doc.setFont("helvetica", "bold");
    doc.text("Total", 20, 140);
    doc.text(`${formData.amount || "N/A"} BDT`, 150, 140, { align: "right" });
  
    // Footer Section
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for choosing our services.", 105, 160, { align: "center" });
  
    doc.save("Invoice.pdf");
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Append invoiceNo to formData
    const finalFormData = { ...formData, invoice: invoiceNumber ,studentId:studentID, session:"2024-2025"};
  
    // Prepare FormData for file uploads
    const formDataToSend = new FormData();
    Object.entries(finalFormData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/students/admission",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.data.success) {
        toast.success("Student record created successfully!");
        console.log("API Response:", response.data);
      } else {
        toast.error("Failed to submit the form.");
        console.error("API Error:", response.data.errors);
      }
    } catch (error) {
      toast.error("An error occurred during submission.");
      console.error("Submission Error:", error);
    }
    generateNumber();
    generateInvoiceNumber();
    generateInvoice(invoiceNumber);
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
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg p-6">
        <img src="./img/Form-Heading.jpg" alt="" />
        <form onSubmit={handleSubmit}>
          {/* Student Information */}
          <FormSection title="Student Information">
            <InputField
              label="Student Image (jpg / png support)"
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
              label="Email (Optional)"
              requried={false}
              type="email"
              name="email"
              onChange={handleInputChange}
            />
            <InputField
              label="Date of Birth"
              type="date"
              name="dob"
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
              label="Blood Group"
              name="bloodGroup"
              options={bloodGroupOptions}
              value={formData.bloodGroup}
              onChange={handleInputChange}
            />
            <InputField
              label="Birth Certificate No."
              type="number"
              name="birthCertificate"
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
          <FormSection title="Present Address" >
            <InputField label="Village/House, Road" name="villagePreset" onChange={handleInputChange}/>
            <InputField label="Post" name="postPreset" onChange={handleInputChange}/>
            <InputField label="Thana" name="thanaPreset" onChange={handleInputChange}/>
            <InputField label="District" name="distPreset" onChange={handleInputChange}/>
          </FormSection>

          <FormSection title="Permanent Address">
            <InputField label="Village/House, Road" name="villagePermanent" onChange={handleInputChange}/>
            <InputField label="Post" name="postPermanent" onChange={handleInputChange}/>
            <InputField label="Thana" name="thanaPermanent" onChange={handleInputChange}/>
            <InputField label="District" name="distPermanent" onChange={handleInputChange}/>
          </FormSection>

          

          {/* Student Admission Information */}
          <FormSection title="Student Admission Information">
            <SelectField
              label="Select Class"
              name="classname"
              options={classOptions}
              value={formData.classname || ""} // Pass the current value from formData
              onChange={handleInputChange}
            />
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
              label="Select Payment"
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
