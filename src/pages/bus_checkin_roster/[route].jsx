import React from "react";
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
    overflowX: "hidden"
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

let initial = false;
const Roster = () => {
  const router = useRouter();
  const classes = useStyles();
  const { route } = router.query;
  const [students, setStudents] = React.useState([]);

  const submitAttendance = async (index) => {
    // show modal
    const res = await fetch(`${urls.baseUrl}/api/checkIn`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentIDs: students.filter((s) => s.checkedIn).map((s, i) => s.id),
      }),
    });
    const d = await res.json();
  };

  const submitNote = (index, note) => {
    setStudents(
      students.map((student, i) => {
        if (index == i) {
          return { name: student.name, id: student.id, checkedIn: true, note };
        }
        return student;
      })
    );
  };

  const checkInStudent = (index) => {
    setStudents(
      students.map((student, i) => {
        if (index == i) {
          return {
            name: student.name,
            id: student.id,
            checkedIn: true,
            note: "",
          };
        }
        return student;
      })
    );
  };

  const SubmitModalContent = () => {
    let date = new Date();
    date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const [note, setNote] = React.useState("");

    return (
      <form
        className={classes.ModalContent}
        onSubmit={submitAttendance}
        style={{
          width: "550px",
          height: "350px",
          marginLeft: "-275px",
          marginTop: "-175px",
        }}
      >
        <h1 style={{ margin: "0" }}>Submission Notice</h1>
        <p style={{ margin: "0" }}>
          You are about to submit attendance for {date}
        </p>
        <textarea
          rows="10"
          cols="30"
          name="note"
          type="text"
          placeholder="Type your note here"
          style={{ width: "400px", height: "100x" }}
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
            buttonStyle={props.justCheckedIn ? classes.addBtn : classes.editBtn}
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
    let schoolName = route;
    let data = [];

    const res1 = await fetch(
      `${urls.baseUrl}/api/school?schoolName=${schoolName}`
    );
    const d = await res1.json();

    if (d.success) {
      const dateObj = new Date();
      const day = String(dateObj.getDate()).padStart(2, "0");
      const today = `${dateObj.getMonth() + 1}/${day}/${dateObj.getFullYear()}`;
      for (const student of d.payload) {
        data.push({
          name: `${student.firstName} ${student.lastName}`,
          id: student.studentID,
          checkedIn: student.checkInTimes.includes(today),
          note: "",
        });
      }
    }
    setStudents(data);
  };

  if (!initial && router.query.route !== undefined) {
    initial = true;
    getInitialStudents();
  }

  return (
    <div className={classes.container}>
      <div className={classes.btnContainer}>
       <Link href="/route_selection">
          <button className={classes.backbtn}>
            <ArrowBackIosIcon />
            <h1 className={classes.btnText}>Back </h1>
          </button>
        </Link>
      </div>
      <div className={classes.header}>
        <h1>{route}</h1>
      </div>
      <table style={{ width: "100%" }}>
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
      >
        <SubmitModalContent />
      </ModalComponent>
    </div>
  );
};

export default Roster;
