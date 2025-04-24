/* eslint-disable react/prop-types */

const InputField = ({ label, type = "text", name, placeholder, value, onChange }) => (
  <div>
    <label className="block mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      // required
      className="w-full border rounded px-2 py-1"
    />
  </div>
);

export default InputField;
