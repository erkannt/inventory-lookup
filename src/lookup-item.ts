import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, identity, pipe } from 'fp-ts/lib/function';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import * as tt from 'io-ts-types';
import { Logger } from 'pino';

const rowCodec = t.exact(
  t.type({
    Nummer: t.string,
    Artikel: t.string,
    Anzahl: t.string,
    Verpackung: t.string,
    Kistenbezeichnung: t.string,
    Standort: t.string,
    Anmerkung: tt.withFallback(t.string, ''),
  }),
);

type Row = t.TypeOf<typeof rowCodec>;

const sheetCodec = t.array(rowCodec);

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
  logger: Logger,
) => (itemNumber: number) => TE.TaskEither<unknown, Row>;

const getMatchingRow: GetMatchingRow = () => (itemNumber) =>
  pipe(
    doc,
    TE.right,
    TE.chainFirst(spreadsheetAuth),
    TE.chainFirst(loadSheetInfo),
    TE.chain(getSheet),
    TE.chainEitherKW(
      flow(sheetCodec.decode, E.mapLeft(formatValidationErrors)),
    ),
    TE.chainEitherKW(
      flow(
        RA.findFirst((row) => row.Nummer === itemNumber.toString()),
        E.fromOption(() => `Could not find row with Nummer ${itemNumber}`),
      ),
    ),
  );

const renderRow = (row: Row) => `
  <p><b>${row.Verpackung}</b> ${row.Kistenbezeichnung}</p>
  <p>${row.Artikel}</p>
  <p>
    <b>Anzahl:</b> ${row.Anzahl}<br>
    <b>Anmerkung:</b> ${row.Anmerkung}<br>
    <b>Standort:</b> ${row.Standort}<br>
  </p>
`;

const renderError = (query: string) => (error: unknown) =>
  `
  <h2>Ooops</h2>
  <p>Couldn't retrieve an info for query: ${query}</p>
  <h2>Error message</h2>
  <p>${String(error)}</p>
`;

type Ports = {
  logger: Logger;
};

type LookupItem = (ports: Ports) => (query: string) => T.Task<string>;

export const lookupItem: LookupItem = (ports) => (query) =>
  pipe(
    query,
    tt.NumberFromString.decode,
    TE.fromEither,
    TE.chain(getMatchingRow(ports.logger)),
    TE.match(renderError(query), (error) => {
      ports.logger.error(error);
      return renderRow(error);
    }),
  );
