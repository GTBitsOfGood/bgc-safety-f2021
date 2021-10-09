import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
const fetch = require("node-fetch");
import urls from "../../utils/urls";

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
  const [selectedSchool, setselectedSchool] = React.useState("");
  const classes = useStyles();

  React.useEffect(() => {
    // render/link to bus checkin page passing in selected school as props
  }, [selectedSchool]);

  const handleClick = (e) => {
    console.log(e.target.innerHTML);
    setselectedSchool(e.target.innerHTML);
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.text}>Select a Bus Route:</h1>
      <div className={classes.btnContainer}>
        {routes.map(({name}) => {
          return (
            <Link
              href="/bus_checkin_roster/[route]"
              as={`bus_checkin_roster/${name}`}
            >
              <a>{name}</a>
              {/* <a
                className={classes.btn}
                style={{
                  backgroundColor: school.complete ? "#6FCF97" : "#C4C4C4",
                }}
              >
                {school.name} -{school.complete ? " Complete" : " Incomplete"}
              </a> */}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

RouteSelection.getInitialProps = async () => {
  //currently no functionality to assign busDriver users to specific routes
  const res = await fetch(`${urls.baseUrl}/api/routes`)
  const routes = await res.json()
  return {routes: routes.payload}
  
  // const res = await fetch(`${urls.baseUrl}/api/club?ClubName=${ClubName}`);
  // const schools_data = await res.json();
  // let schools_list = [];
  // if (schools_data.success && schools_data.payload.length > 0) {
  //   schools_list = schools_data.payload[0].SchoolNames;
  // }

  // let data = [];

  // for (let s of schools_list) {
  //   data.push({
  //     name: s,
  //     complete: false,
  //   });
  // }

  // return { schools: data };
};

export default RouteSelection;
