import { OrderStatus } from "./order-status";
import { Subject } from "./subject";


export interface OrderCreatedEvent {
    subject: Subject.OrderCreated;
    data: {
        id: string;
        status: OrderStatus;
        userID: string;
        expiresAt: string;
        ticket:
        {
            id: string;
            price: number;
        }
    };
};
