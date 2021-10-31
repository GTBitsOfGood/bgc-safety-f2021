import mongoose from "mongoose";

const { Schema } = mongoose;

const StudentSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  studentID: {
    type: String,
    required: true,
    unique: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  route: {
    type: Schema.Types.ObjectID,
    ref: "Route",
    required: false,
  },
  grade: {
    type: String,
    required: true,
  },
  clubName: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  onBus: {
    type: Boolean,
    default: true,
  },
  checkIns: {
    type: [
      {
        date: {
          type: String,
        },
        note: {
          type: String,
        },
      },
    ],
  },
});

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
