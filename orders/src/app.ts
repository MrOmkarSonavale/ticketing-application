import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler } from '@ticketing_dev/common';
import { NotFoundError } from '@ticketing_dev/common';
import { currentUser } from '@ticketing_dev/common';
import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes/index';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

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

app.use(currentUser);
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.use(errorHandler);


app.all(/.*/, async (req, res) => {
    throw new NotFoundError();
});


export { app };