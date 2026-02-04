import { Subject } from "./subject";

export interface ExpirationCompleteEvent {
    subject: Subject.expirationComplete;

    data: {
        orderId: string;
    }
};