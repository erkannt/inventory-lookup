import { Row } from './sheet-types';

export const renderRow = (row: Row): string => `
  <p><b>${row.Verpackung}</b> ${row.Kistenbezeichnung}</p>
  <p>${row.Artikel}</p>
  <p>
    <b>Anzahl:</b> ${row.Anzahl}<br>
    <b>Anmerkung:</b> ${row.Anmerkung}<br>
    <b>Standort:</b> ${row.Standort}<br>
  </p>
`;
