import { natsWrapper } from "../../../nats-wappper";
import { OrderCandelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/tickets-schema";
import mongoose from "mongoose";
import { OrderCancelledEvent } from "@ticketing_dev/common";
import { Message } from 'node-nats-streaming';

const setup = async () => {

    const listener = new OrderCandelledListener(natsWrapper.Client);

    const orderId = new mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({
        title: 'conert',
        price: 20,
        userId: 'asdf'
    });

    ticket.set({ orderId });

    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { msg, data, ticket, orderId, listener };
};


it('updates the ticket , publishes an event and acks the message', async () => {
    const { msg, data, ticket, orderId, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();

    expect(msg.ack).toHaveBeenCalled();

    expect(natsWrapper.Client.publish).toHaveBeenCalled();
});