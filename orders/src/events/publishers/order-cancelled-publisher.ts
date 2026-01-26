import { Publisher, Subject, OrderCancelledEvent } from "@ticketing_dev/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subject.OrderCancelled = Subject.OrderCancelled;
};

