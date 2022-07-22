import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import * as tt from 'io-ts-types';

type Item = {
  nummer: number;
  artikel: string;
  anzahl: number;
  verpackung: string;
  kistenBezeichnung: string;
  standort: string;
  anmerkung: string;
};

type GetItemFromSpreadsheet = (
  itemNumber: number,
) => TE.TaskEither<unknown, Item>;

const getItemFromSpreadsheet: GetItemFromSpreadsheet = () =>
  pipe(
    {
      nummer: 383,
      artikel: 'Canon EOS 2000D (SN: 103072022149)',
      anzahl: 1,
      verpackung: 'Kiste 29',
      kistenBezeichnung: 'Bild Technik',
      standort: 'Kiel',
      anmerkung: 'Seriennr: 103072022149',
    },
    TE.right,
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

type LookupItem = (query: string) => T.Task<string>;

export const lookupItem: LookupItem = (query) =>
  pipe(
    query,
    tt.NumberFromString.decode,
    TE.fromEither,
    TE.chain(getItemFromSpreadsheet),
    TE.match(renderError(query), renderItem),
  );
