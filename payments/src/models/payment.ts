import mongoose from "mongoose";

interface PaymentAttrs {
    orderId: string;
    razorpayId: string;
}

interface PaymentDoc extends mongoose.Document {
    orderId: string;
    razorpayId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema<PaymentDoc>(
    {
        orderId: {
            type: String,
            required: true,
        },
        razorpayId: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
    "Payment",
    paymentSchema
);

export { Payment };
