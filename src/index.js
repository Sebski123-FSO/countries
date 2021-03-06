import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const api_key = process.env.REACT_APP_API_KEY;

ReactDOM.render(
  <React.StrictMode>
    <App api_key={api_key} />
  </React.StrictMode>,
  document.getElementById("root")
);
