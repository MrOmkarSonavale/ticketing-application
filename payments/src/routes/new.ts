import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@ticketing_dev/common';

import { Payment } from '../models/payment';

import { Order } from '../models/order';
import { razorpay } from '../razorpay';

const router = express.Router();

router.post('/api/payments', requireAuth, [
    body('token')
        .not()
        .isEmpty(),
    body('orderId')
        .not()
        .isEmpty()
], validateRequest, async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    };

    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("can not pay for an cancelled order");
    };

    const charge = await razorpay.orders.create({
        amount: order.price, // Razorpay works in paise
        currency: "INR",
        receipt: "ticket_receipt_" + Date.now()
    });

    const payment = Payment.build({
        orderId,
        razorpayId: charge.id
    });

    await payment.save();

    res.status(201).send({ success: true });
});

export { router as createChargeRouter };

