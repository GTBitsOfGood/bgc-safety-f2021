import Route from "../models/Route.js";
import mongoDB from "../index";

export async function getAllRoutes() {
  await mongoDB();

  return Route.find({})
    .then((routes) => Promise.resolve(routes))
    .catch((err) =>
      Promise.reject(new Error(`Error retrieving route data: ${err}`))
    );
}

export async function addRoute(name) {
  await mongoDB();

  return Route.create({ name })
    .then((route) => Promise.resolve(route))
    .catch((err) => {
      console.log(err);
      return Promise.reject(new Error(`Error creating new route: ${err}`));
    });
}

export async function editRouteName(id, name) {
  await mongoDB();

  return Route.findByIdAndUpdate({ _id: id }, { name }, { new: true })
    .then((route) => Promise.resolve(route))
    .catch((err) =>
      Promise.reject(new Error(`Error updating route name: ${err}`))
    );
}
