import { Publisher, Subject, TicketCreatedEvent } from '@ticketing_dev/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subject.TicketCreated = Subject.TicketCreated;
};