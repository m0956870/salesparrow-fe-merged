import "./Error.css";
import React from "react";

import error from "../../images/error.gif";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="container">
      <div className="error_page">
        <div className="heading">404 - Not Found</div>
        <img src={error} alt="Error Image" />
        <div>
          Back to{" "}
          <Link className="link" to="/">
            Homepage?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
