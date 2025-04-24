/* eslint-disable react/no-unescaped-entities */
import { useOutletContext } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const IdCard = () => {
  const backendFileUrl = import.meta.env.VITE_FILE_BASE_URL;
  const { data } = useOutletContext();

  const handleDownloadPDF = () => {
    const idCardElement = document.getElementById("id-card");

    html2canvas(idCardElement, {
      scale: 2, // Ensures high resolution
      useCORS: true, // Allows cross-origin images
      allowTaint: true, // Allow usage of external images
    }).then((canvas) => {
      // Generate the image data from the canvas
      const imgData = canvas.toDataURL("image/png"); // Use "image/png" for the correct MIME type

      const pdf = new jsPDF("p", "mm", "a4"); // Initialize jsPDF with A4 size
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm

      // Calculate the card dimensions to maintain aspect ratio
      const cardWidth = pdfWidth - 40; // Subtract margins (20mm on each side)
      const cardHeight = (canvas.height * cardWidth) / canvas.width; // Maintain aspect ratio

      // Center the image vertically in the PDF
      const marginY = (pdfHeight - cardHeight) / 2;
      pdf.addImage(imgData, "PNG", 20, marginY, cardWidth, cardHeight); // "PNG" for the image format
      pdf.save("student-id-card.pdf");
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        id="id-card"
        className="w-80 h-auto border-2 border-blue-500 rounded-lg p-4 bg-white shadow-md text-left"
        style={{
          aspectRatio: "3 / 4", // Ensures the card keeps a 3:4 aspect ratio
        }}
      >
        <div className="bg-blue-500 text-white py-2 rounded-t-lg mb-4">
          <p className="font-semibold text-center">Student ID Card</p>
        </div>
        <img
          src={`${backendFileUrl}/admin/students/${data.studentImage}`}
          alt="Student Photo"
          className="w-24 h-24 mx-auto rounded-full border-2 border-blue-500 object-cover mb-4"
        />
        <div>
          <h4 className="text-lg font-semibold text-center">
            {data.studentNameEn}
          </h4>
        </div>
        <table className="w-full text-sm mt-3 mb-2">
          <tbody>
            <tr>
              <td className="font-semibold py-1">ID</td>
              <td>
                <b>:</b> {data.studentId}
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Father&apos;s Name</td>
              <td>
                <b>:</b> {data.fatherNameEn}
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Mother's Name</td>
              <td>
                <b>:</b> {data.motherNameEn}
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-1">DOB</td>
              <td>
                <b>:</b> {data.dob}
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Mobile</td>
              <td>
                <b>:</b> {data.fatherMobile}
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Session</td>
              <td>
                <b>:</b> {data.session}
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Technology</td>
              <td>
                <b>:</b> {data.classname}
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Blood Group</td>
              <td>
                <b>:</b> {data.bloodGroup}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="text-xs text-gray-600 text-center">
          <p>Issued on: 01 December 2024</p>
          <p>Valid Until: 31 December 2025</p>
        </div>
      </div>
      {/* ID Card Download Button */}
      <button onClick={handleDownloadPDF} className="hidden">
        <div className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Download PDF
        </div>
      </button>
    </div>
  );
};

export default IdCard;
