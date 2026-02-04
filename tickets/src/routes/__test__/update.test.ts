import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { signin } from '../../test/setup';
import { natsWrapper } from '../../__mocks__/nats-wrapper';
import { Ticket } from '../../models/tickets-schema';

//ok
it('return a 404 if the provided id does not exits', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', signin())
        .send({
            title: 'asldgh',
            price: 20
        })
        .expect(404);
});

// 410 error
it('return a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'asldgh',
            price: 20
        })
        .expect(401);
});

// 410 gone
it('return a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'asldfh',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', signin())//new user genrated
        .send({
            title: 'alexanderdfs',
            price: 1000
        })
        .expect(401);
});

// ok
it('return a 400 if the user provides an invalid title or price', async () => {
    const cookie = signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asldfh',
            price: 20
        });


    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'asdfkf',
            price: -10
        })
        .expect(400);
});

it('update the ticket provided valid inputs', async () => {
    const cookie = signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdfkf',
            price: 20
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 10
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual('new title');
    expect(ticketResponse.body.price).toEqual(100);
});

it('publish an event', async () => {
    const cookie = signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asldkfh',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "new title",
            price: 100
        })
        .expect(200);
});

it('reject updates if the ticket is reserved', async () => {
    const cookie = signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdfkf',
            price: 20
        });


    const ticket = await Ticket.findById(response.body.id);

    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

    await ticket!.save();

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 10
        })
        .expect(200);
});