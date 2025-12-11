import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler } from '@ticketing_dev/common';


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



// app.all('*', async (req, res) => {`
//     throw new NotFoundError();
// })

app.use(errorHandler);

export { app };