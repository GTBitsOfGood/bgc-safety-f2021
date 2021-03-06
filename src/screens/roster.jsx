import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import modalStyles from "../components/Modal.module.css";
import TextField from "@material-ui/core/TextField";
import styles from "./roster.module.css";
import ModalComponent from "../components/modal";
import urls from "../../utils/urls";
import { useSession } from "next-auth/client";
import ModalButton from "../components/ModalButton";
import Router from "next/router";
import { useUserAuthorized } from "../../utils/userType";
import { getSchoolsByClub } from "../../server/mongodb/actions/Club";
import { findBusAttendanceInfo } from "../../server/mongodb/actions/Student";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const useStyles = makeStyles((theme) => ({
  ModalContent: {
    position: "absolute",
    width: "500px",
    height: " 300px",
    boxShadow: theme.shadows[5],
    backgroundColor: "white",
    left: "50%",
    marginLeft: "-250px",
    top: "50%",
    marginTop: "-150px",
    padding: theme.spacing(2, 4, 3),
    display: "flex",
    flexFlow: "column wrap",
    textAlign: "center",
    justifyModalContent: "space-around",
  },
  button: {
    width: "100%",
    backgroundColor: "#F2C94C",
    border: "none",
    boxShadow: "none",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyModalContent: "center",
    "&:hover": {
      cursor: "pointer",
    },
  },
  icon: {
    marginLeft: "5px",
    width: "15px",
    height: "15px",
    color: "#F2994A",
  },
  tr: {
    "&:nth-child(even)": {
      backgroundColor: "#efefef",
    },
  },
  students: {
    height: "45px",
    overflow: "hidden",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    width: "25%",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "2%",
    justifyContent: "center",
  },
  formHeading: {
    textAlign: "center",
    paddingBottom: "20px",
  },
  formButton: {
    height: "3em",
  },
  formInput: {
    paddingBottom: "10px",
  },
  datePicker: {
    width: "10rem",
    margin: "0.5rem",
    marginTop: "0rem"
  },
  button: {
    margin: '0.5rem',
  },
  datePickerWrap: {
    display: "flex",
    flexDirection: "column",
    height: "8rem",
    width: "12rem",
    backgroundColor: "rgba(128, 128, 128, 0.39)",
    marginBottom: "2rem",
    padding: "1rem",
    paddingTop: "0.5rem",
    marginLeft: "1rem",
    boxShadow: "0.05rem 0.05rem 0.3rem black"
  },
}));

const getNumberCheckedIn = (school, selectedDate) => {
  let count = 0;
  for (let i = 0; i < school.students.length; i += 1) {
    let currentStudent = school.students[i];
    if (currentStudent.checkIn && currentStudent.checkedInDates.some((checkIn) => checkIn === selectedDate)) {
      count++;
    }
  }
  return ` ${count}/${school.students.length}`;
}

