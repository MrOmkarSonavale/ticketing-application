import { Subject, Publisher, PaymentCreatedEvent } from "@ticketing_dev/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subject.PaymentCreated = Subject.PaymentCreated;
};