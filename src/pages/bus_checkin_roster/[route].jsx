import React, { useEffect, useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import EditIcon from "@material-ui/icons/Edit";
import Link from "next/link";
import { useRouter } from "next/router";
import ModalComponent from "../../components/modal";
import urls from "../../../utils/urls";

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
    background: "white",
    "&:hover": {
      cursor: "pointer",
    },
  },
  header: {
    display: "grid",
    width: "100%",
    gridTemplateColumns: "1fr repeat(3, auto) 1fr",
    gridColumnGap: "5px",
    justifyItems: "center",
    alignItems: "center",
  },
  btn: {
    borderRadius: "20px",
    margin: "5px",
    border: "none",
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
    width: "calc( 100% - 1em )",
    backgroundColor: "#828282",
    padding: "10px",
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
  ModalButton: {
    display: "flex",
    alignItems: "center",
    borderRadius: "40px",
    marginLeft: "auto",
    backgroundColor: "white",
    opacity: "60%",
    border: "none",
    boxShadow: "none",
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
    width: "500px",
    height: " 300px",
    backgroundColor: "white",
    left: "50%",
    marginLeft: "-250px",
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
  const idRes = await fetch(`${urls.baseUrl}${urls.api.routes}?name=${route}`);
  const routeMeta = await idRes.json();
  return routeMeta.payload[0];
};

const Roster = () => {
  const router = useRouter();
  const classes = useStyles();
  const { route } = router.query;
  const [routeId, setRouteId] = useState(null);
  const [students, setStudents] = useState([]);
  const [complete, setComplete] = useState(true); //defaults to true to prevent changes during render

  const submitAttendance = async (curDate, submissionNotes) => {
    // update student checkIn
    await fetch(`${urls.baseUrl}${urls.api.checkIn}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentIDs: students.filter((s) => s.checkedIn).map((s, i) => s.id),
      }),
    });

    //update routes
    await fetch(`${urls.baseUrl}${urls.api.routes}?id=${routeId}`, {
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

    router.replace(urls.pages.route_selection);
  };

  const submitNote = (index, note) => {
    let modifiedStudents = [...students];
    const { name, id, checkedIn } = students[index];
    modifiedStudents[index] = {
      name: name,
      id: id,
      checkedIn: checkedIn,
      note,
    };
    setStudents(modifiedStudents);
  };

  const checkInStudent = async (index) => {
    let modifiedStudents = [...students];
    const { name, id } = students[index];
    modifiedStudents[index] = {
      name: name,
      id: id,
      checkedIn: true,
      note: "",
    };
    setStudents(modifiedStudents);

    await fetch(`${urls.baseUrl}${urls.api.checkIn}?id=${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        time: getCurrentDate(),
      }),
    });
  };

  const SubmitModalContent = () => {
    const [note, setNote] = React.useState("");

    return (
      <form
        className={classes.ModalContent}
        onSubmit={(e) => {
          e.preventDefault();
          submitAttendance(getCurrentDate(), note);
        }}
        style={{
          width: "750px",
          height: "350px",
          marginLeft: "-375px",
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
          style={{ width: "600px", height: "100x" }}
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
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
            onClick={() => console.log("clicked!")}
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

  const NoteModalContent = (props) => {
    const [studentNote, setStudentNote] = React.useState(
      students[props.index].note
    );
    return (
      <form
        className={classes.ModalContent}
        onSubmit={() => {
          submitNote(props.index, studentNote);
          setStudentNote("");
        }}
      >
        <h1 style={{ margin: "0" }}>Add/Edit Note</h1>
        <textarea
          rows="10"
          cols="30"
          name="note"
          type="text"
          placeholder="Type your note here"
          style={{ width: "450px", height: "150x" }}
          value={studentNote}
          onChange={(e) => {
            setStudentNote(e.target.value);
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

  const EditButton = () => (
    <>
      <EditIcon /> Edit Note
    </>
  );

  const AddButton = () => (
    <>
      <AddIcon />
      Add Note
    </>
  );

  const StudentCheckedIn = (props) => {
    return (
      <td className={classes.checkedIn}>
        <p style={{ gridColumnStart: "4" }}>Checked In</p>
        <div style={{ marginLeft: "auto", marginRight: "5px" }}>
          <ModalComponent
            button={props.justCheckedIn ? <AddButton /> : <EditButton />}
            style={{ marginLeft: "auto" }}
            buttonStyle={classes.ModalButton}
          >
            <NoteModalContent index={props.index} />
          </ModalComponent>
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

  const getInitialStudents = async () => {
    const curDate = getCurrentDate();
    const selectedRoute = await getRouteMeta(route);
    setRouteId(selectedRoute._id);
    setComplete(
      selectedRoute.checkIns.some((checkIn) => checkIn.date === curDate)
    );
    const studentRes = await fetch(
      `${urls.baseUrl}${urls.api.student}?route=${selectedRoute._id}`
    );
    const d = await studentRes.json();

    let data = [];
    if (d.success) {
      const dateObj = new Date();
      const day = String(dateObj.getDate()).padStart(2, "0");
      const today = `${dateObj.getMonth() + 1}/${day}/${dateObj.getFullYear()}`;
      for (const student of d.payload) {
        data.push({
          name: `${student.firstName} ${student.lastName}`,
          id: student.studentID,
          //new to old
          checkedIn:
            student.checkInTimes.sort(
              (a, b) => Date.parse(b) - Date.parse(a)
            )[0] === today,
          note: "",
        });
      }
    }
    setStudents(data);
  };

  useEffect(async () => {
    route && (await getInitialStudents());
  }, [route]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Link href={urls.pages.route_selection}>
          <button className={classes.backbtn}>
            <ArrowBackIosIcon />
            <h1 className={classes.text}>Back </h1>
          </button>
        </Link>
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
      <ModalComponent
        button={<h1 style={{ margin: "0px" }}>Submit</h1>}
        buttonStyle={classes.mainSubmitBtn}
        disabled={complete}
      >
        <SubmitModalContent />
      </ModalComponent>
    </div>
  );
};

export { getCurrentDate };
export default Roster;
