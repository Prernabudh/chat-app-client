import React from "react";

const Index = (props) => {
  React.useEffect(() => {
    const token = localStorage.getItem("LoggedIn");
    console.log("token===================================>" + token);
    if (!token) {
      props.history.push("/login");
    } else {
      props.history.push("/dashboard");
    }
    // eslint-disable-next-line
  }, [0]);
  return <div></div>;
};

export default Index;
