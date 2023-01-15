const mongoose = require('mongoose');
const Comment = require('./comment')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const PostSchema = new Schema({
    images: [ImageSchema],
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User1'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: Number,
    users_liked: [{
        type: Schema.Types.ObjectId,
        ref: 'User1'
    }],
}, opts);

PostSchema.statics.findFollowing = async function(followingsAccounts) {
    var allPosts;
    for (let following of followingsAccounts) {
        const post = await this.find({ author: following })

        for (let post of posts) {
            post.populate({
                path: 'author',
                populate: {
                    path: 'author'
                }
            }).populate('author');

            allPosts.push(post)
        }
    }
    return allPosts;
}

PostSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.posts
            }
        })
    }
})

module.exports = mongoose.model('Post', PostSchema);