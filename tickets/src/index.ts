import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wappper';

const start = async () => {

    if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');

    if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');

    try {
        await natsWrapper.connect('ticketing', 'lasfg', 'http://nats-srv:4222');

        natsWrapper.Client.on("close", () => {
            console.log("Nats connection Closed");
            process.exit();
        });

        process.on("SIGINT", () => natsWrapper.Client.close());
        process.on("SIGTERM", () => natsWrapper.Client.close());

        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to mongodb");
    }
    catch (err) {
        console.error(err);
    }
};

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

start();