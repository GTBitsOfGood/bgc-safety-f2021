import { useState, useEffect } from "react";
import Router from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import { spacing } from "@material-ui/system";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { useSession } from "next-auth/client";
import urls from "../../utils/urls";
import { useUserAuthorized } from "../../utils/userType";

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

const fetch = require("node-fetch");

const useStyles = makeStyles((theme) => ({
  pageHead: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterDiv: {
    display: "flex",
    flexDirection: "row",
  },
  table: {
    width: "100%",
    borderSpacing: "5px",
    textAlign: "center",
    border: "4px solid #1594D0",
    borderCollapse: "collapse",
  },
  tr: {
    display: "table",
    width: "100%",
    tableLayout: "fixed",
    backgroundColor: "#1594D0",
  },
  th: {
    width: "calc( 100% - 1em )",
    backgroundColor: "#1594D0",
    padding: "10px",
    borderCollapse: "collapse",
    color: "white",
  },
  tbody: {
    display: "block",
    height: "450px",
    //overflowY: "auto",
    //overflowX: "hidden"
  },
  tcell: {
    color: "#1594D0",
    fontFamily: "raleway",
    fontSize: "18px",
    fontWeight: "bold",
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
  Button: {
    padding: "10px",
  },
}));

const createTable = async (
  setindex,
  setName,
  setType,
  setEmail,
  setCreatedBy,
  setLocation,
  setPassword
) => {
  const items = {
    index: setindex,
    name: setName,
    type: setType,
    email: setEmail,
    createdBy: setCreatedBy,
    location: setLocation,
    password: setPassword,
  };
  setDataItems([...dataItems, items]);
};

const createdAccounts = () => {
  const classes = useStyles();
  const [session, loading] = useSession();
  const [filterType, setType] = useState("All");
  const [dataItems, setDataItems] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isEditable, setEditable] = useState("false");
  const userAuthorized = useUserAuthorized(
    session,
    urls.pages.created_accounts
  );

  const handleExpansion = () => {
    if (expanded == true) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  };

  const goToAccountCreationPage = () => {
    Router.replace("/account_creation");
  };

  const tableEditable = () => {
    setEditable("true");
  };

  if (!session || !userAuthorized) {
    return <div />;
  }

  return (
    <div>
      <div className={classes.pageHead}>
        <h1>Accounts</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={goToAccountCreationPage}
          p={10}
          style={{ margin: 20 }}
        >
          + Create an Account
        </Button>
      </div>
      <div className={classes.filterDiv}>
        <Box m={1}>
          <Button
            variant={filterType !== "All" ? "outlined" : "contained"}
            color="primary"
            onClick={() => {
              setType("All");
            }}
            p={10}
          >
            All
          </Button>
        </Box>
        <Box m={1}>
          <Button
            variant={filterType !== "BusDriver" ? "outlined" : "contained"}
            color="primary"
            onClick={() => {
              setType("BusDriver");
            }}
            p={10}
          >
            Bus Driver
          </Button>
        </Box>
        <Box m={1}>
          <Button
            variant={
              filterType !== "ExecutiveDirector" ? "outlined" : "contained"
            }
            color="primary"
            onClick={() => {
              setType("ExecutiveDirector");
            }}
            p={10}
          >
            Executive Director
          </Button>
        </Box>
        <Box m={1}>
          <Button
            variant={
              filterType !== "RegionalDirector" ? "outlined" : "contained"
            }
            color="primary"
            onClick={() => {
              setType("RegionalDirector");
            }}
            p={10}
          >
            Regional Director
          </Button>
        </Box>
        <Box m={1}>
          <Button
            variant={
              filterType !== "MembershipClerk" ? "outlined" : "contained"
            }
            color="primary"
            onClick={() => {
              setType("MembershipClerk");
            }}
            p={10}
          >
            Membership Clerk
          </Button>
        </Box>
        <TextField
          required
          id="search-bar"
          label="PLACEHOLDER FOR SEARCH BAR"
          defaultValue=" "
          style={{ margin: 10 }}
        />
      </div>
      <table className={classes.table}>
        <thead
          style={{
            backgroundColor: "#E0E0E0",
            width: "calc( 100% - 1em )",
          }}
        >
          <tr>
            <th scope="col" className={classes.th}>
              {" "}
              Number
            </th>
            <th scope="col" className={classes.th}>
              {" "}
              Name{" "}
            </th>
            <th scope="col" className={classes.th}>
              {" "}
              Account Type
            </th>
            <th scope="col" className={classes.th}>
              {" "}
              Email{" "}
            </th>
            <th scope="col" className={classes.th}>
              {" "}
              Created by{" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {dataItems.map((data, index) => (
            <tr key={index}>
              <td scope="row">
                <IconButton className={classes.tcell} onClick={handleExpansion}>
                  {" "}
                  {expanded ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}{" "}
                  {data.index}{" "}
                </IconButton>
              </td>
              <td contentEditable={isEditable} className={classes.tcell}>
                {" "}
                {data.name}{" "}
              </td>
              <td contentEditable={isEditable} className={classes.tcell}>
                {" "}
                {data.type}{" "}
              </td>
              <td contentEditable={isEditable} className={classes.tcell}>
                {" "}
                {data.email}{" "}
              </td>
              <td contentEditable={isEditable} className={classes.tcell}>
                {" "}
                {data.createdBy}{" "}
              </td>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <div className={classes.paper}>
                  <h1> Name: {data.name} </h1>
                  <h1> Account Type: {data.type} </h1>
                  <h1> Email: {data.email} </h1>
                  <h1> Location: {data.location} </h1>
                  <h1> Password: {data.password} </h1>
                  <Box m={1}>
                    <Button
                      onClick={tableEditable}
                      variant="contained"
                      color="primary"
                    >
                      Edit
                    </Button>
                  </Box>
                </div>
              </Collapse>
            </tr>
          ))}
        </tbody>
        <tr>
          <td scope="row">
            <IconButton className={classes.tcell} onClick={handleExpansion}>
              {" "}
              {expanded ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )} 1{" "}
            </IconButton>
          </td>
          <td contentEditable={isEditable} className={classes.tcell}>
            {" "}
            Test Person{" "}
          </td>
          <td contentEditable={isEditable} className={classes.tcell}>
            {" "}
            Test Type{" "}
          </td>
          <td contentEditable={isEditable} className={classes.tcell}>
            {" "}
            test000@gmail.com{" "}
          </td>
          <td contentEditable={isEditable} className={classes.tcell}>
            {" "}
            CreatedbyTest{" "}
          </td>
        </tr>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <div className={classes.paper}>
            <p> Name: </p>
            <p> Account Type: </p>
            <p> Email: </p>
            <p> Location: </p>
            <p> Password: </p>
            <Box m={1}>
              <Button
                onClick={tableEditable}
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
            </Box>
          </div>
        </Collapse>
      </table>
    </div>
  );
};

export default createdAccounts;
