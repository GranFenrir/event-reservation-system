import { Pool, PoolConfig } from 'pg';
import { LoggerUtils } from '@event-system/utils';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: Pool;

  private constructor() {
    const config: PoolConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'event_reservation',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      max: parseInt(process.env.DB_POOL_MAX || '20'),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000'),
    };

    this.pool = new Pool(config);
    
    this.pool.on('connect', () => {
      LoggerUtils.info('New database connection established');
    });

    this.pool.on('error', (err) => {
      LoggerUtils.error('Database connection error:', err);
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      LoggerUtils.debug(`Executed query in ${duration}ms:`, { text, params });
      return result;
    } catch (error) {
      LoggerUtils.error('Database query error:', { text, params, error });
      throw error;
    }
  }

  public async getClient() {
    return await this.pool.connect();
  }

  public async close(): Promise<void> {
    await this.pool.end();
    LoggerUtils.info('Database pool closed');
  }

  public async testConnection(): Promise<boolean> {
    try {
      await this.query('SELECT NOW()');
      LoggerUtils.info('Database connection test successful');
      return true;
    } catch (error) {
      LoggerUtils.error('Database connection test failed:', error);
      return false;
    }
  }
}

export default DatabaseConnection;
