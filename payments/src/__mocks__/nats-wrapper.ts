export const natsWrapper = {
    Client: {
        publish: jest.fn().mockImplementation((subjest: string, data: string, callback: () => void) => {
            callback();
        })
    },
};