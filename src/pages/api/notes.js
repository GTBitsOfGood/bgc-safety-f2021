/* eslint-disable no-use-before-define */
import {
  addStudentNote,
  deleteStudentNote,
} from "../../../server/mongodb/actions/Student";
import useCors from "./corsMiddleware";

export default async (req, res) => {
  await useCors(req, res);

  const { method } = req;
  if (method === "POST") {
    addNote(req, res);
  } else if (method === "DELETE") {
    deleteNote(req, res);
  } else {
    res.setHeader("Allow", ["POST", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

function addNote(req, res) {
  const { id } = req.query;
  const { note, date } = req.body;

  addStudentNote(id, note, date)
    .then((checkIns) => {
      res.status(200).send({
        success: true,
        payload: checkIns,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        error: err,
      });
    });
}

function deleteNote(req, res) {
  const { id } = req.query;

  deleteStudentNote(id)
    .then(() => {
      res.status(200).send({
        success: true,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        error: err,
      });
    });
}
