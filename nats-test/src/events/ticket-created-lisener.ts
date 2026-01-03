import Listener from "../../../common/src/events/base-listener.ts";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "../../../common/src/events/ticket-created-event.ts";
import { Subject } from "../../../common/src/events/subject.ts";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subject.TicketCreated = Subject.TicketCreated;

    queueGroupName = 'payments-service'

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log("Event data!", data);

        msg.ack();
    }
};

export default TicketCreatedListener;