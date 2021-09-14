/* eslint-disable no-use-before-define */
import mongoDB from "../../../server/mongodb/index";
import Student from "../../../server/mongodb/models/Student";
import {
  updateStudentRoute,
  getStudentsByRoute,
} from "../../../server/mongodb/actions/Student";
import useCors from "./corsMiddleware";

export default async (req, res) => {
  await mongoDB();

  await useCors(req, res);

  const { method } = req;

  if (method === "POST") {
    createStudent(req, res);
  } else if (method === "PATCH" && req.query.route) {
    changeStudentRoute(req, res);
  } else if (method === "PATCH") {
    updateStudent(req, res);
  } else if (method === "DELETE") {
    deleteStudent(req, res);
  } else if (method === "GET" && req.query.school) {
    getStudentsOnBus(req, res);
  } else if (method === "GET" && req.query.route) {
    getStudentsForRoute(req, res);
  } else if (method === "GET") {
    getAllStudents(req, res);
  } else {
    res.setHeader("Allow", ["POST", "PATCH", "DELETE", "GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

function createStudent(req, res) {
  const {
    FirstName,
    LastName,
    StudentID,
    SchoolName,
    RouteId,
    Grade,
    ClubName,
    Notes,
    Picture,
  } = req.body;

  Student.create({
    firstName: FirstName,
    lastName: LastName,
    studentID: StudentID,
    schoolName: SchoolName,
    route: RouteId,
    grade: Grade,
    clubName: ClubName,
    notes: Notes,
    picture: Picture,
  })
    .then((student) =>
      res.status(201).send({
        success: true,
        payload: student,
      })
    )
    .catch((err) =>
      res.status(400).send({
        success: false,
        message: err,
      })
    );
}

function updateStudent(req, res) {
  const { id } = req.query;

  const {
    FirstName,
    LastName,
    StudentID,
    SchoolName,
    Grade,
    ClubName,
    Notes,
    Picture,
  } = req.body;

  Student.findOneAndUpdate(
    {
      studentID: id,
    },
    {
      firstName: FirstName,
      lastName: LastName,
      studentID: StudentID,
      schoolName: SchoolName,
      grade: Grade,
      clubName: ClubName,
      notes: Notes,
      picture: Picture,
    },
    {
      new: true,
    }
  )
    .then((student) =>
      res.status(200).send({
        success: true,
        payload: student,
      })
    )
    .catch((err) =>
      res.status(400).send({
        success: false,
        message: err,
      })
    );
}

function changeStudentRoute(req, res) {
  const { id, route } = req.query;
  console.log("here");
  updateStudentRoute(id, route)
    .then((student) => {
      res.status(200).send({
        success: true,
        payload: student,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        payload: err.message,
      });
    });
}

function deleteStudent(req, res) {
  const { id } = req.query;

  Student.findOneAndDelete({
    studentID: id,
  })
    .then((student) =>
      res.status(200).send({
        success: true,
        payload: student,
      })
    )
    .catch((err) =>
      res.status(400).send({
        success: false,
        message: err,
      })
    );
}

function getAllStudents(req, res) {
  Student.find()
    .then((students) => {
      res.status(200).send({
        success: true,
        payload: students,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: err,
      });
    });
}

function getStudentsByName(req, res) {
  const { first, last } = req.query;

  Student.findOne({
    firstName: first,
    lastName: last,
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
        message: err,
      });
    });
}

function getStudentsOnBus(req, res) {
  const { school } = req.query;

  Student.find({
    schoolName: school,
    onBus: true,
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
        message: err,
      });
    });
}

function getStudentsForRoute(req, res) {
  const { route } = req.query;

  getStudentsByRoute(route)
    .then((students) => {
      res.status(200).send({
        success: true,
        payload: students,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: err.message,
      });
    });
}
