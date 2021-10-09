import Student from "../models/Student.js";
import mongoDB from "../index";

export async function getStudentsByRoute(route) {
  await mongoDB();

  console.log(route);
  return Student.find({ route })
    .then((students) => {
      return Promise.resolve(students);
    })
    .catch((err) => {
      return Promise.reject(
        new Error("Error retrieving students for route " + route + ": " + err)
      );
    });
}

export async function updateStudentRoute(id, route) {
  await mongoDB();

  return Student.findOneAndUpdate(
    { studentID: id },
    { route: route },
    { new: true }
  )
    .then((student) => {
      return Promise.resolve(student);
    })
    .catch((err) => {
      return Promise.reject(
        new Error("Error updating student's route: " + err)
      );
    });
}
