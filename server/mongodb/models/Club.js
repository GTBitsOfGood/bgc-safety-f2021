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
          validator: (schoolName) => {
            return typeof schoolName === "string";
          },
          message: (props) => `${props.value} is not a valid string.`,
        },
      },
    ],
  },
});

export default mongoose.models.Club || mongoose.model("Club", ClubSchema);
