import mongoose from "mongoose";

const rfpSchema = new mongoose.Schema({
    description: String,
    body: String,
    vendors: [
        {
            name: String,
            email: String,
            phone: String, 
        }
    ]
})

const RFP = mongoose.model("RFP", rfpSchema);

export default RFP;