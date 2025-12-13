import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from "jsonwebtoken";


let mongo: MongoMemoryServer;

beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
    mongo = await MongoMemoryServer.create();
    const mongoUrl = mongo.getUri();

    await mongoose.connect(mongoUrl, {});
});

//run before each test
beforeEach(async () => {
    const collections = await mongoose.connection.db?.collections();

    for (let collection of collections!) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

export const signin = () => {
    //build a jwt payload {id , email };
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@gmail.com'
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!);

    const session = { jwt: token };

    const jsontoken = JSON.stringify(session);

    const bse64 = Buffer.from(jsontoken).toString('base64');

    return `session=${bse64}`
};



