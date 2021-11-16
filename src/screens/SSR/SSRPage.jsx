import React from "react";
import PropTypes from "prop-types";
import { helloWorld } from "../../actions/General";
import classes from "./SSRPage.module.css";

const SSRPage = ({ message, errorMessage }) => {
  return (
    <>
      {errorMessage == null ? (
        <h4>SSR Message: {message}</h4>
      ) : (
        <h4>SSR Error: {errorMessage}</h4>
      )}
    </>
  );
};

SSRPage.getInitialProps = async () => {
  return helloWorld()
    .then((payload) => {
      return {
        message: payload,
      };
    })
    .catch((error) => ({
      errorMessage: error.message,
    }));
};

SSRPage.propTypes = {
  message: PropTypes.string,
  errorMessage: PropTypes.string,
};

SSRPage.defaultProps = {
  message: null,
  errorMessage: null,
};

export default SSRPage;
