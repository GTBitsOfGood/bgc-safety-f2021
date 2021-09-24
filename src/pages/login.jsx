import React, { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import { Button, Typography, InputBase } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import urls from "../../utils/urls";
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

const getUserType = async (session) => {
  const res = await fetch(`/api/user?email=${session.user.email}`);
  const userData = await res.json();
  return userData[0].type;
};

const Login = () => {
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [session, loading] = useSession();
  const [userType, setUserType] = useState("");
  // console.log("heyo");
  // console.log(process.env.NEXTAUTH_URL);
  const classes = useStyles();

  useEffect(() => {
    async function checkUserType() {
      const type = await getUserType(session);
      setUserType(type);
    }
    if (session) {
      checkUserType();
    }
  }, [session]);

  const gotoLanding = async () => {
    /*
    Default landing page (open to discussion): 
      - Bus Driver: route_selection
      - Attendance Clerk/Club Director: roster
      - Admin: roster (ideally "Overview of Clubs" - Figma)
    */
    if (userType === "BusDriver") {
      Router.replace("/route_selection");
    } else if (userType === "ClubDirector") {
      Router.replace("/roster");
    } else if (userType === "Admin") {
      Router.replace("/roster");
    }
  };

  // async function handleSubmit(event) {
  //   event.preventDefault();
  //   const url = `${urls.baseUrl}/api/login`;

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
      <img className={classes.image} src="bgc-logo.png" alt="BGC Logo" />
      <Typography className={classes.title} variant="h3">
        BGCMA Bus Safety App
      </Typography>

      {error && <p className={classes.error}>{error}</p>}
      {!session && (
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
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <Button
            onClick={signOut}
            className={classes.button}
            variant="contained"
          >
            Click to Sign Out
          </Button>
          <Button
            onClick={gotoLanding}
            className={classes.button}
            variant="contained"
          >
            Go to Landing page (to happen automatically)
          </Button>
        </>
      )}
    </div>
  );
};

export { getUserType };
export default Login;
