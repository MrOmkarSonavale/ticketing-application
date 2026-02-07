import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/setup';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@ticketing_dev/common';

it('returns a 404 when purchasing an order that does not exit', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', signin())
        .send({
            token: 'asffdf',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it('return a 401 when purchasing an order that doesnt belong to the user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created,
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', signin())
        .send({
            token: 'asffdf',
            orderId: order.id
        })
        .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled,
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', signin(userId))
        .send({
            orderId: order.id,
            token: 'afdf'
        })
        .expect(400);
});