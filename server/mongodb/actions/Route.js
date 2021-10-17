import Route from "../models/Route.js";
import mongoDB from "../index";

export async function getAllRoutes() {
  return Route.find({})
    .then((routes) => {
      return Promise.resolve(routes);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error retrieving route data: " + err));
    });
}

export async function getRouteByName(name) {
  return Route.find({ name })
    .then((route) => Promise.resolve(route))
    .catch((err) =>
      Promise.reject(new Error("Error finding route by name: " + err))
    );
}

export async function getRoutesByIds(idArr) {
  return Route.find({
    _id: {
      $in: idArr,
    },
  })
    .then((route) => Promise.resolve(route))
    .catch((err) =>
      Promise.reject(new Error("Error finding routes by ids: " + err))
    );
}

export async function addRoute(name) {
  return Route.create({ name })
    .then((route) => {
      return Promise.resolve(route);
    })
    .catch((err) => {
      console.log(err);
      return Promise.reject(new Error("Error creating new route: " + err));
    });
}

export async function editRouteName(id, name) {
  return Route.findByIdAndUpdate({ _id: id }, { name }, { new: true })
    .then((route) => {
      return Promise.resolve(route);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error updating route name: " + err));
    });
}

export async function enterRouteSubmission(routeId, submissionDetails) {
  return Route.findOneAndUpdate(
    { _id: routeId },
    { $push: { checkIns: submissionDetails } }
  )
    .then((route) => {
      return Promise.resolve(route);
    })
    .catch((err) => {
      console.log(err);
      return Promise.reject(new Error("Error entering route details: " + err));
    });
}
