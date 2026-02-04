import { Listener, OrderCancelledEvent, Subject } from "@ticketing_dev/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../models/tickets-schema";
import { TicketUpdatePublisher } from "../publishers/ticket-updated-publisher";

export class OrderCandelledListener extends Listener<OrderCancelledEvent> {

    subject: Subject.OrderCancelled = Subject.OrderCancelled;

    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) throw new Error('Ticket not found');

        ticket.set({ orderId: undefined });

        await ticket.save();

        await new TicketUpdatePublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            userId: ticket.userId,
            price: ticket.price,
            title: ticket.title,
            version: ticket.version
        });

        msg.ack();
    };
};