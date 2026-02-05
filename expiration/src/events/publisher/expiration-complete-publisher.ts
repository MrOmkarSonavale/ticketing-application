import { Subject, Publisher, ExpirationCompleteEvent } from "@ticketing_dev/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
}