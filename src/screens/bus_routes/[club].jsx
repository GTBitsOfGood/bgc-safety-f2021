import React, { useState, useEffect } from "react";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {
  Button,
  ButtonGroup,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import urls from "../../../utils/urls";
import { useSession } from "next-auth/client";
import Router from "next/router";
import { useUserAuthorized } from "../../../utils/userType";
import FileUploader from "../../components/file_uploader";
import { If, Then, Else } from "react-if";
import { RemoveCircleOutline, RemoveOutlined } from "@material-ui/icons";
import { getRoutesByClub } from "../../../server/mongodb/actions/Club";
import { getRoutesByIds } from "../../../server/mongodb/actions/Route";
// import {getStudentsByName, changeStudentRoute} from "../pages/api/student";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  backbtn: {
    display: "flex",
    alignItems: "center",
    outline: "none",
    border: "none",
    marginRight: "auto",
    background: "white",
    "&:hover": {
      cursor: "pointer",
    },
  },
  routeNameContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  routeName: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "black",
  },
  icon: {
    color: "#B3B8BA",
    padding: "0px 0px 0px 25px",
  },
  checkIcon: {
    color: "#3fd95b",
    padding: "0px 0px 0px 25px",
  },
  hideIcon: {
    display: "none",
  },
  btn: {
    textDecoration: "none",
    textAlign: "center",
    color: "black",
    margin: "10px",
    padding: "10px",
    background: "#BDBDBD",
  },
  pagehead: {
    width: "95%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  table: {
    width: "100%",
    borderSpacing: "5px",
    textAlign: "center",
    borderCollapse: "collapse",
  },
  tbody: {
    display: "block",
    height: "450px",
    overflowY: "auto",
    overflowX: "hidden",
  },
  th: {
    width: "calc( 100% - 1em )",
    backgroundColor: "#E0E0E0",
    padding: "10px",
    border: "1px solid #BDBDBD",
    borderCollapse: "collapse",
  },
  td: {
    textAlign: "center",
    width: "fill",
    padding: "5px",
    borderLeft: "1px solid #BDBDBD",
    borderRight: "1px solid #BDBDBD",
  },
  tr: {
    display: "table",
    width: "100%",
    tableLayout: "fixed",
    "&:nth-child(even)": {
      backgroundColor: "#efefef",
    },
  },
  input: {
    margin: "25px",
    padding: "10px",
  },
  routeTabs: {
    display: "flex",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  textField: {
    border: "none",
    backgroundColor: "#efefef",
    display: "inline-block",
    minHeight: "24px",
    padding: "2px 8px",
    margin: "10px",
    fontSize: "14px",
  },
  error: {
    fontSize: "12px",
    color: "red",
  },
}));

