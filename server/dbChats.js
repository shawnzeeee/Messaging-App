import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    members:[],
    messages:[{
        username: String,
        message: String,
        messageType: String
    }]
}) 

export default mongoose.model("Chat", chatSchema);