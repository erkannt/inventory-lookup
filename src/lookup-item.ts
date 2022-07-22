type LookupItem = (number: unknown) => Record<string, unknown>;

export const lookupItem: LookupItem = () => ({
  nummer: 383,
  artikel: 'Canon EOS 2000D (SN: 103072022149)',
  anzahl: 1,
  verpackung: 'Kiste 29',
  kistenBezeichnung: 'Bild Technik',
  standort: 'Kiel',
  anmerkung: 'Seriennr: 103072022149',
});
