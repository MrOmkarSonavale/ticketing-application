export enum OrderStatus {
    // when the order has been create , but the ticket it is tying to order has not been reserved
    Created = 'created',

    // the ticket the order is trying to reserve has already been reserved , or when the user has cancelled the order
    // order expires before payment 
    Cancelled = 'cancelled',

    //order has successfully reserved the ticket
    AwaitingPayment =
    'awaiting:payment',

    //the order has reserved tje ticket and the user has provided payment successfully
    Complete = 'complete'
};