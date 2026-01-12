import { Listener, TicketCreatedEvent, Subject } from "@ticketing_dev/common"
import { Message } from "node-nats-streaming";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subject.TicketCreated;

    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log("Event data!", data);

        msg.ack();
    }
};

export default TicketCreatedListener;