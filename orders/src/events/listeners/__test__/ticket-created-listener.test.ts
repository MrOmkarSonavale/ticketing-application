import { TicketCreatedListener } from "../ticket-created-listeners";
import { natsWrapper } from "../../../nats-wappper";
import { TicketCreatedEvent } from "@ticketing_dev/common";
import mongoose, { set } from "mongoose";
import Message from 'node-nats-streaming'
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // create  the instance of the listenser
    const listener = new TicketCreatedListener(natsWrapper.Client);

    //create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        title: 'concert',
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    //crate a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};



it('creates and saves ticket', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertion to make sure a ticket was created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
    const { data, listener, msg } = await setup();

    // call the onmessage function with the data object + message object 
    await listener.onMessage(data, msg);

    // write assertion make sure act function is call
    expect(msg.ack).toHaveBeenCalled();
});