/* eslint-disable no-use-before-define */
import mongoDB from "../../../server/mongodb/index";
import Student from "../../../server/mongodb/models/Student";
import useCors from "./corsMiddleware";

export default async (req, res) => {
  await mongoDB();

  await useCors(req, res);

  const { method } = req;
  if (method == "POST" && req.query.id !== undefined) {
    checkInStudent(req, res);
  } else if (method === "POST") {
    checkInStudentsToday(req, res);
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

function checkInStudentsToday(req, res) {
  const { studentIDs } = req.body;

  const dateObj = new Date();
  const day = String(dateObj.getDate()).padStart(2, "0");
  const today = `${dateObj.getMonth() + 1}/${day}/${dateObj.getFullYear()}`;

  Student.updateMany(
    {
      studentID: { $in: studentIDs },
    },
    {
      $addToSet: { checkInTimes: today },
    },
    {
      new: true,
    }
  )
    .then((student) => {
      res.status(200).json({
        success: true,
        payload: student.checkInTimes,
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
  const { time } = req.body;

  Student.findOneAndUpdate(
    {
      studentID: id,
    },
    {
      $push: { checkInTimes: time },
    },
    {
      new: true,
    }
  )
    .then((student) => {
      res.status(200).send({
        success: true,
        payload: student.checkInTimes,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        error: err,
      });
    });
}
