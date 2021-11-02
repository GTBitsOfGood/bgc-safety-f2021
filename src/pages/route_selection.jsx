import React, { useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
const fetch = require("node-fetch");
import urls from "../../utils/urls";
import { getCurrentDate } from "./bus_checkin_roster/[route]";
import { useSession } from "next-auth/client";
import { useUserAuthorized } from "../../utils/userType";

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

const RouteSelection = ({ routes }) => {
  const [selectedSchool, setselectedSchool] = useState("");
  const classes = useStyles();
  const [session, loading] = useSession();
  const userAuthorized = useUserAuthorized(session, urls.pages.route_selection);

  // marks routes as complete or incomplete based on checkIn time
  const markedRoutes = useMemo(() => {
    const curDate = getCurrentDate();
    return routes.map(({ _id, name, checkIns }) => {
      const checkedIn = checkIns.some((checkIn) => checkIn.date === curDate);
      return {
        id: _id,
        name,
        checkInComplete: checkedIn,
      };
    });
  }, [routes]);

  if (!session || !userAuthorized) {
    return <div />;
  }

  return (
    <div className={classes.container}>
      <h1 className={classes.text}>Select a Bus Route:</h1>
      <div className={classes.btnContainer}>
        {markedRoutes.map(({ name, checkInComplete }) => {
          return (
            <Link
              href={`${urls.pages.bus_checkin_roster}/[route]`}
              as={`bus_checkin_roster/${encodeURIComponent(name)}`}
            >
              <a
                className={classes.btn}
                style={{
                  backgroundColor: checkInComplete ? "#6FCF97" : "#C4C4C4",
                }}
              >
                {name} -{checkInComplete ? " Complete" : " Incomplete"}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

RouteSelection.getInitialProps = async () => {
  //currently no functionality to assign busDriver users to specific routes
  const res = await fetch(urls.api.routes);
  const routes = await res.json();
  return { routes: routes.payload };
};

export default RouteSelection;
