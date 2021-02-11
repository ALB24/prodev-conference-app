import React from "react";

const Input = ({ name, label, type,  ...rest }) => {
  if (!type) {
    type = 'text';
  }
  if (type === 'hidden') {
    return (
      <input {...rest} type="hidden" name={name} id={name} className="form-control" />
    );
  }
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input {...rest} type={type} name={name} id={name} className="form-control" />
    </div>
  );
};

export default Input;
