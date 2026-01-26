import { Publisher, OrderCreatedEvent, Subject } from "@ticketing_dev/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subject.OrderCreated = Subject.OrderCreated;
};

