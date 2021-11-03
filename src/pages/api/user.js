/* eslint-disable no-use-before-define */
import {
  createNewUser,
  findUser,
  removeUser,
} from "../../../server/mongodb/actions/User";
import mongoDB from "../../../server/mongodb/index";
import useCors from "./corsMiddleware";

export default async (req, res) => {
  await mongoDB();

  await useCors(req, res);

  const { method } = req;
  if (method === "POST") {
    createUser(req, res);
  } else if (method === "DELETE") {
    deleteUser(req, res);
  } else if (method === "GET") {
    getUser(req, res);
  } else {
    res.setHeader("Allow", ["GET, POST", "PATCH", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

function createUser(req, res) {
  createNewUser(req.body)
    .then((user) => {
      res.status(201).send({
        success: true,
        payload: user,
      });
    })
    .catch((error) => {
      res.status(400).send({
        success: false,
        message: error,
      });
    });
}

function getUser(req, res) {
  const { email } = req.query;

  findUser(email)
    .then((user) =>
      res.status(200).send({
        success: true,
        payload: user,
      })
    )
    .catch((error) =>
      res.status(400).send({
        success: false,
        message: error,
      })
    );
}

function deleteUser(req, res) {
  const { email } = req.params;

  removeUser(email)
    .then((user) =>
      res.status(200).send({
        success: true,
        payload: user,
      })
    )
    .catch((error) =>
      res.status(400).send({
        success: false,
        message: error,
      })
    );
}
