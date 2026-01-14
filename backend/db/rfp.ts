import mongoose from "mongoose";

const rfpSchema = new mongoose.Schema({
    title: String,
    description: String,
    body: String,
    status: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    vendors: [
        {
            name: String,
            email: String,
            phone: String, 
            status: String,
            response: String,
            score: Number,
        }
    ]
})

const RFP = mongoose.model("RFP", rfpSchema);

export default RFP;