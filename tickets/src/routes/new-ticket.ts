import express, { Request, Response } from 'express';
import { requireAuth } from '@ticketing_dev/common';
import { body } from 'express-validator';
import { validateRequest } from '@ticketing_dev/common';
import { Ticket } from '../models/tickets-schema';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wappper';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title')
        .not()
        .isEmpty()
        .withMessage("Title is requires"),

    body('price')
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than"),
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });

    await ticket.save();

    new TicketCreatedPublisher(natsWrapper.Client).publish({
        id: ticket._id.toString(),
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    });

    res.status(201).send({
        data: ticket
    });
});

export { router as createTicketRouter };