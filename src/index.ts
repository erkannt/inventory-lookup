/* eslint-disable @typescript-eslint/no-misused-promises */
// express 4 requires explicit handling of failed promises
// express 5 changes this but is still in beta and types
// have not been updated yet
import express, { Application, Request, Response } from 'express';
import path from 'path';
import createLogger from 'pino';
import pinoHttp from 'pino-http';
import { landingPage } from './landing-page';
import { lookupItem } from './lookup-item';

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 8080;

app.use(pinoHttp());

const logger = createLogger();

app.get('/', (req: Request, res: Response) => {
  res.send(landingPage);
});

app.get('/item/:number', async (req: Request, res: Response) => {
  res.status(200).send(await lookupItem({ logger })(req.params.number)());
});

app.use('/static', express.static(path.resolve(__dirname, './static')));

app.listen(port, () => logger.info(`Server is listening on port ${port}`));
