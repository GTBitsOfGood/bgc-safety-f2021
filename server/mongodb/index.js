import urls from "../../utils/urls";
import mongoose from "mongoose";
import Route from "./models/Route";
import Student from "./models/Student";
import Club from "./models/Club";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      dbName: urls.dbName,
    };

    cached.promise = mongoose.connect(urls.dbUrl, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  await Route.find({});
  await Club.find({});
  await Student.find({});
  return cached.conn;
}

export default dbConnect;
