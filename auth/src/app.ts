import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { currentUserRouter } from './routes/current-user';
import { errorHandler } from './middlewares/error-handler';

const app = express();

//to ensure when make https call this nignx proxy is secure
app.set('trust proxy', true);


app.use(bodyParser.json());
app.use(
    cookieSession({
        signed: false,
        secure: false
    })
);

app.use(signupRouter);
app.use(signinRouter);
app.use(currentUserRouter);
app.use(signoutRouter);


// app.all('*', async (req, res) => {`
//     throw new NotFoundError();
// })

app.use(errorHandler);

export { app };