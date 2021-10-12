import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SelectDropdown from "../components/select";
import urls from "../../utils/urls";
import Input from "../components/input";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  dropdown: {
    width: "30%",
    borderRadius: "50px",
  },
}));

const ClubOverview = () => {
  const classes = useStyles();
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const getRoutes = async () => {
      const res = await fetch(`${urls.baseUrl}/api/routes`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      });

      const route_data = await res.json();
      setRoutes(route_data.payload.map((a) => a.name));
    };

    getRoutes();
  }, []);

  return (
    <div className={classes.container}>
      <h2>Overview of Clubs</h2>
      <SelectDropdown options={routes} className={classes.dropdown} />
      <Input />
    </div>
  );
};

export default ClubOverview;
