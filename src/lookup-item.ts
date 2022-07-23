import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import * as tt from 'io-ts-types';
import { Logger } from 'pino';

type Item = {
  nummer: number;
  artikel: string;
  anzahl: number;
  verpackung: string;
  kistenBezeichnung: string;
  standort: string;
  anmerkung: string;
};

const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

const spreadsheetAuth = TE.tryCatch(
  async () =>
    doc.useServiceAccountAuth({
      client_email:
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? 'no client email provided',
      private_key:
        process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') ??
        'no private key provided',
    }),
  (error) => {
    return error;
  },
);

type GetItemFromSpreadsheet = (
  logger: Logger,
) => (itemNumber: number) => TE.TaskEither<unknown, Item>;

const getItemFromSpreadsheet: GetItemFromSpreadsheet = () => () =>
  pipe(
    spreadsheetAuth,
    TE.map(() => ({
      nummer: 383,
      artikel: 'Canon EOS 2000D (SN: 103072022149)',
      anzahl: 1,
      verpackung: 'Kiste 29',
      kistenBezeichnung: 'Bild Technik',
      standort: 'Kiel',
      anmerkung: 'Seriennr: 103072022149',
    })),
  );

const renderItem = (item: Item) => `
  <p><b>${item.verpackung}</b> ${item.kistenBezeichnung}</p>
  <p>${item.artikel}</p>
  <p>
    <b>Anzahl:</b> ${item.anzahl}<br>
    <b>Anmerkung:</b> ${item.anmerkung}<br>
    <b>Standort:</b> ${item.standort}<br>
  </p>
`;

const renderError = (query: string) => () =>
  `
  <h2>Ooops</h2>
  <p>Couldn't retrieve an info for query: ${query}</p>
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
    TE.chain(getItemFromSpreadsheet(ports.logger)),
    TE.match(renderError(query), renderItem),
  );
