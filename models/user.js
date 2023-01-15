// PASSPORT-LOCAL-MONGOOSE SCHEMA DATABASE (STORING USER ACCOUNTS)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const passportLocalMongoose = require('passport-local-mongoose');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const UserSchema = new Schema({
    admin: {
        type: Boolean,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: false
    },
    biography: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false,
        unique: false
    },
    profile: ImageSchema,
    cover_image: ImageSchema,
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    pinned_post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User1'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User1'
    }],
}, opts);

UserSchema.plugin(passportLocalMongoose);

UserSchema.statics.findAndValidate = async function(email, password) {
    const foundUser = await this.findOne({ email });
    if (foundUser) {
        const isValid = await bcrypt.compare(password, foundUser.password);
        return isValid ? foundUser : false;
    }
}

UserSchema.statics.findByName = async function(username) {
    const account = await this.findOne({ username });
    return account;
}

UserSchema.statics.findFollowing = async function(userID) {
    const account = await this.findById({ userID });
    return account.following;
}

UserSchema.statics.updateUsername = async function(oldFname, newFname) {
    await this.updateOne({ username: oldFname }, { username: newFname });
}

UserSchema.statics.findByID = async function(_id) {
    const account = await this.findById(_id);
    return account;
}

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

module.exports = mongoose.model('User1', UserSchema);
