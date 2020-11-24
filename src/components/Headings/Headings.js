import React from "react";
import "./Heading.css";
const Heading = (props) => {
  return (
    <div className={props.type} style={{ color: props.color }}>
      {props.children}
    </div>
  );
};

export default Heading;
