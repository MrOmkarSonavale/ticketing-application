import express from "express";
import { currentUser } from "@ticketing_dev/common";



const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
    //req.currentuser have actual jwt payload
    res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter }