import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/setup';

const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'askdfdf',
            price: 20
        })
};

it('can fetch a list a tickets', async () => {
    await Promise.all([createTicket(), createTicket(), createTicket()]);

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
})