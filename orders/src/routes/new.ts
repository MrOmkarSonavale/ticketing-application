import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ticketing_dev/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();
const EXPIRATION_WINDOW_SECOND = 15 * 60;

router.get('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage("TicketId must be provided")
], validateRequest,
    async (req: Request, res: Response) => {
        const { TicketId } = req.body;
        //find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(TicketId);

        if (!ticket) {
            throw new NotFoundError();
        };

        //tickek sure that this ticket is not already reserved

        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError('ticket alrady reserved');
        };

        // calcualte an expiration data for this order 
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECOND);

        // build the order and save it to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });

        await order.save();

        //publish an event saying that an order was created

        res.status(201).send({ order });
    },
);

export { router as newOrderRouter };