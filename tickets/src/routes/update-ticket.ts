import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { NotAuthorizedError, validateRequest, NotFoundError, requireAuth } from '@ticketing_dev/common';
import { Ticket } from '../models/tickets-schema';
import { TicketUpdatePublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wappper';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
    body("title")
        .not()
        .isEmpty()
        .withMessage("title is required"),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('price must be provided and must be greater than 0')
], validateRequest, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    };

    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    });

    await ticket.save();

    new TicketUpdatePublisher(natsWrapper.Client).publish({
        id: ticket._id.toString(),
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });


    res.send(ticket);
});

export { router as updateTicketRouter };