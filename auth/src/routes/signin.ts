import express from "express";
import { body } from "express-validator";
import { Request, Response } from "express";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user-schema";
import { Password } from "../services/password-service";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/api/users/signin", [
    body('email').isEmail().withMessage('email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must be provide a password')
], validateRequest, async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const findUser = await User.findOne({ email })

    if (!findUser) {
        throw new BadRequestError("Invalid credientials")
    }

    const passwordMatch = await Password.compare(findUser.password, password)

    if (!passwordMatch) throw new BadRequestError(
        "invalid credientials"
    );

    const userJwt = jwt.sign(
        {
            id: findUser.id,
            email: findUser.email
        },
        process.env.JWT_KEY!
    );

    //store it in session storage
    req.session = {
        jwt: userJwt
    }

    res.status(200).send({
        message: "success",
        payload: findUser
    })
});

export { router as signinRouter }