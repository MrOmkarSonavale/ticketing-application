import nats from 'node-nats-streaming';
import { randomBytes } from 'node:crypto';
import TicketCreatedListener from './events/ticket-created-lisener.ts';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'),
    {
        url: "http://localhost:4222"
    });

stan.on('connect', () => {
    console.log('listner connect to nats')

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });

    new TicketCreatedListener(stan).listen();
});

stan.on('error', (err) => {
    console.error('NATS connection error:', err);
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());


