import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { signin } from '../../test/setup';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('return error if the ticket does not exit', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post(
            '/api/orders'
        ).set('Cookie', signin())
        .send({
            ticketId
        })
        .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: "concert",
        price: 20
    });

    await ticket.save();

    const order = Order.build({
        ticket,
        userId: 'dfsdaf',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });

    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', signin())
        .send({ ticketId: ticket._id })
        .expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });

    await ticket.save();

    await request(app)
        .post("/api/orders")
        .set('Cookie', signin())
        .send({ ticketId: ticket._id })
        .expect(201)
});

it.todo("emit an order create event");