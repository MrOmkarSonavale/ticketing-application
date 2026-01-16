import request from "supertest";
import { app } from '../../app';
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { signin } from "../../test/setup";

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });

    return ticket;
};

it('fetches order for an particular user', async () => {
    //create three tickets
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = signin();
    const userTwo = signin();

    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne._id })
        .expect(201);

    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketTwo._id })
        .expect(201);


    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketThree._id })
        .expect(201);

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    // console.log(response.body);
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo._id);
    expect(response.body[1].ticket.id).toEqual(ticketThree._id);

});