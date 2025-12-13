import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/setup';

it('return a 404 if the ticket is not found', async () => {
    await request(app)
        .get('/api/tickets/dagd')
        .send()
        .expect(404);
});

it('return the ticket if the ticket is found', async () => {
    const title = "omar";
    const price = 1;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title,
            price
        })
        .expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual('omar');
    expect(ticketResponse.body.price).toEqual(1);
});

