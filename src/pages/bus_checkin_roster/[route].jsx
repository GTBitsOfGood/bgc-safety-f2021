import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { Alert, Snackbar } from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import EditIcon from "@material-ui/icons/Edit";
import Link from "next/link";
import { useRouter } from "next/router";
import ModalComponent from "../../components/modal";
import urls from "../../../utils/urls";
import ModalButton from "../../components/ModalButton";
import { useSession } from "next-auth/client";
import Router from "next/router";
import { useUserAuthorized } from "../../../utils/userType";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  backbtn: {
    display: "flex",
    alignItems: "center",
    outline: "none",
    border: "none",
    marginRight: "auto",
    backgroundColor: "#C4C4C4",
    borderRadius: "20px",
    padding: "5px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  header: {
    display: "grid",
    width: "100%",
    justifyItems: "center",
    alignItems: "center",
  },
  btn: {
    borderRadius: "20px",
    margin: "5px",
    border: "none",
  },
  btnContainer: {
    justifyContent: "left",
    width: "100%",
  },
  btnText: {
    fontSize: "medium",
  },
  text: {
    margin: "5px",
  },
  tbody: {
    display: "block",
    height: "500px",
    overflowY: "scroll",
    overflowX: "hidden",
  },
  th: {
    width: "calc( 100% - 1em)",
    backgroundColor: "#828282",
    padding: "5px",
  },
  td: {
    textAlign: "center",
    width: "fill",
    padding: "5px",
  },
  tr: {
    display: "table",
    width: "100%",

    tableLayout: "fixed",
    "&:nth-child(even)": {
      backgroundColor: "#efefef",
    },
  },
  mainSubmitBtn: {
    backgroundColor: "#C4C4C4",
    borderRadius: "20px",
    margin: "5px",
    border: "none",
    padding: "15px",
    "&:hover": {
      cursor: "pointer",
    },
  },

  checkedIn: {
    display: "grid",
    gridTemplateColumns: "1fr repeat(3, auto) 1fr",
    gridColumnGap: "5px",
    justifyItems: "center",
    alignItems: "center",
    backgroundColor: "#6FCF97",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    borderRadius: "40px",
    marginLeft: "auto",
    backgroundColor: "white",
    opacity: "90%",
    borderStyle: "black",
    "&:hover": {
      cursor: "pointer",
    },
  },
  editBtn: {
    display: "flex",
    alignItems: "center",
    borderRadius: "40px",
    marginLeft: "auto",
    backgroundColor: "white",
    opacity: "65%",
    borderStyle: "white",
    "&:hover": {
      cursor: "pointer",
    },
  },
  submitBtn: {
    width: "40%",
    borderRadius: "30px",
  },
  ModalContent: {
    position: "absolute",
    width: "450px",
    height: " 350px",
    backgroundColor: "white",
    left: "50%",
    marginLeft: "-225px",
    top: "50%",
    marginTop: "-150px",
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "space-around",
    alignItems: "center",
  },
}));

const getCurrentDate = () => {
  const dateObj = new Date();
  const day = String(dateObj.getDate()).padStart(2, "0");
  const today = `${dateObj.getMonth() + 1}/${day}/${dateObj.getFullYear()}`;
  return today;
};

const getRouteMeta = async (route) => {
  const idRes = await fetch(`${urls.api.routes}?name=${route}`);
  const routeMeta = await idRes.json();
  return routeMeta.payload;
};

