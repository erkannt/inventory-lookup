import * as t from 'io-ts';
import * as tt from 'io-ts-types';

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

export type Row = t.TypeOf<typeof rowCodec>;

export const sheetCodec = t.array(rowCodec);
