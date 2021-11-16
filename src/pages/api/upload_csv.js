import neatCsv from "neat-csv";
import mongoDB from "../../../server/mongodb/index";
import Student from "../../../server/mongodb/models/Student";
import useCors from "./corsMiddleware";

export default async (req, res) => {
  await mongoDB();
  await useCors(req, res);

  const { method } = req;

  if (method === "POST") {
    parseCsv(req, res, req.body);
  }
};

async function parseCsv(req, res, dat) {
  const { clubName, routeId } = req.query;

  neatCsv(dat)
    .then((data) => {
      const newStudents = [];
      for (let i = 3; i < data.length - 1; i++) {
        const newStudent = {
          firstName: data[i][0],
          lastName: data[i][1],
          studentID: data[i][2],
          schoolName: data[i][3],
          grade: data[i][4],
          route: routeId,
          clubName,
        };

        newStudents.push(newStudent);
      }
      Student.insertMany(newStudents)
        .then(() => res.status(200).send({ success: true }))
        .catch((err) => {
          res.status(400).send({
            success: false,
            error: err,
          });
        });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(400).send({
        success: false,
        error: err,
      });
    });
}
