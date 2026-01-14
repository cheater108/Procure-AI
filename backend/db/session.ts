import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    rfps: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "RFP",
      default: []
    }
})

const Session = mongoose.model("Session", sessionSchema);

export default Session;