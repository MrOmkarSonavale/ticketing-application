import { ExpirationCompleteEvent, Listener, OrderStatus, Subject } from "@ticketing_dev/common";
import { Message } from 'node-nats-streaming';
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName = queueGroupName;
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order) throw new Error('order not found');

        order.set({
            status: OrderStatus.Cancelled,
            ticket: null
        });

        await order.save();

        new OrderCancelledPublisher(this.client).publish({
            id: order._id.toJSON(),
            version: order.version,
            ticket: {
                id: order.ticket._id.toJSON()
            }
        });

        msg.ack();
    };
}; 