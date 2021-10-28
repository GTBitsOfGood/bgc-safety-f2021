import mongoose from "mongoose";

const { Schema } = mongoose;

const ClubSchema = new Schema({
  ClubName: {
    type: String,
    required: true,
    unique: true,
  },
  SchoolNames: {
    type: [
      {
        type: String,
        required: [true],
        validate: {
          validator: (schoolName) => typeof schoolName === "string",
          message: (props) => `${props.value} is not a valid string.`,
        },
      },
    ],
  },
  Region: {
    type: String,
    required: [true],
    validate: {
      validator: (region) => typeof region === "string",
      message: (props) => `${props.value} is not a valid string.`,
    },
  },
  Buses: [
    {
      busNumber: Number,
      maxCapacity: Number,
      currentCapacity: Number,
    },
  ],
});

export default mongoose.models.Club || mongoose.model("Club", ClubSchema);
