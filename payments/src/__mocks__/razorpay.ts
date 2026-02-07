export const razorpay = {
    orders: {
        create: jest.fn().mockResolvedValue({
            id: "order_test_123",
            amount: 50000,
            currency: "INR",
            status: "created"
        })
    }
};
