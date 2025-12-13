import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { signin } from '../../test/setup';

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

it('return a 400 if the user provides an invalid title or price', async () => {

});

it('', async () => {

});