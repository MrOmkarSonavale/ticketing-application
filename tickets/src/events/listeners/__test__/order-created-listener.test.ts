import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wappper";
import { Ticket } from "../../../models/tickets-schema";
import { OrderCreatedEvent, OrderStatus } from "@ticketing_dev/common";
import mongoose from "mongoose";
import Message from 'node-nats-streaming';

const setup = async () => {
    //createa an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.Client);

    //create and save a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 99,
        userId: 'asdf'
    });

    await ticket.save();


    //create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userID: 'asdfsd',
        expiresAt: 'adfadf',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
};

it('sets the userID of the  ticket', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});


it('acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});