import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, identity, pipe } from 'fp-ts/lib/function';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { formatValidationErrors } from 'io-ts-reporters';
import { Row, sheetCodec } from './types';

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

type GetSheetRows = TE.TaskEither<unknown, ReadonlyArray<Row>>;

type CreateGetSheetRows = () => TE.TaskEither<unknown, GetSheetRows>;

export const createGetSheetRows: CreateGetSheetRows = () =>
  pipe(
    new GoogleSpreadsheet(process.env.SHEET_ID),
    TE.right,
    TE.chainFirst(spreadsheetAuth),
    TE.chainFirst(loadSheetInfo),
    TE.map(
      flow(
        getSheet,
        TE.chainEitherKW(
          flow(sheetCodec.decode, E.mapLeft(formatValidationErrors)),
        ),
      ),
    ),
  );
