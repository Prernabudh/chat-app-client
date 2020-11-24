import React from "react";
import "./Input.css";

const Input = (props) => {
  return (
    <input
      className="custom-input"
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    ></input>
  );
};

export default Input;
