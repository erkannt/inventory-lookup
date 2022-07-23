/* eslint-disable @typescript-eslint/no-misused-promises */
// express 4 requires explicit handling of failed promises
// express 5 changes this but is still in beta and types
// have not been updated yet
import express, { Application, Request, Response } from 'express';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import path from 'path';
import createLogger from 'pino';
import pinoHttp from 'pino-http';
import { createGetSheetRows } from './get-sheet-rows';
import { landingPage } from './landing-page';
import { lookupItem } from './lookup-item';

const PORT = 8080;

void pipe(
  {
    logger: createLogger(),
    getSheetRows: createGetSheetRows(),
  },
  TE.right,
  TE.map((adapters) => {
    const app: Application = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(pinoHttp());
    app.get('/', (req: Request, res: Response) => {
      res.send(landingPage);
    });

    app.get('/item/:number', async (req: Request, res: Response) => {
      res.status(200).send(await lookupItem(adapters)(req.params.number)());
    });

    app.use('/static', express.static(path.resolve(__dirname, './static')));

    return { app, adapters };
  }),
  TE.map(({ app, adapters }) => {
    app.listen(PORT, () =>
      adapters.logger.info(`Server is listening on port ${PORT}`),
    );
  }),
)();