const BusRoutes = ({ clubName, savedRoutes }) => {
  const classes = useStyles();
  const [session, loading] = useSession();
  const [routes, setRoutes] = useState(savedRoutes);
  const [selectedRoute, setSelectedRoute] = useState(routes[0]);
  const [selectedFile, setSelectedFile] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [editedRoute, setEditedRoute] = useState(
    routes.length > 0 ? routes[0].name : ""
  );
  const [routeEditable, setEditable] = useState(false);
  const [addRouteModalOpen, setAddRouteModalOpen] = useState(false);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);

  const [routeNameError, setRouteNameError] = useState(false);
  const [newRouteError, setNewRouteError] = useState(false);
  const [editNameError, setEditNameError] = useState(false);

  const userAuthorized = useUserAuthorized(session, urls.pages.bus_routes);

  useEffect(async () => {
    const res = await fetch(`${urls.api.student}?route=${selectedRoute._id}`);
    const routeStudents = await res.json();
    setStudentList(routeStudents.payload);
  }, [selectedRoute]);

  const addRoute = () => {
    setAddRouteModalOpen(true);
  };

  const addStudent = () => {
    setAddStudentModalOpen(true);
  };

  const handleRouteCreate = async (name) => {
    if (name === "") {
      setRouteNameError(true);
    } else {
      setRouteNameError(false);

      const data = new FormData();
      data.append("file", selectedFile);

      const routesRes = await fetch(`${urls.baseUrl}/api/routes`, {
        method: "post",
        body: JSON.stringify({
          name,
          clubName,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const routes_data = await routesRes.json();

      if (routes_data.success && routes_data.payload) {
        setRoutes(routes.concat(routes_data.payload));
        setAddRouteModalOpen(false);
      } else {
        setNewRouteError(true);
        return;
      }

      const studentsRes = await fetch(
        `${urls.baseUrl}/api/upload_csv?clubName=${clubName}&routeId=${routes_data.payload._id}`,
        {
          method: "POST",
          body: data,
        }
      );

      const students_data = await studentsRes.json();

      if (!students_data.success) {
        setNewRouteError(true);
        return;
      }
    }
  };

  async function handleStudentCreate(
    studentFirstName,
    studentLastName,
    studentId,
    studentSchool,
    studentGrade
  ) {
    if (![...arguments].every((e) => e)) {
      setRouteNameError(true);
      return;
    }
    setRouteNameError(false);

    const addStudentRes = await fetch(`${urls.baseUrl}${urls.api.student}`, {
      method: "POST",
      body: JSON.stringify({
        FirstName: studentFirstName,
        LastName: studentLastName,
        StudentID: studentId,
        SchoolName: studentSchool,
        RouteId: selectedRoute._id,
        Grade: studentGrade,
        ClubName: clubName,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const newStudent = await addStudentRes.json();

    if (!newStudent.success) {
      setRouteNameError(false);
      return;
    }

    const body = {
      firstName: studentFirstName,
      lastName: studentLastName,
      schoolName: studentSchool,
      grade: studentGrade,
    };
    setStudentList([...studentList, body]);
    setAddStudentModalOpen(false);
  }

  const handleRouteModalClose = () => {
    setNewRouteError(false);
    setRouteNameError(false);
    setAddRouteModalOpen(false);
  };

  const handleStudentModalClose = () => {
    setAddStudentModalOpen(false);
  };

  const handleNameChange = (event) => {
    setEditedRoute(event.target.value);
  };

  const handleUpload = (files) => {
    const fileName = files[0].name.split(".");
    if (fileName[fileName.length - 1] === "csv") {
      console.log(files[0]);
      setSelectedFile(files[0]);
    } else {
      alert("You must upload a CSV file.");
    }
  };

  const updateName = (name) => {
    setEditedRoute(name);
  };

  const updateRouteName = async (name) => {
    const body = {
      id: selectedRoute._id,
      name,
    };

    const res = await fetch(`${urls.baseUrl}/api/routes`, {
      method: "put",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const route_data = await res.json();

    if (route_data.success) {
      setEditNameError(false);
      setSelectedRoute(route_data.payload);
      // update the routes list without making another API call
      setRoutes(
        routes.map((route) =>
          route._id === body.id ? route_data.payload : route
        )
      );
    } else {
      setEditNameError(true);
    }
  };

  let modalName = "";

  if (!session || !userAuthorized) {
    return <div />;
  }

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.pagehead}>
          <div>
            <Link href={urls.pages.bus_routes}>
              <button className={classes.backbtn}>
                <ArrowBackIosIcon />
                <h1 className={classes.text}>Back </h1>
              </button>
            </Link>
          </div>
          <div className={classes.routeNameContainer}>
            <div>
              <TextField
                id="route-name"
                value={editedRoute}
                disabled={!routeEditable}
                onChange={handleNameChange}
                InputProps={{ className: classes.routeName }}
              />
              <div hidden={!editNameError} className={classes.error}>
                Sorry, an error occurred. Couldn't update route name.
              </div>
            </div>
            <EditIcon
              className={routeEditable ? classes.hideIcon : classes.editIcon}
              onClick={() => {
                setEditable(true);
                setEditedRoute(selectedRoute.name);
                document.getElementById("route-name").focus();
                document.getElementById("route-name").select();
              }}
            />
            <CheckCircleIcon
              className={routeEditable ? classes.checkIcon : classes.hideIcon}
              onClick={() => {
                setEditable(false);
                updateRouteName(editedRoute);
              }}
            />
          </div>

          <div className={classes.btnContainer}>
            <Button className={classes.btn} onClick={addStudent}>
              Add New Student
            </Button>
            <Dialog
              style={{ padding: 10, margin: 10, minWidth: 600 }}
              open={addStudentModalOpen}
              onClose={handleStudentModalClose}
            >
              <div
                style={{
                  textAlign: "right",
                  padding: 5,
                  marginRight: 5,
                  cursor: "pointer",
                }}
                onClick={handleRouteModalClose}
              >
                x
              </div>
              <DialogTitle style={{ fontSize: 18 }}>
                Adding New Student to the Route
              </DialogTitle>
              <DialogContent>
                <div>
                  <label className={classes.label}>Student First Name:</label>
                  <input
                    id="FirstName"
                    className={classes.textField}
                    placeholder="Type name here..."
                    required
                  />
                  <div hidden={!routeNameError} className={classes.error}>
                    Name cannot be blank.
                  </div>
                </div>
                <div>
                  <label className={classes.label}>Student Last Name:</label>
                  <input
                    id="LastName"
                    className={classes.textField}
                    placeholder="Type name here..."
                    required
                  />
                  <div hidden={!routeNameError} className={classes.error}>
                    Name cannot be blank.
                  </div>
                </div>
                <div>
                  <label className={classes.label}>Student ID:</label>
                  <input
                    id="studentID"
                    className={classes.textField}
                    placeholder="Type name here..."
                    required
                  />
                  <div hidden={!routeNameError} className={classes.error}>
                    Name cannot be blank.
                  </div>
                </div>
                <div>
                  <label className={classes.label}>School Name:</label>
                  <input
                    id="schoolName"
                    className={classes.textField}
                    placeholder="Type name here..."
                    required
                  />
                  <div hidden={!routeNameError} className={classes.error}>
                    Name cannot be blank.
                  </div>
                </div>
                <div>
                  <label className={classes.label}>Grade:</label>
                  <input
                    id="grade"
                    className={classes.textField}
                    placeholder="Type name here..."
                    required
                  />
                  <div hidden={!routeNameError} className={classes.error}>
                    Name cannot be blank.
                  </div>
                </div>
              </DialogContent>
              <div hidden={!newRouteError} className={classes.error}>
                Sorry, an error occurred. Cannot create new student in route.
              </div>
              <DialogActions>
                <Button
                  style={{ margin: 5 }}
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => {
                    let studentFirstName =
                      document.getElementById("FirstName").value;
                    let studentLastName =
                      document.getElementById("LastName").value;
                    let studentId = document.getElementById("studentID").value;
                    let grade = document.getElementById("grade").value;
                    let school = document.getElementById("schoolName").value;

                    handleStudentCreate(
                      studentFirstName,
                      studentLastName,
                      studentId,
                      school,
                      grade
                    );
                  }}
                >
                  Create
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>

        <table className={classes.table}>
          <thead
            style={{
              backgroundColor: "#E0E0E0",
              width: "calc( 100% - 1em )",
            }}
          >
            <tr className={classes.tr}>
              <th className={classes.th}>Student Name</th>
              <th className={classes.th}>School </th>
              <th className={classes.th}>Grade </th>
              <th className={classes.th}>Contact </th>
              <th className={classes.th}>Emergency </th>
            </tr>
          </thead>

          <tbody className={classes.tbody}>
            {studentList.map((entry, index) => (
              <tr key={index} className={classes.tr}>
                <td scope="col">{entry.firstName + " " + entry.lastName}</td>
                <td scope="col">{entry.schoolName}</td>
                <td scope="col">{entry.grade}</td>
                <td scope="col">None</td>
                <td scope="col">None</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={classes.routeTabs}>
        <ButtonGroup
          size="large"
          variant="contained"
          color="primary"
          style={{ margin: 10 }}
        >
          {routes.map((route) => (
            <Button
              onClick={() => {
                setSelectedRoute(route);
                updateName(route.name);
              }}
            >
              {route.name}
            </Button>
          ))}
        </ButtonGroup>
        <Fab style={{ margin: 10 }} color="primary" onClick={addRoute}>
          <AddIcon />
        </Fab>
        <Dialog
          style={{ padding: 10, margin: 10, minWidth: 600 }}
          open={addRouteModalOpen}
          onClose={handleRouteModalClose}
        >
          <div
            style={{
              textAlign: "right",
              padding: 5,
              marginRight: 5,
              cursor: "pointer",
            }}
            onClick={handleRouteModalClose}
          >
            x
          </div>
          <DialogTitle style={{ fontSize: 18 }}>
            Creating New Bus Route
          </DialogTitle>
          <DialogContent>
            <div>
              <label className={classes.label}>Bus Route Name:</label>
              <input
                id="ModalName"
                className={classes.textField}
                placeholder="Type name here..."
                required
              />
              <div hidden={!routeNameError} className={classes.error}>
                Name cannot be blank.
              </div>
            </div>
            <div>
              <label className={classes.label}>
                Upload Student Data (.csv):
              </label>
              <If condition={!selectedFile}>
                <Then>
                  <Button
                    className={classes.textField}
                    variant="contained"
                    color="secondary"
                    size="small"
                  >
                    <label>
                      Select file
                      <input
                        type="file"
                        id="students-csv"
                        name="students-csv"
                        accept="csv"
                        onChange={(event) => handleUpload(event.target.files)}
                      />
                    </label>
                  </Button>
                </Then>
                <Else>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <p>{selectedFile.name}</p>
                    <IconButton onClick={() => setSelectedFile("")}>
                      <RemoveCircleOutline />
                    </IconButton>
                  </div>
                </Else>
              </If>
            </div>
          </DialogContent>
          <div hidden={!newRouteError} className={classes.error}>
            Sorry, an error occurred. Cannot create new route.
          </div>
          <DialogActions>
            <Button
              style={{ margin: 5 }}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                modalName = document.getElementById("ModalName").value;
                handleRouteCreate(modalName);
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const clubRoutes = await getRoutesByClub(context.query.club);
  const routeIds = await getRoutesByIds(clubRoutes);
  return {
    props: {
      clubName: context.query.club,
      savedRoutes: JSON.parse(JSON.stringify(routeIds)),
    },
  };
}

export default BusRoutes;
