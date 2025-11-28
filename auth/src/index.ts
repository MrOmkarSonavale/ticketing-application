import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { currentUserRouter } from './routes/current-user';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();

app.use(bodyParser.json());

app.use(signinRouter);
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signoutRouter);


// app.all('*', async (req, res) => {`
//     throw new NotFoundError();
// })

app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        console.log("connected to mongodb");
    }
    catch (err) {
        console.error(err);
    }
}

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

start();