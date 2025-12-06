import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user-schema";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken"



const router = express.Router();

router.post("/api/users/signup", [
    body('email')
        .isEmail()
        .withMessage("email must be valid"),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("password must be between 4 to 20 characters")
], validateRequest,
    async (req: Request, res: Response) => {

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError("Email in use");
        }

        const user = User.build({ email, password });

        await user.save();

        // genrate jwt token on session object
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        },
            process.env.JWT_KEY!
        );

        //store in session


        req.session = {
            jwt: userJwt
        }



        res.status(200).send({
            message: "success",
            payload: user
        });
    });

export { router as signupRouter }