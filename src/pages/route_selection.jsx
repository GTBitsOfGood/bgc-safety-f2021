import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
const fetch = require("node-fetch");
import urls from "../../utils/urls";
import { useSession } from "next-auth/client";
import { verifyUserType } from "../../utils/userType";

const ClubName = "Harland"; // TODO: Allow user to select a club

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    textDecoration: "none",
    textAlign: "center",
    color: "black",
    borderRadius: "20px",
    margin: "10px",
    padding: "10px",
  },
  btnContainer: {
    display: "flex",
    flexDirection: "column",
    width: "500px",
  },
  text: {
    margin: "30px",
  },
}));

const RouteSelection = ({ schools }) => {
  const [selectedSchool, setselectedSchool] = useState("");
  const classes = useStyles();
  const [session, loading] = useSession();
  const [userType, setUserType] = useState("");

  useEffect(() => {
    session && verifyUserType(session, urls.pages.route_selection, setUserType);
  }, [session]);

  useEffect(() => {
    // render/link to bus checkin page passing in selected school as props
  }, [selectedSchool]);

  const handleClick = (e) => {
    console.log(e.target.innerHTML);
    setselectedSchool(e.target.innerHTML);
  };

  return (
    <>
      {session && userType === "BusDriver" ? (
        <div className={classes.container}>
          <h1 className={classes.text}>Select a Bus Route:</h1>
          <div className={classes.btnContainer}>
            {schools.map((school) => {
              return (
                <Link
                  href="/bus_checkin_roster/[route]"
                  as={`bus_checkin_roster/${school.name}`}
                >
                  <a
                    className={classes.btn}
                    style={{
                      backgroundColor: school.complete ? "#6FCF97" : "#C4C4C4",
                    }}
                  >
                    {school.name} -
                    {school.complete ? " Complete" : " Incomplete"}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div />
      )}
    </>
  );
};

RouteSelection.getInitialProps = async () => {
  const res = await fetch(`${urls.baseUrl}/api/club?ClubName=${ClubName}`);
  const schools_data = await res.json();
  let schools_list = [];
  if (schools_data.success && schools_data.payload.length > 0) {
    schools_list = schools_data.payload[0].SchoolNames;
  }

  let data = [];

  for (let s of schools_list) {
    data.push({
      name: s,
      complete: false,
    });
  }

  return { schools: data };
};

export default RouteSelection;
