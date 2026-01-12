import { Message, Stan } from "node-nats-streaming";
import { Subject } from "./subject";


interface Event {
    subject: Subject;
    data: any;
};

export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;
    protected ackwait = 5 * 1000;
    private client: Stan;

    constructor(stan: Stan) {
        this.client = stan;
    };

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackwait)
            .setDurableName(this.queueGroupName);
    };


    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(`message received ${this.subject}/ ${this.queueGroupName}`);
            const parsedData = this.parseMassage(msg);
            this.onMessage(parsedData, msg);
        });

    }



    parseMassage(msg: Message) {
        const data = msg.getData();

        return typeof data === 'string' ?
            JSON.parse(data) : JSON.parse(data.toString('utf8'));
    }
};