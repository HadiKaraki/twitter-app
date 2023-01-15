const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: String,
    likes: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User1'
    },
    replies: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    users_liked: [{
        type: Schema.Types.ObjectId,
        ref: 'User1'
    }],
});

module.exports = mongoose.model("Comment", CommentSchema);