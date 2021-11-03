import Club from "../models/Club.js";
import mongoDB from "../index";

export async function findAllClubs() {
  await mongoDB();
  return Club.find({})
    .then((clubs) => {
      return Promise.resolve(clubs);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error retrieving all clubs: " + err));
    });
}

export async function createNewClub(ClubName, SchoolNames) {
  await mongoDB();
  return Club.create({ ClubName: ClubName, SchoolNames: SchoolNames })
    .then((club) => {
      return Promise.resolve(club);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error creating new club: " + err));
    });
}

export async function updateClubData(id, ClubName, SchoolNames) {
  await mongoDB();
  return Club.findByIdAndUpdate(
    id,
    { ClubName: ClubName, SchoolNames: SchoolNames },
    { new: true }
  )
    .then((club) => {
      return Promise.resolve(club);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error updating club data: " + err));
    });
}

export async function removeClub(id) {
  await mongoDB();
  return Club.findByIdAndDelete(id)
    .then((club) => {
      return Promise.resolve(club);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error deleting club: " + err));
    });
}

export async function getSchoolsByClub(ClubName) {
  await mongoDB();
  return Club.find({ ClubName }, { SchoolNames: 1 })
    .then((SchoolNames) => {
      return Promise.resolve(SchoolNames);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error finding schools by club: " + err));
    });
}
