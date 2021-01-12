import {
  object, string, date, guard, array, nullable
} from 'decoders';
import { first, flow } from 'lodash/fp';
import { basename } from 'path';
import { Pool, QueryResult } from 'pg';
import { createLogger } from '../../common/logger';

const logger = createLogger(basename(__filename));

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

const insertDataRowQuery = 'INSERT INTO apidata (content) VALUES($1) RETURNING *;';
const selectDataRowQuery = 'SELECT * FROM apidata WHERE id = $1';
const selectDataRowsQuery = 'SELECT * FROM apidata';

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

  const execQuery = async (
    query: string,
    args: string[] | string[][]
  ): Promise<QueryResult> => {
    logger.debug(`SQL QUERY: ${query}`);
    const client = await dbPool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(query, args);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw (err);
    } finally {
      client.release();
    }
  };

  const createDataRow = async (content: string): Promise<DataRow> => {
    const res = await execQuery(insertDataRowQuery, [content]);
    return guard(dataDecoder)(first(res.rows));
  };

  const getDataRow = async (id: string): Promise<DataRow | undefined> => {
    const res = await execQuery(selectDataRowQuery, [id]);
    return flow(
      guard(array(dataDecoder)),
      first
    )(res.rows);
  };

  const getDataRows = async (): Promise<DataRow[]> => {
    const res = await execQuery(selectDataRowsQuery, []);
    return guard(array(dataDecoder))(res.rows);
  };

  return {
    getDataRow,
    getDataRows,
    createDataRow
  };
};

export { createDataService, DataService, DataRow };
