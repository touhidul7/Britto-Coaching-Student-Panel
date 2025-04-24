/* eslint-disable react/prop-types */

const SelectField = ({ label, name, options, onChange, value, required }) => (
  <div>
    <label className="block mb-1">{label}</label>
    <select
      name={name}
      value={value} // Bind the value to formData state
      onChange={onChange}
      // required={required===false ? false : true}
      className="w-full border rounded px-2 py-1"
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;


/* const SelectField = ({ label, name, options, onChange }) => (
  <div>
    <label className="block mb-1">{label}</label>
    <select name={name} onChange={onChange} className="w-full border rounded px-2 py-1">
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField; */
