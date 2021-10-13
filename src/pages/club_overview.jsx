import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
  tr: {
    "&:nth-child(even)": {
      backgroundColor: "#efefef",
    },
  },
  th: {
    backgroundColor: "#4da6ff",
  }
}));

const ClubName = "Harland"; // TODO: Allow user to select a club

const ClubOverview = () => {
  const classes = useStyles();
  const [routes, setRoutes] = useState([]);

  let regionList = ["East","West","East","West"];
  let clubList = [
    ["Harland", regionList[0], "John Smith", "BusA Cap 20/30", "BusB Cap 20/30"],
    ["Harland",regionList[1], "John Smith", "BusA Cap 20/30", "BusB Cap 20/30"], 
    ["Harland", regionList[2], "John Smith", "BusA Cap 20/30", "BusB Cap 20/30"], 
    ["Harland",regionList[3], "John Smith", "BusA Cap 20/30", "BusB Cap 20/30"]
  ];
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
      
        <table>
          <thead>
            <th
              className={classes.th}
            >
              Club
              Executive Director
              Summary
             </th>
          </thead>
          <tbody>
            {clubList.map((club) => (
              <tr className={classes.tr}>
                <td>
                  {club[0]}
                  {club[1]}
                  {club[2]}
                  {club[3]}
                  {club[4]}
                </td>
              </tr>
             ))}
          </tbody>
        </table>
      
    </div>
  );
};

export default ClubOverview;
