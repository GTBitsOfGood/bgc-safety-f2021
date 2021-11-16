/* eslint-disable no-use-before-define */
import {
  findStudentCheckIns,
  markStudentCheckIn,
} from "../../../server/mongodb/actions/Student";
import useCors from "./corsMiddleware";

export default async (req, res) => {
  await useCors(req, res);

  const { method } = req;
  if (method === "GET") {
    getStudentCheckIns(req, res);
  } else if (method === "POST") {
    checkInStudent(req, res);
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

function getStudentCheckIns(req, res) {
  const { id } = req.query;
  findStudentCheckIns(id)
    .then((checkIns) => {
      res.status(200).send({
        success: true,
        payload: checkIns,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        error: err,
      });
    });
}

function checkInStudent(req, res) {
  const { id } = req.query;
  const { date } = req.body;

  markStudentCheckIn(id, date)
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
