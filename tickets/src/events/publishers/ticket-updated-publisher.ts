import { Publisher, Subject, TicketUpdatedEvent } from '@ticketing_dev/common';

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subject.TicketUpdated = Subject.TicketUpdated;
};