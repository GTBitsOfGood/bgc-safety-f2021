import mongoose from "mongoose";

const { Schema } = mongoose;

const RouteSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  checkIns: {
    type: [
      {
        date: {
          type: String,
        },
        notes: {
          type: String,
        },
      },
    ],
  },
});

export default mongoose.models.Route || mongoose.model("Route", RouteSchema);
