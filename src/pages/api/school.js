/* eslint-disable no-use-before-define */
import useCors from "./corsMiddleware";
import {
  findAllSchools,
  findSchoolInfo,
  findStudentInfoBySchool,
} from "../../../server/mongodb/actions/Student";

export default async (req, res) => {
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

  findSchoolInfo(ids)
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

  findStudentInfoBySchool(schoolName)
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
  findAllSchools()
    .then((schools) => {
      res.status(200).send({
        success: true,
        payload: schools,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: err,
      });
    });
}
