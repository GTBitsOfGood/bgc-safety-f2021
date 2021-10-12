/* eslint-disable no-use-before-define */
import {
  getAllRoutes,
  addRoute,
  editRouteName,
} from "../../../server/mongodb/actions/Route";
import mongoDB from "../../../server/mongodb";
import useCors from "./corsMiddleware";

export default async (req, res) => {
  await mongoDB();

  await useCors(req, res);

  const { method } = req;
  if (method === "GET") {
    getRoutes(req, res);
  } else if (method === "POST") {
    addNewRoute(req, res);
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
