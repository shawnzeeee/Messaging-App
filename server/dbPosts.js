import mongoose from "mongoose"

const postSchema = mongoose.Schema({
    username:{
        type: String,
        required :true
    },

})

export default mongoose.model('Post', postSchema);