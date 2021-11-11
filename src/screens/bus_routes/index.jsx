import React from "react";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import urls from "../../../utils/urls";
import { useSession } from "next-auth/client";
import { useUserAuthorized } from "../../../utils/userType";
import { findAllClubs } from "../../../server/mongodb/actions/Club";
import { Button, ButtonGroup } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainer: {
    display: "flex",
    flexDirection: "column",
    width: "500px",
  },
  btn: {
    textDecoration: "none",
    textAlign: "center",
    color: "black",
    borderRadius: "20px",
    margin: "10px",
    padding: "10px",
    backgroundColor: "#C4C4C4",
  },
}));

const BusRoutesOverview = ({ clubs }) => {
  const classes = useStyles();
  const [session] = useSession();
  const userAuthorized = useUserAuthorized(session, urls.pages.bus_routes);

  if (!session || !userAuthorized) {
    return <div />;
  }

  return (
    <div className={classes.container}>
      <h1>Select a club:</h1>
      <div className={classes.btnContainer}>
        {clubs.map(({ ClubName }) => (
          <Link href={`/bus_routes/${ClubName}`}>
            <a className={classes.btn}>{ClubName}</a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const clubs = await findAllClubs();
  return { props: { clubs } };
}

export default BusRoutesOverview;
