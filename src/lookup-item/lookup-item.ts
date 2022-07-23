import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { sequenceS } from 'fp-ts/lib/Apply';
import { constant, pipe } from 'fp-ts/lib/function';
import * as tt from 'io-ts-types';
import { Logger } from 'pino';
import { Row } from '../types';
import { renderError } from './render-error';
import { renderRow } from './render-row';

type LookupMatchingRow = (
  numberToFind: number,
  sheetRows: ReadonlyArray<Row>,
) => TE.TaskEither<unknown, Row>;

const lookupMatchingRow: LookupMatchingRow = (numberToFind, sheetRows) =>
  pipe(
    sheetRows,
    RA.findFirst((row) => row.Nummer === numberToFind.toString()),
    E.fromOption(() => `Could not find row with Nummer ${numberToFind}`),
    TE.fromEither,
  );

type Ports = {
  logger: Logger;
  getSheetRows: TE.TaskEither<unknown, ReadonlyArray<Row>>;
};

type LookupItem = (ports: Ports) => (query: string) => T.Task<string>;

export const lookupItem: LookupItem = (ports) => (query) =>
  pipe(
    {
      numberToFind: pipe(
        query,
        tt.NumberFromString.decode,
        E.mapLeft(constant('query is not a number')),
        TE.fromEither,
      ),
      sheetRows: ports.getSheetRows,
    },
    sequenceS(TE.ApplyPar),
    TE.chain(({ numberToFind, sheetRows }) =>
      lookupMatchingRow(numberToFind, sheetRows),
    ),
    TE.match((error) => {
      ports.logger.error(error);
      return renderError(query, error);
    }, renderRow),
  );
