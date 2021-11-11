import { getRoutesByIds } from "../../../server/mongodb/actions/Route";
import {
  createNewClub,
  findAllClubs,
  getRoutesByClub,
  getSchoolsByClub,
  removeClub,
  updateClubData,
} from "../../../server/mongodb/actions/Club";
import useCors from "./corsMiddleware";

export default async (req, res) => {
  await useCors(req, res);

  const { method } = req;

  if (method === "GET") {
    if (req.query.ClubName) {
      getSchoolsForClub(req, res);
    } else if (req.query.clubName) {
      getRoutesForClub(req, res);
    } else {
      getAllClubs(req, res);
    }
  } else if (method === "POST") {
    createClub(req, res);
  } else if (method === "PATCH") {
    updateClub(req, res);
  } else if (method === "DELETE") {
    deleteClub(req, res);
  } else {
    res.setHeader("Allow", ["GET, POST", "PATCH", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

function getAllClubs(req, res) {
  findAllClubs()
    .then((clubs) => {
      res.status(200).send({
        success: true,
        payload: clubs,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: err,
      });
    });
}

function createClub(req, res) {
  const { ClubName, SchoolNames } = req.body;

  createNewClub(ClubName, SchoolNames)
    .then((club) =>
      res.status(200).send({
        success: true,
        payload: club,
      })
    )
    .catch((err) =>
      res.status(400).send({
        success: false,
        message: err,
      })
    );
}

function updateClub(req, res) {
  const { id } = req.query;
  const { ClubName, SchoolNames } = req.body;

  updateClubData(id, ClubName, SchoolNames)
    .then((club) =>
      res.status(200).send({
        success: true,
        payload: club,
      })
    )
    .catch((err) =>
      res.status(400).send({
        success: false,
        message: err,
      })
    );
}

function deleteClub(req, res) {
  const { id } = req.query;

  removeClub(id)
    .then((club) =>
      res.status(200).send({
        success: true,
        payload: club,
      })
    )
    .catch((err) =>
      res.status(400).send({
        success: false,
        message: err,
      })
    );
}

function getSchoolsForClub(req, res) {
  const { ClubName } = req.query;

  getSchoolsByClub(ClubName)
    .then((SchoolNames) =>
      res.status(200).json({
        success: true,
        payload: SchoolNames,
      })
    )
    .catch((err) =>
      res.status(400).json({
        success: false,
        message: err,
      })
    );
}

async function getRoutesForClub(req, res) {
  const { clubName } = req.query;
  getRoutesByClub(clubName)
    .then(({ Routes }) => {
      getRoutesByIds(Routes)
        .then((result) =>
          res.status(200).json({
            success: true,
            payload: result,
          })
        )
        .catch((err) =>
          res.status(400).json({
            success: false,
            message: err,
          })
        );
    })
    .catch((err) =>
      res.status(400).json({
        success: false,
        message: err,
      })
    );
}
