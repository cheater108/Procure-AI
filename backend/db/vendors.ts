import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    status: String,
    response: String,
    score: Number,
    rfpId: {
      type: mongoose.Schema.Types.ObjectId
    },
    attachments: [String]
})

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;