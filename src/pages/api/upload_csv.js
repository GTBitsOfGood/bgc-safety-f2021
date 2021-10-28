/* eslint-disable prettier/prettier */
import mongoDB from "../../../server/mongodb/index";
import Student from "../../../server/mongodb/models/Student";
import Club from "../../../server/mongodb/models/Club";
import useCors from "./corsMiddleware";

const neatCsv = require("neat-csv");
// const fs = require("fs");

export default async (req, res) => {
  await mongoDB();
  await useCors(req, res);

  const { method } = req;

  if (method === "POST") {
    console.log("here", req.body.csvData);
    parseCsv(req, res, req.body);
  }
};

function parseCsv(req, res, dat) {
  const { clubName } = req.query;
  neatCsv(dat)
    .then((data) => {
      var dataMap = data[3];
      // console.log
      var ret = {};
      for (var key in dataMap) {
        ret[dataMap[key]] = key;
      }
      // var clubs = {}

      var header = [];
      var studentsArr = [];

      for (let i = 3; i < data.length - 1; i++) {
        if (i == 3) {
          header[0] = data[i][0];
          header[1] = data[i][1];
          header[2] = data[i][2];
          header[3] = data[i][3];
          header[4] = data[i][4];
        } else {
          const newStudent = new Student({
            firstName: data[i][0],
            lastName: data[i][1],
            studentID: data[i][2],
            schoolName: data[i][3],
            grade: data[i][4],
            clubName,
          });

          console.log("newStudent", newStudent);
          newStudent
            .save()
            .then((student) => {
              console.log("Saved ");
              console.log(student);
            })
            .catch((err) => {
              console.log(newStudent);
              console.log("Error");
              console.log(err);
            });
        }
      }

      //rithik stuff
      // //rithik advice
      // var header = [];
      // // var studentsArr = [{student object1}, {student object2}];

      // for (let i = 3; i < data.length - 1; i++) {
      //     if (i == 3) {
      //         header[0] = data[i][0];
      //         header[1] = data[i][1];
      //         header[2] = data[i][2];
      //         header[3] = data[i][3];
      //         header[4] = data[i][4];
      //     } else {
      //         student = new Student({
      //             firstName: data[i][0],
      //             lastName: data[i][1],
      //             studentID: data[i][2],
      //             schoolName: data[i][3],
      //             grade: data[i][4]
      //         })
      //         student.save();
      //     }
      // }

      //relevant stuff
      // // dataMap = ret;
      //     for (let i = 4; i < data.length; i++) {
      //         // if (data[i][0] != null) {
      //         //     let currClub = data[i][0];
      //         // } else {
      //         //     res.status(400).send({"success": false, "message": "The Club field is missing."})
      //         // }
      //         // if (data[i][dataMap["School"]] != null) {
      //         //     let currSchool = data[i][dataMap["School"]];
      //         // } else {
      //         //     res.status(400).send({"success": false, "message": "The School field is missing."})
      //         // }

      //         if (data[i][dataMap["First Name"]] != null
      //             && data[i][dataMap["Last Name"]] != null
      //             && data[i][dataMap["ID#"]] != null
      //             && data[i][dataMap["School"]] != null
      //             && data[i][dataMap["Grade"]] != null
      //             && data[i][0] != null) {
      //         const newStudent = new Student({
      //             firstName: data[i][dataMap["First Name"]],
      //             lastName: data[i][dataMap["Last Name"]],
      //             studentID: data[i][dataMap["ID#"]],
      //             schoolName: data[i][dataMap["School"]],
      //             grade: data[i][dataMap["Grade"]],
      //             clubName: data[i][0],
      //             picture: "None"
      //           });

      //         console.log("newStudent", newStudent);
      //         newStudent.save()
      //             .then(student => {
      //             console.log("Saved ");
      //             console.log(student);
      //         }
      //         )
      //             .catch(err => {
      //             console.log(newStudent)
      //             console.log("Error")
      //             console.log(err)
      //         }
      //         );
      //         } else {
      //             var nullFields = [];
      //             if (data[i][dataMap["First Name"]] == null) {
      //                 nullFields.push("First Name");
      //             }
      //             if (data[i][dataMap["Last Name"]] == null) {
      //                 nullFields.push("Last Name");
      //             }
      //             if (data[i][dataMap["ID#"]] == null) {
      //                 nullFields.push("ID#");
      //             }
      //             if (data[i][dataMap["School"]] == null) {
      //                 nullFields.push("School");
      //             }
      //             if (data[i][dataMap["Grade"]] == null) {
      //                 nullFields.push("Grade");
      //             }
      //             if (data[i][0] == null) {
      //                 nullFields.push("Club");
      //             }
      //             console.log("nullFields", nullFields);
      //             res.status(400).send({"success": false, "message": "The following fields are missing:" + nullFields.toString})

      //         }

      //         // if (currClub in clubs && !(currSchool in clubs[currClub])) {
      //         //     clubs[currClub].add(currSchool)
      //         // } else {
      //         //     clubs[currClub] = new Set([currSchool])
      //         // }
      //     }
      //end relevant stuff

      // for (var club in clubs) {
      //     const newClub = new Club({
      //         ClubName: club,
      //         SchoolNames: Array.from(clubs[club])
      //       });
      //       newClub.save().then(club => {
      //           console.log("saved")
      //           console.log(club)
      //       }).catch(err => {
      //         console.log(newStudent)
      //         console.log("Error")
      //         console.log(err)
      //     })
      // }
    })
    .then(() => {
      res.status(200).send({ success: true });
    });
}
