import React from "react";

const Heading = (props) => {
  return (
    <div className={props.heading ? "heading" : "sub-heading"}>
      {props.children}
    </div>
  );
};

export default Heading;
