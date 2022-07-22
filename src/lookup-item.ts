import { pipe } from 'fp-ts/lib/function';

type LookupItem = (number: unknown) => string;

type Item = {
  nummer: number;
  artikel: string;
  anzahl: number;
  verpackung: string;
  kistenBezeichnung: string;
  standort: string;
  anmerkung: string;
};

const getItem = (): Item => ({
  nummer: 383,
  artikel: 'Canon EOS 2000D (SN: 103072022149)',
  anzahl: 1,
  verpackung: 'Kiste 29',
  kistenBezeichnung: 'Bild Technik',
  standort: 'Kiel',
  anmerkung: 'Seriennr: 103072022149',
});

const renderItem = (item: Item) => `
  <p><b>${item.verpackung}</b> ${item.kistenBezeichnung}</p>
  <p>${item.artikel}</p>
  <p>
    <b>Anzahl:</b> ${item.anzahl}<br>
    <b>Anmerkung:</b> ${item.anmerkung}<br>
    <b>Standort:</b> ${item.standort}<br>
  </p>
`;

export const lookupItem: LookupItem = (number) =>
  pipe(number, getItem, renderItem);
