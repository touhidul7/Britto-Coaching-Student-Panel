/* eslint-disable react/prop-types */
import { Children } from "react";


const AddressSection = ({ title }) => (
  <fieldset className="border border-green-600 p-4 mb-4">
    <legend className="px-2 text-lg text-green-700">{title}</legend>
    <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
      {Children}
    </div>
  </fieldset>
);

export default AddressSection;