const Roster = ({ notFound, clubName, schools }) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [student, setStudent] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentSchool, setStudentSchool] = useState("");
  const [session, loading] = useSession();
  const userAuthorized = useUserAuthorized(session, urls.pages.roster);
  const [date, setDate] = useState(null);
  const [capacity, setCapacity] = useState(schools.map((school) => getNumberCheckedIn(school, new Date())));

  const handleSubmit = () => {
    setStudent({ firstName, lastName, studentSchool });
    setModalOpen(false);
    // add to database
  };

  const handleClear = () => {
    setDate(null);
    setCapacity(schools.map((school) => getNumberCheckedIn(school, new Date())));
  }

  const handleUpdate = () => {
    if (date != null) {
      const selectedDate = formatDate(date);
      const newCapacity = schools.map((school) => getNumberCheckedIn(school, selectedDate));
      setCapacity(newCapacity);
    }
  }

  const formatDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const formatted = `${dateObj.getMonth() + 1}/${day}/${dateObj.getFullYear()}`;
    return formatted;
  }

  if (notFound || !session || !userAuthorized) {
    return <div />;
  }

  return (
    <div id="main">
      <h1>{`${clubName} Boys and Girls Club`}</h1>
      <div className={classes.datePickerWrap}>
        <h3 className={classes.datePickerText}>View Bus Capacity</h3>
        <div className={classes.datePickerContainer}>
          <div>
            <DatePicker
              placeholderText="Select Date"
              selected={date}
              selectsStart
              startDate={date}
              onChange={date => setDate(date)}
              className={classes.datePicker}
            />
          </div>
          <div>
            <button
              type="button"
              className={classes.button}
              onClick={() => handleClear()}
            >
              Clear
            </button>
            <button
              type="button"
              className={classes.button}
              onClick={() => handleUpdate()}
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <div className={styles.roster}>
        <div>
          {schools.map((school, index) => (
            <table className={styles.table}>
              <thead>
                <tr className={styles.tr}>
                  <th className={styles.busth}>
                    Bus A Cap
                    {capacity[index]}
                  </th>
                </tr>
                <tr style={{ height: "10px" }} />
                <tr className={styles.tr}>
                  <th className={styles.th}>{school.name}</th>
                </tr>
              </thead>
              <tbody>
                {school.students.map((student) => (
                  <tr className={classes.tr}>
                    <div className={classes.students}>
                      <td
                        className={styles.td}
                        color={student.checkedIn ? "success" : ""}
                      >
                        {student.name}
                        {student.checkedIn && (
                          <CheckCircleIcon
                            style={{
                              alignSelf: "flex-end",
                              marginLeft: "auto",
                              fill: "white",
                            }}
                          />
                        )}
                      </td>
                    </div>
                  </tr>
                ))}
                <tr>
                  <ModalButton
                    setOpen={() => setModalOpen(true)}
                    buttonStyle={classes.button}
                  >
                    <>
                      Manually Add Entry
                      <AddCircleIcon className={classes.icon} />
                    </>
                  </ModalButton>
                  <ModalComponent open={modalOpen} setStudent={setStudent}>
                    <form className={classes.form} onSubmit={handleSubmit}>
                      <h1 className={classes.formHeading}>
                        Manually Add Entry
                      </h1>
                      <TextField
                        className={classes.formInput}
                        id="firstName"
                        name="firstName"
                        type="text"
                        label="First Name"
                        value={firstName}
                        variant="filled"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <TextField
                        className={classes.formInput}
                        id="lastName"
                        type="text"
                        label="Last Name"
                        value={lastName}
                        variant="filled"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <TextField
                        className={classes.formInput}
                        id="school"
                        type="text"
                        label="School/Pickup Location"
                        value={studentSchool}
                        variant="filled"
                        onChange={(e) => setStudentSchool(e.target.value)}
                      />
                      <button
                        type="submit"
                        className={`btn btn-success ${classes.formButton}`}
                      >
                        Add Student
                      </button>
                    </form>
                  </ModalComponent>
                </tr>
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </div>
  );
}

// Declaring type of schools prop
Roster.propTypes = {
  clubName: PropTypes.string.isRequired,
  schools: PropTypes.arrayOf(PropTypes.object),
};

// Setting default value for schools prop
Roster.defaultProps = {
  clubName: "",
  schools: null,
};

export async function getServerSideProps(context) {
  let clubName = context.query.ClubName;
  if (clubName === undefined) {
    clubName = "Harland";
  }

  const schoolData = await getSchoolsByClub(clubName);

  let schoolList = [];
  if (schoolData.length > 0) {
    schoolList = schoolData[0].SchoolNames;
  } else {
    return {
      notFound: true,
    }
  }

  const dateObj = new Date();
  const day = String(dateObj.getDate()).padStart(2, "0");
  const today = `${dateObj.getMonth() + 1}/${day}/${dateObj.getFullYear()}`;

  const data = schoolList.map((school) => {
    return findBusAttendanceInfo(school).then((d) => {
      const schoolStudents = d.map((student) => ({
        name: `${student.firstName} ${student.lastName}`,
        checkedIn: student.checkIns.some((checkIn) => checkIn.date === today),
        checkedInDates: student.checkIns
      }));
      return {
        name: school,
        students: schoolStudents,
      };
    });
  });

  return { props: { clubName: clubName, schools: await Promise.all(data) } };
}

export default Roster;
