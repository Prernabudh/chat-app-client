import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./containers/Login";
import Dashboard from "./containers/Dashboard";
import Register from "./containers/Register";
import Index from "./containers/Index";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Index} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/register" component={Register} exact />
        <Route path="/dashboard" component={Dashboard} exact />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
