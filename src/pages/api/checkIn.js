/* eslint-disable no-use-before-define */
import mongoDB from "../../../server/mongodb/index";
import Student from "../../../server/mongodb/models/Student";
import useCors from "./corsMiddleware";

export default async (req, res) => {
  await mongoDB();

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
  Student.findOne({ _id: id })
    .then((student) => {
      res.status(200).send({
        success: true,
        payload: student.checkIns,
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

  Student.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $push: {
        checkIns: {
          date,
          note: "",
        },
      },
    },
    {
      new: true,
    }
  )
    .then((student) => {
      res.status(200).send({
        success: true,
        payload: student.checkIns,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        error: err,
      });
    });
}
