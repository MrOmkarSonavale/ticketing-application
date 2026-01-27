import request from 'supertest';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { signin } from '../../test/setup';
import { app } from '../../app';
import { natsWrapper } from '../../__mocks__/nats-wrapper';

it('marks an order as cancelled', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const user = signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket._id })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);


    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('emits a order cancelled event', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const user = signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket._id })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    expect(natsWrapper.Client.publish).toHaveBeenCalled();
});