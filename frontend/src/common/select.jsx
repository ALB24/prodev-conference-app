import React from "react";

const renderOptions = options => options.map(option => (
  <option key={option._id} value={option._id}>
    {option.name}
  </option>
));

const Select = ({ name, label, options, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} {...rest} className="form-control">
        { label ?
          <optgroup label={label}>{ renderOptions(options) }</optgroup> :
          renderOptions(options)
        }
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;
