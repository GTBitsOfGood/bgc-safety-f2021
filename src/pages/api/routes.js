/* eslint-disable no-use-before-define */
import {
  getAllRoutes,
  addRoute,
  editRouteName,
  enterRouteSubmission,
  getRouteByName,
} from "../../../server/mongodb/actions/Route";
import useCors from "./corsMiddleware";

export default async (req, res) => {
  await useCors(req, res);

  const { method } = req;
  if (method === "GET") {
    if (req.query.name) {
      findRouteByName(req, res);
    } else {
      getRoutes(req, res);
    }
  } else if (method === "POST" && req.body.name) {
    addNewRoute(req, res);
  } else if (method === "POST" && req.query.id) {
    submitRoute(req, res);
  } else if (method === "PUT") {
    changeRouteName(req, res);
  } else {
    res.setHeader("Allow", ["POST", "PUT", "GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

async function getRoutes(req, res) {
  getAllRoutes()
    .then((result) => {
      res.status(200).send({
        success: true,
        payload: result,
      });
    })
    .catch((error) => {
      res.status(400).send({
        success: false,
        payload: error.message,
      });
    });
}

async function findRouteByName(req, res) {
  getRouteByName(req.query.name)
    .then((result) => {
      res.status(200).send({
        success: true,
        payload: result,
      });
    })
    .catch((error) => {
      res.status(400).send({
        success: false,
        payload: error.message,
      });
    });
}

async function addNewRoute(req, res) {
  addRoute(req.body.name)
    .then((result) => {
      res.status(200).send({
        success: true,
        payload: result,
      });
    })
    .catch((error) => {
      res.status(400).send({
        success: false,
        payload: error.message,
      });
    });
}

async function changeRouteName(req, res) {
  const { id, name } = req.body;

  editRouteName(id, name)
    .then((result) => {
      res.status(200).send({
        success: true,
        payload: result,
      });
    })
    .catch((error) => {
      res.status(400).send({
        success: false,
        payload: error.message,
      });
    });
}

async function submitRoute(req, res) {
  const { id } = req.query;
  const { submissionDetails } = req.body;
  enterRouteSubmission(id, submissionDetails)
    .then((result) => {
      res.status(200).send({
        success: true,
        payload: result,
      });
    })
    .catch((error) => {
      res.status(400).send({
        success: false,
        payload: error.message,
      });
    });
}
