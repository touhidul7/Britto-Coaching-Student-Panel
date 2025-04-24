
// eslint-disable-next-line react/prop-types
const FormSection = ({ title, children }) => (
  <fieldset className="border border-green-600 p-4 mb-4 flex flex-col justify-end">
    <legend className="px-2 text-lg text-green-700">{title}</legend>
    <div className="grid grid-cols-2 gap-4">{children}</div>
  </fieldset>
);

export default FormSection;
