import Listener from "./base-listener.js";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "./ticket-created-event.js";
import { Subject } from "./subject.js";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subject.TicketCreated = Subject.TicketCreated;

    queueGroupName = 'payments-service'

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log("Event data!", data);

        msg.ack();
    }
};

export default TicketCreatedListener;