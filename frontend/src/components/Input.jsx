import React from "react";

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="form-control mb-3"
    />
  );
};

export default Input;