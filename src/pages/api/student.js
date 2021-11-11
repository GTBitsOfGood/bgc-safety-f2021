/* eslint-disable no-use-before-define */
import {
  updateStudentRoute,
  getStudentsByRoute,
  createNewStudent,
  updateStudentData,
  removeStudent,
  findAllStudents,
  findStudentsByName,
  findStudentsOnBus,
} from "../../../server/mongodb/actions/Student";
import useCors from "./corsMiddleware";

export default async (req, res) => {
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
  createNewStudent(req.body)
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

  updateStudentData({ id, ...req.body })
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

  removeStudent(id)
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
  findAllStudents()
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

  findStudentsByName(first, last)
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

  findStudentsOnBus(school)
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
