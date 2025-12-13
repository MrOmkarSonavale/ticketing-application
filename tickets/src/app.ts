import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler } from '@ticketing_dev/common';
import { NotFoundError } from '@ticketing_dev/common';
import { createTicketRouter } from './routes/new-ticket';
import { currentUser } from '@ticketing_dev/common';
import { showTicketRouter } from './routes/show-ticket';
import { indexTicketRouter } from './routes/index-ticket';
import { updateTicketRouter } from './routes/update-ticket';

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all(/.*/, async (req, res) => {
    throw new NotFoundError();
});


app.use(errorHandler);

export { app };