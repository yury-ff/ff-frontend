import React from "react";

const FormRow = ({ type, name, value, handleChange, handleClick }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {name}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        onClick={handleClick}
        className="form-input"
      />
    </div>
  );
};

export default FormRow;
