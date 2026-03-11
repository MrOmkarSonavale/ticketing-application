import { Subject, Listener, PaymentCreatedEvent, OrderStatus } from "@ticketing_dev/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";


export class PaymentCreatedListner extends Listener<PaymentCreatedEvent> {
    subject: Subject.PaymentCreated = Subject.PaymentCreated;

    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) throw new Error('order not found');

        order.set({
            status: OrderStatus.Complete
        });

        await order.save();

        msg.ack();
    };

};