import mongoose from "mongoose";
import { Password } from "../services/password-service";


//an interface that describe the property of mongo schema
interface userAttrs {
    email: string;
    password: string;
}

// An interface that describes the proerties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(atts: userAttrs): UserDoc;
};


//interface that descibes tje properties that a user document that
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
};

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret.password;
            delete ret.__v;
            delete ret._id;
        }
    }
});


userSchema.pre('save', async function () {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    };

});


userSchema.statics.build = (attrs: userAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);



//insted of new User({})
// const buildUser = (attrs: userAttrs) => {
//     return new User(attrs);
// };

export { User };