import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoDB from "../index";
import User from "../models/User";

export async function login(email, password) {
  await mongoDB();

  return new Promise((resolve, reject) => {
    User.findOne({
      username: email,
    })
      .then((user) => {
        if (user) {
          return bcrypt.compare(password, user.password).then((result) => {
            if (result) {
              return Promise.resolve(user);
            }
            return Promise.reject(
              new Error("The password you entered is incorrect.")
            );
          });
        }
        return Promise.reject(new Error("That account does not exist."));
      })
      .then((user) =>
        jwt.sign(
          {
            email: user.username,
            type: user.type,
            club: user.club,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          },
          (error, token) => {
            if (token) {
              return resolve(token);
            }
            return reject(new Error("The login attempt failed."));
          }
        )
      )
      .catch((error) => reject(error.message));
  });
}

export async function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (decoded) {
      return Promise.resolve(decoded);
    }
    return Promise.reject(new Error("Invalid token."));
  });
}

export async function createNewUser(userData) {
  await mongoDB();

  const { email, password, role, clubName } = userData;
  const hashedPassword = bcrypt.hashSync(password, 10);

  return User.create({
    BGCMA_email: email,
    password: hashedPassword,
    type: role,
    club: clubName,
    username: email,
  })
    .then((user) => {
      return Promise.resolve(user);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error creating new user: " + err));
    });
}

export async function findUser(email) {
  await mongoDB();

  return User.findOne({ BGCMA_email: email })
    .then((user) => {
      return Promise.resolve(user);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error finding user: " + err));
    });
}

export async function removeUser(email) {
  await mongoDB();

  return User.findOneAndDelete({ BGCMA_email: email })
    .then((user) => {
      return Promise.resolve(user);
    })
    .catch((err) => {
      return Promise.reject(new Error("Error deleting user: " + err));
    });
}
