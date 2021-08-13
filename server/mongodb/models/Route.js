import mongoose from "mongoose";

const { Schema } = mongoose;

const RouteSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.models.Route || mongoose.model("Route", RouteSchema);
mo;
