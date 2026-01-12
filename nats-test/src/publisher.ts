import * as nats from "node-nats-streaming";
import { randomBytes } from 'node:crypto';
import { TicketCreatedPublisher } from '@ticketing_dev/common';
console.clear();

const client = nats.connect("ticketing", randomBytes(4).toString('hex'), {
    url: "http://localhost:4222",
});

client.on("connect", async () => {
    console.log('✅ Publisher connected to NATS');

    const publisher = new TicketCreatedPublisher(client);

    try {
        await publisher.publish({
            id: '123',
            title: 'conncet',
            price: 29,
            userId: 'user123',
        });
    } catch (err) {
        console.error('Error publishing ticket created event:', err);
    }

});

client.on("error", (err) => {
    console.error('❌ NATS connection error:', err);
});