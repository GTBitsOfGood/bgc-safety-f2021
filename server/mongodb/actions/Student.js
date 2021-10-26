import Student from "../models/Student.js";
import mongoDB from "../index";

export async function getStudentsByRoute(route) {
  await mongoDB();

  return Student.find({ route })
    .then((students) => Promise.resolve(students))
    .catch((err) =>
      Promise.reject(
        new Error(`Error retrieving students for route ${route}: ${err}`)
      )
    );
}

export async function updateStudentRoute(id, route) {
  await mongoDB();

  return Student.findOneAndUpdate({ studentID: id }, { route }, { new: true })
    .then((student) => Promise.resolve(student))
    .catch((err) =>
      Promise.reject(new Error(`Error updating student's route: ${err}`))
    );
}
