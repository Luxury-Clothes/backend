import { Pool } from 'pg';

// const devConfig = {
//   user: process.env.PG_USER!,
//   password: process.env.PG_PASSWORD!,
//   host: process.env.PG_HOST!,
//   database: process.env.PG_DATABASE!,
//   port: +process.env.PG_PORT!,
// };

// const devConfig = `postgresql://postgres:123456@db:5432/postgres`;

const devConfig = `postgresql://harry:89179645957@localhost:5432/shop`;

const proConfig = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === 'production' ? proConfig : devConfig,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const query = (text: string, vars: any[]) => pool.query(text, vars);
