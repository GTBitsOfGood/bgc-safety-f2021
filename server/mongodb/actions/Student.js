import Student from "../models/Student.js";
import mongoDB from "../index";
import {
  convertToDict,
  filterTimes,
} from "../../../src/pages/api/attendance.js";

export async function createNewStudent(studentData) {
  await mongoDB();

  const {
    FirstName,
    LastName,
    StudentID,
    SchoolName,
    RouteId,
    Grade,
    ClubName,
    Notes,
    Picture,
  } = studentData;

  return Student.create({
    firstName: FirstName,
    lastName: LastName,
    studentID: StudentID,
    schoolName: SchoolName,
    route: RouteId,
    grade: Grade,
    clubName: ClubName,
    notes: Notes,
    picture: Picture,
  })
    .then((student) => {
      return Promise.resolve(student);
    })
    .catch((err) => {});
}

export async function updateStudentData(studentData) {
  await mongoDB();

  const {
    id,
    FirstName,
    LastName,
    StudentID,
    SchoolName,
    Grade,
    ClubName,
    Notes,
    Picture,
  } = studentData;

  return Student.findOneAndUpdate(
    {
      studentID: id,
    },
    {
      firstName: FirstName,
      lastName: LastName,
      studentID: StudentID,
      schoolName: SchoolName,
      grade: Grade,
      clubName: ClubName,
      notes: Notes,
      picture: Picture,
    },
    {
      new: true,
    }
  )
    .then((student) => {
      return Promise.resolve(student);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error updating student: " + err));
    });
}

export async function getStudentsByRoute(route) {
  await mongoDB();

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

export async function removeStudent(id) {
  await mongoDB();

  return Student.findOneAndDelete({
    studentID: id,
  })
    .then((student) => {
      return Promise.resolve(student);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error removing student: " + err));
    });
}

export async function findAllStudents() {
  await mongoDB();

  return Student.find()
    .then((students) => {
      return Promise.resolve(students);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error fetching all students: " + err));
    });
}

export async function findStudentsByName(first, last) {
  await mongoDB();

  return Student.findOne({
    firstName: first,
    lastName: last,
  })
    .then((student) => {
      return Promise.resolve(student);
    })
    .catch((err) => {
      return Promise.reject(
        new Error("Error finding students by name: " + err)
      );
    });
}

export async function findStudentsOnBus(school) {
  await mongoDB();

  return Student.find({
    schoolName: school,
    onBus: true,
  })
    .then((students) => {
      return Promise.resolve(students);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error finding students on bus: " + err));
    });
}

export async function findStudentCheckIns(id) {
  await mongoDB();

  return Student.findOne({ _id: id })
    .then((student) => {
      return Promise.resolve(student.checkIns);
    })
    .catch((err) => {
      return Promise.reject(
        new Error("Error retreiving student checkIns: " + err)
      );
    });
}

export async function markStudentCheckIn(id, date) {
  await mongoDB();
  return Student.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $push: {
        checkIns: {
          date,
          note: "",
        },
      },
    },
    {
      new: true,
    }
  )
    .then((student) => {
      return Promise.resolve(student.checkIns);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error checking in student: " + err));
    });
}

export async function addStudentNote(id, note, date) {
  await mongoDB();

  return Student.findOneAndUpdate(
    {
      _id: id,
      "checkIns.date": date,
    },
    {
      $set: {
        "checkIns.$.note": note,
      },
    }
  )
    .then((student) => {
      return Promise.resolve(student.checkIns);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error adding note: " + err));
    });
}

export async function deleteStudentNote(id) {
  await mongoDB();

  return Student.findOneAndUpdate(
    {
      _id: id,
    },
    {
      notes: undefined,
    }
  )
    .then(() => {
      return Promise.resolve();
    })
    .catch((err) => {
      return Promise.reject(new Error("Error deleting note: " + err));
    });
}

export async function findBusAttendanceInfo(schoolName) {
  await mongoDB();

  return Student.find(
    {
      schoolName,
    },
    {
      firstName: 1,
      lastName: 1,
      checkIns: 1,
    }
  )
    .then((checkIns) => {
      return Promise.resolve(checkIns);
    })
    .catch((err) => {
      return Promise.reject(
        new Error("Error finding bus attendance info: " + err)
      );
    });
}

export async function getStudentAttendance(studentID) {
  await mongoDB();

  return Student.find(
    {
      studentID,
    },
    {
      checkIns: 1,
    }
  )
    .then((checkIns) => {
      return Promise.resolve(checkIns);
    })
    .catch((err) => {
      return Promise.reject(
        new Error("Error getting student attendance: " + err)
      );
    });
}

export async function getCurDayStudentAttendanceBySchool(school) {
  await mongoDB();

  return Student.find({
    schoolName: school,
    onBus: true,
  })
    .then((students) => {
      return Promise.resolve(students);
    })
    .catch((err) => {
      return Promise.reject(
        new Error("Error getting today's student attendance by school: " + err)
      );
    });
}

export async function getCurDayStudentAttendanceByClub(club) {
  await mongoDB();

  return Student.find({
    clubName: club,
    onBus: true,
  })
    .then((students) => {
      return Promise.resolve(students);
    })
    .catch((err) => {
      return Promise.reject(
        new Error("Error getting today's student attendance by club: " + err)
      );
    });
}

export async function getStudentAttendanceByTimeRange(
  studentID,
  startDate,
  endDate
) {
  await mongoDB();

  return Student.findOne(
    {
      studentID,
    },
    {
      checkIns: 1,
    }
  )
    .then((student) => {
      const filteredAttendance = filterTimes(
        Date.parse(startDate),
        Date.parse(endDate),
        student.checkIns
      );
      return Promise.resolve(filteredAttendance);
    })
    .catch((err) => {
      return Promise.reject(
        new Error("Error getting student attendance by time range: " + err)
      );
    });
}

export async function getSchoolAttendanceByTimeRange(
  schoolName,
  startDate,
  endDate
) {
  await mongoDB();

  return Student.find(
    {
      schoolName,
    },
    {
      checkInTimes: 1,
      firstName: 1,
      lastName: 1,
      studentID: 1,
    }
  )
    .then((students) => {
      const convertedDict = convertToDict(
        Date.parse(startDate),
        Date.parse(endDate),
        students
      );
      return Promise.resolve(convertedDict);
    })
    .catch((err) => {
      return Promise.reject(
        new Error("Error getting school attendance by time range: " + err)
      );
    });
}

export async function findSchoolInfo(ids) {
  await mongoDB();

  return Student.find(
    {
      studentID: { $in: ids },
    },
    {
      schoolName: 1,
    }
  )
    .then((schoolList) => {
      return Promise.resolve(schoolList);
    })
    .catch((err) => {
      return Promise.reject(
        new Error("Error finding school information: " + err)
      );
    });
}

export async function findStudentInfoBySchool(schoolName) {
  await mongoDB();

  return Student.find({ schoolName })
    .then((students) => {
      return Promise.resolve(students);
    })
    .catch((err) => {
      return Promise.reject(
        new Error("Error finding student info by school: " + err)
      );
    });
}

export async function findAllSchools() {
  await mongoDB();

  return Club.find()
    .then((clubs) => {
      const allSchools = clubs.reduce(
        (acc, club) => acc.concat(club.SchoolNames),
        []
      );
      return Promise.resolve(allSchools);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error retrieving all schools: " + err));
    });
}
