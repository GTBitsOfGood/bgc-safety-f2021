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
    paddingLeft: "10%",
    paddingRight: "10%"
  },
  dropdown: {
    width: "30%",
    borderRadius: "50px",
  },
  table: {
    borderCollapse: "collapse"
  },
  tr: {
    "&:nth-child(even)": {
      backgroundColor: "#efefef",
    },
  },
  th: {
    backgroundColor: "#1594D0",
    padding: 10,
    paddingLeft: 15,
    fontSize: 15,
    borderRadius: "3px",
    color: "white", 
    textAlign: "left"
     
  },
  td: {
    padding:15
  },
  tdClub: {
    fontWeight: "bold",
    padding: 15
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
      
        <table className={classes.table}>
          <thead>
            <tr
              className={classes.th}
            >
              
              <th className={classes.td}>Club</th>
              <th className={classes.td}>Region</th>
              <th className={classes.td}>Executive Director</th>
              <th className={classes.td}>Summary</th>
              
              
             </tr>
          </thead>
          <tbody>
            {clubList.map((club) => (
              <tr className={classes.tr}>
                
                  <td className={classes.tdClub}>{club[0]}</td>
                  <td className={classes.td}>{club[1]}</td>
                  <td className={classes.td}>{club[2]}</td>
                  <div>
                    <td className={classes.td}>{club[3]}</td>
                    <td className={classes.td}>{club[4]}</td>
                  </div>
              </tr>
             ))}
          </tbody>
        </table>
      
    </div>
  );
};

export default ClubOverview;
