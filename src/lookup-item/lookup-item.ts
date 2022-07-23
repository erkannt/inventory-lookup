import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { sequenceS } from 'fp-ts/lib/Apply';
import { constant, flow, identity, pipe } from 'fp-ts/lib/function';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { formatValidationErrors } from 'io-ts-reporters';
import * as tt from 'io-ts-types';
import { Logger } from 'pino';
import { renderError } from './render-error';
import { renderRow } from './render-row';
import { Row, sheetCodec } from './sheet-types';

const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

const spreadsheetAuth = (document: GoogleSpreadsheet) =>
  TE.tryCatch(
    async () =>
      document.useServiceAccountAuth({
        client_email:
          process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ??
          'no client email provided',
        private_key:
          process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') ??
          'no private key provided',
      }),
    identity,
  );

const loadSheetInfo = (document: GoogleSpreadsheet) =>
  TE.tryCatch(async () => document.loadInfo(), identity);

const getSheet = (document: GoogleSpreadsheet) =>
  TE.tryCatch(
    async () => document.sheetsByIndex[0].getRows({ offset: 1, limit: 10000 }),
    identity,
  );

type GetMatchingRow = (
  numberToFind: number,
  sheetRows: ReadonlyArray<Row>,
) => TE.TaskEither<unknown, Row>;

const getMatchingRow: GetMatchingRow = (numberToFind, sheetRows) =>
  pipe(
    sheetRows,
    RA.findFirst((row) => row.Nummer === numberToFind.toString()),
    E.fromOption(() => `Could not find row with Nummer ${numberToFind}`),
    TE.fromEither,
  );

const getSheetRows = pipe(
  doc,
  TE.right,
  TE.chainFirst(spreadsheetAuth),
  TE.chainFirst(loadSheetInfo),
  TE.chain(getSheet),
  TE.chainEitherKW(flow(sheetCodec.decode, E.mapLeft(formatValidationErrors))),
);

type Ports = {
  logger: Logger;
};

type LookupItem = (ports: Ports) => (query: string) => T.Task<string>;

export const lookupItem: LookupItem = (ports) => (query) =>
  pipe(
    {
      numberToFind: pipe(
        query,
        tt.NumberFromString.decode,
        E.mapLeft(constant('query is not a number')),
        TE.fromEither,
      ),
      sheetRows: getSheetRows,
    },
    sequenceS(TE.ApplyPar),
    TE.chain(({ numberToFind, sheetRows }) =>
      getMatchingRow(numberToFind, sheetRows),
    ),
    TE.match(renderError(query), (error) => {
      ports.logger.error(error);
      return renderRow(error);
    }),
  );
