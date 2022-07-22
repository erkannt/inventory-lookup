/* eslint-disable @typescript-eslint/no-misused-promises */
// express 4 requires explicit handling of failed promises
// express 5 changes this but is still in beta and types
// have not been updated yet
import express, { Application, Request, Response } from 'express';
import path from 'path';
import { landingPage } from './landing-page';

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 8080;

app.get('/', (req: Request, res: Response) => {
  res.status(200).send(landingPage);
});

app.use('/static', express.static(path.resolve(__dirname, './static')));

app.listen(port, () =>
  process.stdout.write(`Server is listening on port ${port}!\n`),
);
