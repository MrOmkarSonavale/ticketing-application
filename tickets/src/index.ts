import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wappper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCandelledListener } from './events/listeners/order-cancelled-listener';


const start = async () => {

    if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');

    if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');


    if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defined');


    if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defined');


    if (!process.env.NATS_URL) throw new Error('NATS_URL must be defined');

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        natsWrapper.Client.on("close", () => {
            console.log("Nats connection Closed");
            process.exit();
        });

        process.on("SIGINT", () => natsWrapper.Client.close());
        process.on("SIGTERM", () => natsWrapper.Client.close());


        new OrderCreatedListener(natsWrapper.Client).listen();
        new OrderCandelledListener(natsWrapper.Client).listen();


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