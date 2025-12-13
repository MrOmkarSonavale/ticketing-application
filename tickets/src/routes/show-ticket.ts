import express, { Request, Response } from 'express';
import { Ticket } from '../models/tickets-schema';
import { NotFoundError } from '@ticketing_dev/common';

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    };


    res.status(200).send({
        data: ticket
    });


});

export { router as showTicketRouter }