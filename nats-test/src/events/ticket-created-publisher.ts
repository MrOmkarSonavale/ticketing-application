import { Publisher } from '../../../common/src/events/base-publisher.ts';
import { TicketCreatedEvent } from '../../../common/src/events/ticket-created-event.ts';
import { Subject } from '../../../common/src/events/subject.ts';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subject.TicketCreated = Subject.TicketCreated;
};