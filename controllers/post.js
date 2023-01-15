const User = require('../models/user');
const Post = require('../models/post');
const { cloudinary } = require("../cloudinary");
var mongoose = require('mongoose');

const castErrorDB = err => {
    if (err.name === 'CastError')
        return new Error(`Invalid ${err.path}: ${err.value}`);
    return err;
};

module.exports.showPost = async(req, res) => {
    try {
        const { id } = req.params;
        const userID = req.user._id;
        const post = await Post.findById(id).populate({
            path: 'comments',
            populate: {
                path: 'author'
            }
        }).populate('author');
        if (!post) {
            req.flash('error', 'Cannot find that post!');
            return res.redirect('back');
        }
        var likedOrNot = false;
        const index = post.users_liked.indexOf(userID);
        if (index > -1) {
            likedOrNot = true;
        }
        res.render('post', { post, likedOrNot });
    } catch (e) {
        console.log(castErrorDB(e));
        req.flash('error', 'Cannot find that post!');
        res.redirect('back')
    }
}

module.exports.likePost = async(req, res) => {
    // AJAX
    const { id } = req.body;
    const userID = req.user._id;
    var postId = mongoose.Types.ObjectId(id);
    const post = await Post.findById(postId);
    post.likes = post.likes + 1;
    post.users_liked.push(userID);
    await post.save();
}

module.exports.dislikePost = async(req, res) => {
    // AJAX
    const { id } = req.body;
    const userID = req.user._id;
    var postId = mongoose.Types.ObjectId(id);
    const post = await Post.findById(postId);
    post.likes = post.likes - 1;
    await Post.findByIdAndUpdate(postID, { $pull: { users_liked: userID } });
    // const index = post.users_liked.indexOf(userID);
    // post.users_liked.splice(index, 1);
    // post.users_liked = post.users_liked.filter(element => {
    //     return element !== null;
    // });
    likedOrNot = false;
    await post.save();
}

module.exports.pinPost = async(req, res) => {
    const { postID } = req.params;
    const userID = req.user._id;
    const user = await User.findById(userID);
    const post = await Post.findById(postID);
    user.pinned_post = post;
    await User.findByIdAndUpdate(userID, { $pull: { posts: postID } });
    await user.save();
    res.redirect('/user/account');
}

module.exports.unpinPost = async(req, res) => {
    const { postID } = req.params;
    const userID = req.user._id;
    const user = await User.findById(userID);
    const post = await Post.findById(postID);
    await user.update({ $unset: { pinned_post: "" } })
    user.posts.push(postID);
    await user.save();
    res.redirect('/user/account');
}

module.exports.newPost = async(req, res) => {
    const post = new Post(req.body.post);
    const currUserID = req.user._id
    const currUser = await User.findById(currUserID);
    post.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    post.author = req.user._id;
    post.likes = 0
    await post.save();
    currUser.posts.unshift(post);
    await currUser.save()
    req.flash('success', 'Successfully made a new post!');
    res.redirect(`/user/account`)
}

module.exports.renderEditPost = async(req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id)
    res.render('post/edit', { post });
}

module.exports.editPost = async(req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.site });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    site.images.push(...imgs);
    await post.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await post.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated post!');
    res.redirect(`/sites/show/${site._id}`)
}

module.exports.deletePost = async(req, res) => {
    const userID = req.user._id;
    const { id } = req.params;
    // find the user that owns the post and remove that post from it (posts array)
    await User.findByIdAndUpdate(userID, { $pull: { posts: id } });
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post')
    res.redirect('/user/account');
    // req.flash('error', 'Post not found!')
    // res.redirect('/user/account');
}