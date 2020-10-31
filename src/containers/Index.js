import React from "react";

const Index = (props) => {
  React.useEffect(() => {
    const token = localStorage.getItem("LoggedIn");
    if (!token) {
      props.history.push("/login");
    } else {
      props.history.push("/dashboard");
    }
  }, [0]);
  return <div></div>;
};

export default Index;
