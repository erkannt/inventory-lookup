/* eslint-disable @typescript-eslint/no-misused-promises */
// express 4 requires explicit handling of failed promises
// express 5 changes this but is still in beta and types
// have not been updated yet
import express, { Application, Request, Response } from 'express';
import * as TE from 'fp-ts/TaskEither';
import { sequenceS } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/function';
import path from 'path';
import createLogger from 'pino';
import pinoHttp from 'pino-http';
import { createGetSheetRows } from './create-get-sheet-rows';
import { lookupItem } from './lookup-item';
import { manualPage } from './manual-page';
import { scannerPage } from './scanner-page';

const PORT = 8080;

void pipe(
  {
    logger: TE.right(createLogger()),
    getSheetRows: createGetSheetRows(),
  },
  sequenceS(TE.ApplyPar),
  TE.map((adapters) => {
    const app: Application = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(pinoHttp());
    app.get('/', (req: Request, res: Response) => {
      res.send(scannerPage);
    });

    app.get('/manual', (req: Request, res: Response) => {
      res.send(manualPage);
    });

    app.get('/item/:number', async (req: Request, res: Response) => {
      res.status(200).send(await lookupItem(adapters)(req.params.number)());
    });

    app.use('/static', express.static(path.resolve(__dirname, './static')));

    return { app, adapters };
  }),
  (foo) => foo,
  TE.matchW(
    (error) =>
      process.stderr.write(`Failed to launch server: ${String(error)}`),
    ({ app, adapters }) => {
      app.listen(PORT, () =>
        adapters.logger.info(`Server is listening on port ${PORT}`),
      );
    },
  ),
)();
