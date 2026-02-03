import { TicketUpdatedListener } from "../ticket-updated-listeners";
import { natsWrapper } from "../../../nats-wappper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@ticketing_dev/common";
import Message from 'node-nats-streaming';


const setup = async () => {
    // creat a listener
    const listener = new TicketUpdatedListener(natsWrapper.Client);

    // create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10
    });

    await ticket.save();

    // crate a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket._id.toJSON(),
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: 'afdsfsdf'
    };

    // create a fake msg object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    // return all of this stuff
    return { msg, data, ticket, listener };
};

it('finds updates and saves a ticket', async () => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket._id);

    expect(updatedTicket!.title).toEqual(data.title);

    expect(updatedTicket!.price).toEqual(data.price);

    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const { msg, data, listener, ticket } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (err) {

    };

    expect(msg.ack).not.toHaveBeenCalled();
});