import mongoDB from "../server/mongodb/index";

import Club from "../server/mongodb/models/Club";
import Route from "../server/mongodb/models/Route";
import Student from "../server/mongodb/models/Student";
import User from "../server/mongodb/models/User";

import faker from "faker";

const GRADES = [...Array(12)].map((_, i) => `Grade ${i + 1}`);

const randFrom = (list) => list[Math.floor(Math.random() * list.length)];

const init = async () => {
  await mongoDB();

  // clear db
  await Club.deleteMany({});
  await Route.deleteMany({});
  await Student.deleteMany({});
  await User.deleteMany({});

  const schools = ["Bog Town", "Burdell"];

  console.info("Creating clubs");
  const club = new Club({
    ClubName: "Harland",
    SchoolNames: schools,
  });
  await club.save();

  console.info("Creating routes");
  const routes = await Promise.all(
    [...Array(10)].map(async (_, i) => {
      const route = new Route({
        name: `Route ${i + 1}`,
      });

      await route.save();

      return route;
    })
  );

  console.info("Creating students");
  const students = await Promise.all(
    [...Array(120)].map(async (_, i) => {
      const student = new Student({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        studentID: `student-${i + 1}`,
        schoolName: randFrom(schools),
        route: routes[Math.floor(i / 3) + 1],
        grade: randFrom(GRADES),
        clubName: "Harland",
        notes: `Note for student ${i + 1}`,
        picture: "",
        checkInTimes: [],
      });

      await student.save();

      return student;
    })
  );

  console.info("Creating users");
  await Promise.all([
    new User({
      BGCMA_email: "bgc.dev.admin@bitsofgood.org",
      password: "abc",
      type: "Admin",
      club: "Harland",
      username: "testuser1",
    }).save(),
    new User({
      BGCMA_email: "bgc.dev.clubdirector@bitsofgood.org",
      password: "abc",
      type: "ClubDirector",
      club: "Harland",
      username: "testuser2",
    }).save(),
    new User({
      BGCMA_email: "bgc.dev.busdriver@bitsofgood.org",
      password: "abc",
      type: "BusDriver",
      club: "Harland",
      username: "testuser3",
    }).save(),
  ]);

  console.info("Done");
  process.exit();
};

try {
  init();
} catch (e) {
  console.error(e);
}
