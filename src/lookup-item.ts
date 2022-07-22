type LookupItem = (number: unknown) => string;

export const lookupItem: LookupItem = () => `foo`
// ({
//   nummer: 383,
//   artikel: 'Canon EOS 2000D (SN: 103072022149)',
//   anzahl: 1,
//   verpackung: 'Kiste 29',
//   kistenBezeichnung: 'Bild Technik',
//   standort: 'Kiel',
//   anmerkung: 'Seriennr: 103072022149',
// });
