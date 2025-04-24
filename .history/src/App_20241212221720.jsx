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

  useEffect(() => {
    generateNumber();
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

  const generateInvoice = (invoiceNo) => {
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
    doc.setFont("helvetica", "bold");
    doc.text(`Student ID: ${studentID}`, 150, 45);
    // Invoice Details
    doc.setFontSize(12);
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

    doc.text(`Phone: ${formData.motherMobile || "N/A"}`, 20, 95);

    doc.text(`Class Name: ${formData.classname || "N/A"}`, 105, 75);
    doc.text(`Admission Fee: ${formData.amount || "N/A"}`, 105, 85);
    doc.text(`Admission Date: ${formData.admissiondate || "N/A"}`, 105, 95);

    // Table Header
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, 110);
    doc.text("Amount", 150, 110);

    // Table Data
    doc.setFont("helvetica", "normal");
    doc.text("Admission Fee", 20, 120);
    doc.text(`${formData.amount || "N/A"} BDT`, 150, 120, {
      align: "right",
    });

    // Separator Line
    doc.line(20, 130, 190, 130);

    // Total
    doc.setFont("helvetica", "bold");
    doc.text("Total", 20, 140);
    doc.text(`${formData.amount || "N/A"} BDT`, 150, 140, {
      align: "right",
    });

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
  
    // Generate Invoice Number
    const baseString = `${formData.studentNameEn || ""}${formData.class || ""}${
      formData.dob || ""
    }`
      .replace(/\s+/g, "") // Remove spaces
      .replace(/[^a-zA-Z0-9]/g, "") // Remove special characters
      .toUpperCase();
    const invoiceNo = baseString.substring(0, 8).padEnd(8, "X"); // Ensure it’s 8 characters long
  
    // Append invoiceNo to formData
    const finalFormData = { ...formData, invoice: invoiceNo };
  
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
    { label: "Class 1", value: "class1" },
    { label: "Class 2", value: "class2" },
    { label: "Class 3", value: "class3" },
    { label: "Class 4", value: "class4" },
    { label: "Class 5", value: "class5" },
    { label: "Class 6", value: "class6" },
    { label: "Class 7", value: "class7" },
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
            <InputField
              label="Birth Certificate (jpg / png support)"
              type="file"
              name="birthCertificateFile"
              onChange={handleFileChange}
            />
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
            <InputField
              label="Parents NID (jpg / png support)"
              type="file"
              name="parentsNidFile"
              onChange={handleFileChange}
            />
          </FormSection>

          {/* Present Address */}
          <FormSection title="Present Address" >
            <InputField label="Village/House, Road" name="villagePresent" onChange={handleInputChange}/>
            <InputField label="Post" name="postPresent" onChange={handleInputChange}/>
            <InputField label="Thana" name="thanaPresent" onChange={handleInputChange}/>
            <InputField label="District" name="districtPresent" onChange={handleInputChange}/>
          </FormSection>

          <FormSection title="Permanent Address">
            <InputField label="Village/House, Road" name="villagePermanent" onChange={handleInputChange}/>
            <InputField label="Post" name="postPermanent" onChange={handleInputChange}/>
            <InputField label="Thana" name="thanaPermanent" onChange={handleInputChange}/>
            <InputField label="District" name="districtPermanent" onChange={handleInputChange}/>
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
            <InputField
              label="Session"
              name="session"
              value="2024-2025"
              onChange={handleInputChange}
            />

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
