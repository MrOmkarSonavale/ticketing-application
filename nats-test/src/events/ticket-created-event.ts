import { Subject } from "./subject.js";

export interface TicketCreatedEvent {
    subject: Subject.TicketCreated;
    data: {
        id: string;
        title: string;
        price: number
    };
};