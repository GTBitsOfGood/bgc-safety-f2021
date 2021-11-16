import React, { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import { Button, Typography, InputBase } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import urls from "../../utils/urls";
import userTypes, { useUserType } from "../../utils/userType";
import { signIn, signOut, useSession } from "next-auth/client";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  image: {
    maxWidth: "25%",
    height: "auto",
    paddingBottom: "15px",
  },
  title: {
    fontWeight: "bold",
    padding: "10px",
  },
  input: {
    padding: "8px",
    minWidth: "40%",
  },
  button: {
    backgroundColor: "#1C7DB4",
    margin: "18px",
    color: "white",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "20px",
    minWidth: "35%",
    borderRadius: 25,
  },
  error: {
    color: "red",
  },
});

const LoginField = withStyles({
  input: {
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    padding: "8px 20px",
  },
})(InputBase);

const Login = () => {
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [session, loading] = useSession();
  const userType = useUserType(session);
  // console.log("heyo");
  // console.log(process.env.NEXTAUTH_URL);
  const classes = useStyles();

  useEffect(() => {
    if (session) {
      if (userType === userTypes.busDriver) {
        Router.replace(urls.pages.route_selection);
      } else if (
        userType === userTypes.clubDirector ||
        userType === userTypes.attendanceClerk
      ) {
        Router.replace(urls.pages.roster);
      } else if (userType === userTypes.admin) {
        Router.replace(urls.pages.club_overview);
      }
    }
  }, [session, userType]);

  // async function handleSubmit(event) {
  //   event.preventDefault();
  //   const url = `/api/login`;

  //   try {
  //     fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: username,
  //         password,
  //       }),
  //     })
  //       // .then((res) => res.json())
  //       .then((response) => {
  //         if (response.success) {
  //           sessionStorage.token = response.payload;
  //           router.replace("/history");
  //         } else {
  //           setError(response.message);
  //         }
  //       })
  //       .catch((err) => {
  //         setError(err);
  //       });
  //   } catch (err) {
  //     console.error(
  //       "You have an error in your code or there are Network issues.",
  //       err
  //     );
  //     throw new Error(err);
  //   }
  // }
  return (
    <div className={classes.container}>
      {error && <p className={classes.error}>{error}</p>}
      {!session && (
        <>
          <img className={classes.image} src="bgc-logo.png" alt="BGC Logo" />
          <Typography className={classes.title} variant="h3">
            BGCMA Bus Safety App
          </Typography>
        

      
          <>
            Not signed in <br />
            <Button
              onClick={signIn}
              className={classes.button}
              variant="contained"
            >
              Click to Sign In
            </Button>
          </>
        </>
      )}
    </div>
  );
};

export default Login;
