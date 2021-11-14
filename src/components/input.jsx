import { makeStyles } from "@material-ui/styles";
import React from "react";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  input: {
    borderWidth: "1px",
    borderRadius: "50px",
  },
}));

const Input = () => {
  const classes = useStyles();

  return <TextField className={classes.input} variant="outlined" />;
};

export default Input;
