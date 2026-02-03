import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@ticketing_dev/common';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wappper';


const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;

    await order.save();

    new OrderCancelledPublisher(natsWrapper.Client).publish({
        id: order._id.toJSON(),
        version: order.version,
        ticket: {
            id: order.ticket._id.toJSON(),
        }
    });

    res.status(204).send({ order });
});

export { router as deleteOrderRouter };