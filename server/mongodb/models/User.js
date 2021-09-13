import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  BGCMA_email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        // don't validate in non-prod
        if (process.env.NODE_ENV !== "production") {
          return true;
        }

        return /^[A-Za-z0-9._%+-]+@bgcma.org$/.test(email);
      },
      message: "Please enter a valid email.",
    },
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Admin", "ClubDirector", "BusDriver"],
    required: true,
  },
  club: {
    type: String,
    required: true,
    default: "All",
  },
  username: {
    type: String,
    required: true,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
