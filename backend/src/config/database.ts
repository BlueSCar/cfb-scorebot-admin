import { Pool } from 'pg';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';

import { DB } from './types/scores.db';
import { DB as cfbDB } from './types/cfb.db';

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DATABASE_HOST;
const port = process.env.DATABASE_PORT || '5432';
const dbName = process.env.DATABASE_NAME;

const cfbUser = process.env.CFB_DATABASE_USER;
const cfbPassword = process.env.CFB_DATABASE_PASSWORD;
const cfbHost = process.env.CFB_DATABASE_HOST;
const cfbPort = process.env.DATABASE_PORT || '5432';
const cfbName = process.env.CFB_DATABASE_NAME;

const dialect = new PostgresDialect({
  pool: new Pool({
    database: dbName,
    host,
    port: Number(port),
    user,
    password,
    max: 10,
  }),
});

export const scores = new Kysely<DB>({
  dialect,
  plugins: [new CamelCasePlugin()],
});

const cfbDialect = new PostgresDialect({
  pool: new Pool({
    database: cfbName,
    host: cfbHost,
    port: Number(cfbPort),
    user: cfbUser,
    password: cfbPassword,
    max: 10,
  }),
});

export const cfb = new Kysely<cfbDB>({
  dialect: cfbDialect,
  plugins: [new CamelCasePlugin()],
});
