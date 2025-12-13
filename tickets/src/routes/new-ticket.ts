import express, { Request, Response } from 'express';
import { requireAuth } from '@ticketing_dev/common';
import { body } from 'express-validator';
import { validateRequest } from '@ticketing_dev/common';
import { Ticket } from '../models/tickets-schema';

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

    res.status(201).send({
        data: ticket
    });
});

export { router as createTicketRouter };