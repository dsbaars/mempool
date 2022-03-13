import config from './config';
import { createPool } from 'mysql2/promise';
import logger from './logger';
import { PoolOptions } from 'mysql2/typings/mysql';

export class DB {
  static poolConfig = ():PoolOptions => {
    let poolConfig:PoolOptions = {
      port: config.DATABASE.PORT,
      database: config.DATABASE.DATABASE,
      user: config.DATABASE.USERNAME,
      password: config.DATABASE.PASSWORD,
      connectionLimit: 10,
      supportBigNumbers: true,
      timezone: '+00:00',
    }

    if (config.DATABASE.SOCKET)
      poolConfig.socketPath = config.DATABASE.SOCKET
    else    
      poolConfig.host = config.DATABASE.HOST

    return poolConfig;
  }

  static pool = createPool(DB.poolConfig());
}

export async function checkDbConnection() {
  try {
    const connection = await DB.pool.getConnection();
    logger.info('Database connection established.');
    connection.release();
  } catch (e) {
    logger.err('Could not connect to database: ' + (e instanceof Error ? e.message : e));
    process.exit(1);
  }
}
