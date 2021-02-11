import React from "react";

const TextArea = ({ name, label, error, groupClasses='', inputClasses='', ...rest }) => {
  return (
    <div className={`form-group ${groupClasses}`}>
      <label htmlFor={name}>{label}</label>
      <textarea {...rest} name={name} id={name} className={`form-control ${inputClasses}`} />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default TextArea;
