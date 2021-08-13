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
  notes: {
    type: String,
  },
  picture: {
    type: String,
  },
  onBus: {
    type: Boolean,
    default: true,
  },
  checkInTimes: {
    type: [
      {
        type: String, // TODO: Change type to a Standardized Date Format
        required: true,
      },
    ],
  },
});

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
