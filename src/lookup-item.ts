import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/lib/function';

type Item = {
  nummer: number;
  artikel: string;
  anzahl: number;
  verpackung: string;
  kistenBezeichnung: string;
  standort: string;
  anmerkung: string;
};

const getItem = (): T.Task<Item> =>
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
    T.of,
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

type LookupItem = (number: unknown) => T.Task<string>;

export const lookupItem: LookupItem = (number) =>
  pipe(number, getItem, T.map(renderItem));
