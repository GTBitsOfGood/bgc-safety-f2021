/* eslint-disable no-use-before-define */
import mongoDB from "../../../server/mongodb/index";
import Student from "../../../server/mongodb/models/Student";
import Club from "../../../server/mongodb/models/Club";
import useCors from "./corsMiddleware";

export default async (req, res) => {
  await mongoDB();

  await useCors(req, res);

  const { method } = req;

  if (method === "GET" && req.query.ids) {
    getSchoolInfo(req, res);
  } else if (method === "GET" && req.query.schoolName) {
    getStudentInfo(req, res);
  } else if (method === "GET") {
    getAllSchools(req, res);
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

function getSchoolInfo(req, res) {
  const { ids } = req.query;

  Student.find(
    {
      studentID: { $in: ids },
    },
    {
      schoolName: 1,
    }
  )
    .then((schoolList) => {
      res.status(200).send({
        success: true,
        payload: schoolList,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        error: err,
      });
    });
}

function getStudentInfo(req, res) {
  const { schoolName } = req.query;

  Student.find({
    schoolName,
  })
    .then((students) => {
      res.status(200).send({
        success: true,
        payload: students,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        error: err,
      });
    });
}

function getAllSchools(req, res) {
  Club.find()
    .then((clubs) => {
      res.status(200).send({
        success: true,
        payload: clubs.reduce((acc, club) => acc.concat(club.SchoolNames), []),
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: err,
      });
    });
}
