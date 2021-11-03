import Route from "../models/Route.js";
import mongoDB from "../index";

export async function getAllRoutes() {
  await mongoDB();

  return Route.find({})
    .then((routes) => {
      return Promise.resolve(routes);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error retrieving route data: " + err));
    });
}

export async function getRouteByName(name) {
  await mongoDB();
  return Route.findOne({ name })
    .then((route) => Promise.resolve(route))
    .catch((err) =>
      Promise.reject(new Error("Error finding route by name: " + err))
    );
}

export async function addRoute(name) {
  await mongoDB();
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
  await mongoDB();
  return Route.findByIdAndUpdate({ _id: id }, { name }, { new: true })
    .then((route) => {
      return Promise.resolve(route);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error updating route name: " + err));
    });
}

export async function enterRouteSubmission(routeId, submissionDetails) {
  await mongoDB();
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
