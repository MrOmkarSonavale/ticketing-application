import { natsWrapper } from "../../nats-wappper";
import { OrderCreatedListener } from "../listeners/order-creater-listener";
import { OrderCreatedEvent, OrderStatus } from "@ticketing_dev/common";
import mongoose, { version } from "mongoose";
import { Message } from 'node-nats-streaming';
import { Order } from "../../models/order";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.Client);

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'asfdf',
        status: OrderStatus.Created,
        userID: "sdfsaf",
        ticket: {
            id: 'dfadf',
            price: 20
        }
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('replicates the order info', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack()).toHaveBeenCalled();

});