const Roster = () => {
  const router = useRouter();
  const classes = useStyles();
  const [session, loading] = useSession();
  const { route } = router.query;
  const [routeId, setRouteId] = useState(null);
  const [students, setStudents] = useState([]);
  const [complete, setComplete] = useState(true); //defaults to true to prevent changes during render
  const [studentIndex, setStudentIndex] = useState(0);
  const [studentNoteModalOpen, setStudentNoteModalOpen] = useState(false);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const userAuthorized = useUserAuthorized(
    session,
    urls.pages.bus_checkin_roster
  );

  const submitAttendance = async (curDate, submissionNotes) => {
    //update routes
    const routeRes = await fetch(`${urls.api.routes}?id=${routeId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        submissionDetails: {
          date: curDate,
          notes: submissionNotes,
        },
      }),
    });

    if (routeRes.ok) {
      setSuccessOpen(true);
      await getStudents();
    } else {
      setErrorOpen(true);
    }
  };

  const submitNote = async (index, note) => {
    let modifiedStudents = [...students];
    const { name, _id, checkedIn } = students[index];
    modifiedStudents[index] = {
      name: name,
      _id: _id,
      checkedIn: checkedIn,
      note,
    };
    setStudents(modifiedStudents);

    await fetch(`${urls.api.notes}?id=${_id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: getCurrentDate(),
        note,
      }),
    });
  };

  const checkInStudent = async (index) => {
    let modifiedStudents = [...students];
    const { name, _id } = students[index];
    modifiedStudents[index] = {
      name: name,
      _id,
      checkedIn: true,
      note: "",
    };
    setStudents(modifiedStudents);

    await fetch(`${urls.api.checkIn}?id=${_id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: getCurrentDate(),
      }),
    });
  };

  const SubmitModalContent = () => {
    const [submissionNote, setSubmissionNote] = useState("");

    return (
      <form
        className={classes.ModalContent}
        onSubmit={async (e) => {
          e.preventDefault();
          await submitAttendance(getCurrentDate(), submissionNote);
          setSubmissionModalOpen(false);
        }}
        style={{
          width: "450px",
          height: "350px",
          marginLeft: "-225px",
          marginTop: "-175px",
        }}
      >
        <h1 style={{ margin: "0" }}>Submission Notice</h1>
        <p style={{ margin: "0" }}>
          You are about to submit attendance for {getCurrentDate()}
        </p>
        <textarea
          rows="10"
          cols="30"
          name="note"
          type="text"
          placeholder="Type your note here"
          style={{ width: "400px", height: "100x" }}
          value={submissionNote}
          onChange={(e) => {
            setSubmissionNote(e.target.value);
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Button
            className={classes.submitBtn}
            style={{ backgroundColor: "#EB5757" }}
          >
            Back
          </Button>
          <Button
            type="submit"
            className={classes.submitBtn}
            style={{ backgroundColor: "#6FCF97" }}
          >
            Submit Note
          </Button>
        </div>
      </form>
    );
  };

  const NoteModalContent = () => {
    const [studentNoteInput, setStudentNoteInput] = useState(
      students[studentIndex].note
    );
    return (
      <form
        className={classes.ModalContent}
        onSubmit={(e) => {
          e.preventDefault();
          submitNote(studentIndex, studentNoteInput);
          setStudentNoteModalOpen(false);
        }}
      >
        <h1 style={{ margin: "0" }}>Add/Edit Note</h1>
        <textarea
          rows="10"
          cols="30"
          name="note"
          type="text"
          placeholder="Type your note here"
          style={{ width: "400px", height: "150x" }}
          value={studentNoteInput}
          onChange={(e) => {
            setStudentNoteInput(e.target.value);
          }}
        />
        <Button
          type="submit"
          className={classes.submitBtn}
          style={{ backgroundColor: "#6FCF97" }}
        >
          Submit Note
        </Button>
      </form>
    );
  };

  const EditButton = ({ onClick }) => (
    <div style={{ display: "flex", alignItems: "center" }} onClick={onClick}>
      <EditIcon />
      <span>Edit Note</span>
    </div>
  );

  const AddButton = ({ onClick }) => (
    <div style={{ display: "flex", alignItems: "center" }} onClick={onClick}>
      <AddIcon />
      <span>Add Note</span>
    </div>
  );

  const StudentCheckedIn = (props) => {
    return (
      <td className={classes.checkedIn}>
        <p style={{ gridColumnStart: "4" }}>Checked In</p>
        <div style={{ marginLeft: "auto", marginRight: "5px" }}>
          {props.justCheckedIn ? (
            <ModalButton
              setOpen={() => setStudentNoteModalOpen(true)}
              buttonStyle={classes.ModalButton}
            >
              <AddButton onClick={() => setStudentIndex(props.index)} />
            </ModalButton>
          ) : (
            <ModalButton
              setOpen={() => setStudentNoteModalOpen(true)}
              buttonStyle={classes.ModalButton}
            >
              <EditButton onClick={() => setStudentIndex(props.index)} />
            </ModalButton>
          )}
        </div>
      </td>
    );
  };

  const StudentNotCheckedIn = (props) => {
    return (
      <td className={classes.td}>
        <Button
          onClick={() => checkInStudent(props.index)}
          className={classes.btn}
          style={{ backgroundColor: "#C4C4C4", width: "80%" }}
          variant="outlined"
        >
          Tap to Check In
        </Button>
      </td>
    );
  };

  const getStudents = async () => {
    const curDate = getCurrentDate();
    const selectedRoute = await getRouteMeta(route);
    setRouteId(selectedRoute._id);
    setComplete(
      selectedRoute.checkIns.some((checkIn) => checkIn.date === curDate)
    );
    const studentRes = await fetch(
      `${urls.api.student}?route=${selectedRoute._id}`
    );
    const d = await studentRes.json();

    let data = [];
    if (d.success) {
      const today = getCurrentDate();
      for (const student of d.payload) {
        const sortedCheckIns = student.checkIns.sort(
          (a, b) => Date.parse(b.date) - Date.parse(a.date)
        );
        const checkedIn =
          sortedCheckIns.length > 0 && sortedCheckIns[0].date === today;
        data.push({
          name: `${student.firstName} ${student.lastName}`,
          _id: student._id,
          checkedIn,
          note: checkedIn ? sortedCheckIns[0].note : "",
        });
      }
    }
    setStudents(data);
  };

  useEffect(async () => {
    route && (await getStudents());
  }, [route]);

  if (!session || !userAuthorized) {
    return <div />;
  }

  return (
    <div className={classes.container}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={successOpen}
        autoHideDuration={3000}
        onClose={(e, r) => r !== "clickaway" && setSuccessOpen(false)}
      >
        <Alert severity="success" onClose={() => setSuccessOpen(false)}>
          Changes successfully saved.
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorOpen}
        autoHideDuration={3000}
        onClose={() => setErrorOpen(false)}
      >
        <Alert
          severity="error"
          onClose={(e, r) => r !== "clickaway" && setErrorOpen(false)}
        >
          Error saving changes.
        </Alert>
      </Snackbar>
      <div className={classes.header}>
        <Link href={urls.pages.route_selection}>
          <button className={classes.backbtn}>
            <ArrowBackIosIcon />
            <h1 className={classes.btnText}>Back </h1>
          </button>
        </Link>
      </div>
      <div className={classes.header}>
        <h1>{route}</h1>
      </div>
      <table
        style={{
          width: "100%",
          opacity: complete ? 0.5 : 1,
          pointerEvents: complete ? "none" : "auto",
        }}
      >
        <thead>
          <tr className={classes.tr}>
            <th className={classes.th} style={{ width: "25%" }}>
              Name
            </th>
            <th className={classes.th}>Status</th>
          </tr>
        </thead>
        <tbody className={classes.tbody}>
          {students.map((student, index) => (
            <tr className={classes.tr} key={index}>
              <td className={classes.td} style={{ width: "25%" }}>
                {student.name}
              </td>
              {student.checkedIn ? (
                <StudentCheckedIn
                  justCheckedIn={student.note == ""}
                  index={index}
                />
              ) : (
                <StudentNotCheckedIn index={index} />
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <ModalButton
        setOpen={() => setSubmissionModalOpen(true)}
        buttonStyle={classes.mainSubmitBtn}
        disabled={complete}
      >
        <h1 style={{ margin: "0px" }}>Submit</h1>
      </ModalButton>
      <ModalComponent
        open={submissionModalOpen}
        setOpen={setSubmissionModalOpen}
      >
        <SubmitModalContent />
      </ModalComponent>
      <ModalComponent
        open={studentNoteModalOpen}
        setOpen={setStudentNoteModalOpen}
        style={{ marginLeft: "auto" }}
      >
        <NoteModalContent />
      </ModalComponent>
    </div>
  );
};

export { getCurrentDate };
export default Roster;
