import { natsWrapper } from "../../../nats-wappper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { OrderStatus } from "../../../models/order";
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent } from "@ticketing_dev/common";
import ts from "typescript";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.Client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'Aflsjds',
        expiresAt: new Date(),
        ticket,
    });

    await order.save();


    const data: ExpirationCompleteEvent['data'] = {
        orderId: order._id.toJSON()
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updateOrder = await Order.findById(order._id);

    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an orderCancelled event', async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.Client.publish).toHaveBeenCalled();

    const eventData =
        JSON.parse((natsWrapper.Client.publish as jest.Mock).mock.calls[0][1]);
});

it('ack the message', async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});