import "express-serve-static-core";

declare global {
    namespace Express {
        interface Request {
            session?: {
                jwt?: string;
            };
        }
    }
}

export { };
