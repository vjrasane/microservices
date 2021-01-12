import {
  object, string, date, guard, array, nullable
} from 'decoders';
import { first, flow } from 'lodash/fp';
import { basename } from 'path';
import { Pool, QueryResult } from 'pg';
import { createLogger } from '../../common/logger';

const logger = createLogger(basename(__filename));

const execSql = async (pool: Pool, sqlQuery: string, args: string[] | string[][]): Promise<QueryResult> => {
  logger.debug(`SQL QUERY: ${sqlQuery}`);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(sqlQuery, args);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw (err);
  } finally {
    client.release();
  }
};

type DataRow = {
    id: string,
    createtime: Date,
    updatetime: Date,
    deletetime: Date | null,
    content: string,
}

const dataDecoder = object({
  id: string,
  createtime: date,
  updatetime: date,
  deletetime: nullable(date),
  content: string
});

const insertDataRowQuery = (
  `INSERT INTO appdata (content)
  VALUES($1)
  RETURNING *;`
);

const selectDataRowQuery = 'SELECT * FROM appdata WHERE id = $1';
const selectDataRowsQuery = 'SELECT * FROM appdata';

type DataService = {
    getDataRow: (id: string) => Promise<DataRow | undefined>;
    getDataRows: () => Promise<DataRow[]>;
    createDataRow: (content: string) => Promise<DataRow>;
}

type DataConfig = {
    dbPool: Pool
}

const createDataService = (config: DataConfig): DataService => {
  const { dbPool } = config;

  const createDataRow = async (content: string): Promise<DataRow> => {
    const res = await execSql(dbPool, insertDataRowQuery, [content]);
    return guard(dataDecoder)(first(res.rows));
  };

  const getDataRow = async (id: string): Promise<DataRow | undefined> => {
    const res = await execSql(dbPool, selectDataRowQuery, [id]);
    return flow(
      guard(array(dataDecoder)),
      first
    )(res.rows);
  };

  const getDataRows = async (): Promise<DataRow[]> => {
    const res = await execSql(dbPool, selectDataRowsQuery, []);
    return guard(array(dataDecoder))(res.rows);
  };

  return {
    getDataRow,
    getDataRows,
    createDataRow
  };
};

export { createDataService, DataService, DataRow };
