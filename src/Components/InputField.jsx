/* eslint-disable react/prop-types */

const InputField = ({ label, type = "text", name, placeholder, value, onChange, required }) => (
  <div>
    <label className="block mb-1 text-gray-700">{label}</label>
    {type === "file" ? (
      <input
        type="file"
        name={name}
        onChange={onChange}
        required={required==false? false : true}
        className="block w-full text-gray-800 border border-gray-300 rounded-md bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-700 hover:file:bg-blue-100"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required==false? false : true}
        className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300 bg-white"
      />
    )}
  </div>
);

export default InputField;
