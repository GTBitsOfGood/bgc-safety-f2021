/* eslint-disable no-use-before-define */
import {
  findBusAttendanceInfo,
  getCurDayStudentAttendanceByClub,
  getCurDayStudentAttendanceBySchool,
  getSchoolAttendanceByTimeRange,
  getStudentAttendance,
  getStudentAttendanceByTimeRange,
} from "../../../server/mongodb/actions/Student";
import useCors from "./corsMiddleware";

export default async (req, res) => {
  await useCors(req, res);

  const { method } = req;

  if (method === "GET" && req.query.club) {
    getStudentAttendanceTodayByClub(req, res);
  } else if (method === "GET" && req.query.school) {
    getStudentAttendanceTodayBySchool(req, res);
  } else if (method === "GET" && req.query.schoolName) {
    getBusAttendanceInfo(req, res);
  } else if (
    method === "GET" &&
    req.query.studentID &&
    req.query.startDate &&
    req.query.endDate
  ) {
    getStudentAttendanceTimeRange(req, res);
  } else if (method === "GET" && req.query.studentID) {
    getAttendanceOfStudent(req, res);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end("Method ${method} Not Allowed");
  }
};

function getBusAttendanceInfo(req, res) {
  const { schoolName } = req.query;

  findBusAttendanceInfo(schoolName)
    .then((checkIns) =>
      res.status(200).send({
        success: true,
        payload: checkIns,
      })
    )
    .catch((err) =>
      res.status(400).send({
        success: false,
        message: err,
      })
    );
}

function getAttendanceOfStudent(req, res) {
  const { studentID } = req.query;

  getStudentAttendance(studentID)
    .then((checkIns) =>
      res.status(200).send({
        success: true,
        payload: checkIns,
      })
    )
    .catch((err) =>
      res.status(400).send({
        success: false,
        message: err,
      })
    );
}

function getStudentAttendanceTodayBySchool(req, res) {
  const { school } = req.query;

  getCurDayStudentAttendanceBySchool(school)
    .then((students) =>
      res.status(200).send({
        success: true,
        payload: students,
      })
    )
    .catch((err) =>
      res.status(400).send({
        success: false,
        message: err,
      })
    );
}

function getStudentAttendanceTodayByClub(req, res) {
  const { club } = req.query;

  getCurDayStudentAttendanceByClub(club)
    .then((students) =>
      res.status(200).send({
        success: true,
        payload: students,
      })
    )
    .catch((err) =>
      res.status(400).send({
        success: false,
        message: err,
      })
    );
}

function getStudentAttendanceTimeRange(req, res) {
  const { studentID, startDate, endDate } = req.query;

  getStudentAttendanceByTimeRange(studentID, startDate, endDate)
    .then((attendance) =>
      res.status(200).send({
        success: true,
        payload: attendance,
      })
    )
    .catch((err) =>
      res.status(400).send({
        success: false,
        message: err,
      })
    );
}

export function filterTimes(startDate, endDate, checkIns) {
  try {
    var filteredDates = [];
    let date;
    for (date of checkIns) {
      if (
        Date.parse(date.date) >= startDate &&
        Date.parse(date.date) <= endDate
      ) {
        filteredDates.push(date);
      }
    }
  } catch (e) {
    console.log(e);
  }

  return filteredDates;
}

function getSchoolAttendanceTimeRange(req, res) {
  const { schoolName, startDate, endDate } = req.query;

  getSchoolAttendanceByTimeRange(schoolName, startDate, endDate)
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

export function convertToDict(startDate, endDate, students) {
  const dict = {};

  try {
    let student;
    for (student of students) {
      var date;
      for (date of student.checkIns) {
        if (
          Date.parse(date.date) >= startDate &&
          Date.parse(date.date) <= endDate
        ) {
          if (dict[date] == undefined) {
            dict[date] = [];
          }
          dict[date].push(student);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }

  return dict;
}
