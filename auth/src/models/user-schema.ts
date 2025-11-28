import mongoose from "mongoose";

interface userAttrs {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.statics.build = (attrs: userAttrs) => {
    return new User(attrs);
};

const User = mongoose.model("User", userSchema);

//insted of new User({})
// const buildUser = (attrs: userAttrs) => {
//     return new User(attrs);
// };

export { User };