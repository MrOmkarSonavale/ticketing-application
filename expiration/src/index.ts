
import { natsWrapper } from './nats-wappper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';


const start = async () => {

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

    }
    catch (err) {
        console.error(err);
    }
};

start();