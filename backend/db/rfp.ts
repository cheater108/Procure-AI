import mongoose from "mongoose";

const rfpSchema = new mongoose.Schema({
    title: String,
    description: String,
    body: String,
    status: {
      type: String,
      default: "new"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    vendors: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Vendor",
        default: []
    }
})

const RFP = mongoose.model("RFP", rfpSchema);

export default RFP;