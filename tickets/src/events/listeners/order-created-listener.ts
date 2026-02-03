import { Listener, OrderCreatedEvent, OrderStatus, Subject, } from "@ticketing_dev/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets-schema";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subject.OrderCreated = Subject.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        //  find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        // if no ticket thrwo  error
        if (!ticket) throw new Error("ticket not found");

        // mark the ticket as being reserved by setting its orderid property
        ticket.set({ orderId: data.id });

        //save the ticket
        await ticket.save();

    }
};