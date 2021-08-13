import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { spacing } from "@material-ui/system";
import Box from "@material-ui/core/Box";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Modal,
  Backdrop,
  Fade,
} from "@material-ui/core";

import Link from "next/link";
import urls from "../utils/urls";

const fetch = require("node-fetch");

const useStyles = makeStyles((theme) => ({
  pageTitle: {
    padding: "15px",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "90%",
  },
  userTypes: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "10px",
  },
  Button: {
    padding: "10px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  graphic: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const AccountCreation = () => {
  const classes = useStyles();
  const [type, setType] = React.useState("Admin");
  const [open, setOpen] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);

  const [first, setFirst] = React.useState("");
  const [last, setLast] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [selectText, setSelectText] = React.useState("Assigned Bus Routes");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleConfirm = async () => {
    // console.log(first)
    var body = {
      email: email,
      password: password,
      role: type.replace(/\s+/g, ""),
      clubName: location,
    };

    const res = await fetch(`${urls.baseUrl}/api/user`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    setConfirm(true);
    setOpen(false);
  };

  const handleConfirmClose = () => {
    setConfirm(false);
    console.log("Route to created accounts page!");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFirstNameChange = (e) => {
    setFirst(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setLast(e.target.value);
  };
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.pageTitle}>Create an account</h1>
      <p>Select account type for user*</p>
      <div className={classes.userTypes}>
        <Box m={1}>
          <Button
            variant={type !== "Admin" ? "outlined" : "contained"}
            color="primary"
            onClick={() => {
              setType("Admin");
              setSelectText("Assigned Bus Routes");
            }}
            p={10}
          >
            Administrator
          </Button>
        </Box>
        <Box m={1}>
          <Button
            variant={type !== "Bus Driver" ? "outlined" : "contained"}
            color="primary"
            onClick={() => {
              setType("Bus Driver");
              setSelectText("Assigned Bus Routes");
            }}
          >
            Bus Driver
          </Button>
        </Box>
        <Box m={1}>
          <Button
            variant={type !== "Executive Director" ? "outlined" : "contained"}
            color="primary"
            onClick={() => {
              setType("Executive Director");
              setSelectText("Club");
            }}
          >
            Executive Director
          </Button>
        </Box>
        <Box m={1}>
          <Button
            variant={type !== "Regional Director" ? "outlined" : "contained"}
            color="primary"
            onClick={() => {
              setType("Regional Director");
              setSelectText("Region");
            }}
          >
            Regional Director
          </Button>
        </Box>
      </div>
      <div className={classes.textFields}>
        <div className={classes.row1}>
          <TextField
            required
            id="first-name"
            label="First name"
            defaultValue=""
            onChange={handleFirstNameChange}
            style={{ margin: 10 }}
          />
          <TextField
            required
            id="last-name"
            label="Last name"
            defaultValue=""
            onChange={handleLastNameChange}
            style={{ margin: 10 }}
          />
        </div>
        <TextField
          required
          id="location"
          label="Location"
          defaultValue=""
          onChange={handleLocationChange}
          style={{ margin: 10, width: 300 }}
        />
        <div className={classes.row3}>
          <TextField
            required
            id="email-address"
            label="Email address"
            defaultValue=""
            onChange={handleEmailChange}
            style={{ margin: 10 }}
          />
          <TextField
            required
            id="password"
            type="password"
            label="Password"
            defaultValue=""
            onChange={handlePasswordChange}
            style={{ margin: 10 }}
          />
          <InputLabel shrink style={{ margin: 10 }}>
            {selectText}
          </InputLabel>
          <Select style={{ margin: 10 }}>
            <MenuItem>Bus Route 1</MenuItem>
            <MenuItem>Bus Route 2</MenuItem>
            <MenuItem>Bus Route 3</MenuItem>
          </Select>
        </div>
      </div>
      <div>
        <Box m={1}>
          <Button onClick={handleOpen} variant="contained" color="primary">
            Create Account
          </Button>
        </Box>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Confirm account details</h2>

              <p id="transition-modal-description">
                Once confirmed, account information will be sent out to the
                email address.
              </p>
              <br />
              <p>Account type: {type}</p>
              <p>Name: {first + " " + last}</p>
              <p>Location: {location}</p>
              <p>Email Address: {email}</p>
              <p>Password: {password}</p>
              <p>Bus Routes: {"BusA, BusB, BusC"}</p>
              <Box m={1}>
                <Button> Cancel </Button>
                <Button
                  onClick={handleConfirm}
                  variant="contained"
                  color="primary"
                >
                  {" "}
                  Confirm{" "}
                </Button>
              </Box>
            </div>
          </Fade>
        </Modal>
      </div>
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={confirm}
          onClose={handleConfirmClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={confirm}>
            <div className={classes.paper}>
              <h1 id="transition-modal-title">Account created!</h1>
              <span className={classes.graphic}>
                <svg
                  width="93"
                  height="93"
                  viewBox="0 0 93 93"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {" "}
                  <path
                    d="M46.5001 0.722168C37.4461 0.722168 28.5954 3.40699 21.0673 8.43711C13.5392 13.4672 7.67175 20.6168 4.20694 28.9815C0.742125 37.3463 -0.164428 46.5507 1.60192 55.4307C3.36826 64.3108 7.72817 72.4676 14.1303 78.8697C20.5324 85.2719 28.6893 89.6318 37.5693 91.3981C46.4493 93.1645 55.6537 92.2579 64.0185 88.7931C72.3833 85.3283 79.5328 79.4608 84.5629 71.9327C89.593 64.4046 92.2779 55.5539 92.2779 46.4999C92.2779 34.3589 87.4549 22.7152 78.8699 14.1302C70.2849 5.54517 58.6411 0.722168 46.5001 0.722168ZM76.3987 31.1358L38.8037 68.7022L16.6015 46.4999C15.8427 45.7411 15.4164 44.712 15.4164 43.6388C15.4164 42.5657 15.8427 41.5365 16.6015 40.7777C17.3603 40.0189 18.3895 39.5926 19.4626 39.5926C20.5357 39.5926 21.5649 40.0189 22.3237 40.7777L38.8609 57.3149L70.7337 25.4708C71.1094 25.0951 71.5555 24.797 72.0464 24.5937C72.5373 24.3903 73.0634 24.2857 73.5948 24.2857C74.1262 24.2857 74.6523 24.3903 75.1432 24.5937C75.6341 24.797 76.0802 25.0951 76.4559 25.4708C76.8316 25.8465 77.1297 26.2926 77.333 26.7835C77.5364 27.2744 77.641 27.8005 77.641 28.3319C77.641 28.8632 77.5364 29.3894 77.333 29.8803C77.1297 30.3712 76.8316 30.8173 76.4559 31.193L76.3987 31.1358Z"
                    fill="#40B24B"
                  />
                </svg>
              </span>
              <Box m={1}>
                <Button> Create Another Account </Button>
                <Button
                  onClick={handleConfirmClose}
                  variant="contained"
                  color="primary"
                >
                  {" "}
                  View created accounts
                </Button>
              </Box>
            </div>
          </Fade>
        </Modal>
      </div>
    </div>
  );
};

export default AccountCreation;
