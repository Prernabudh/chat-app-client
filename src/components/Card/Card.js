import React from "react";
import "./Card.css";

const Card = (props) => {
  return (
    <div
      className="main-card"
      style={{ backgroundColor: props.backgroundColor }}
    >
      {props.children}
    </div>
  );
};

export default Card;
