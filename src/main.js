import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;
import {DB_NAME} from './constants.js'

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: `${process.env.DB_PASS}`,
  database: `${DB_NAME}`
});

try {
  await client.connect();
  console.log('Connected to PostgreSQL');
} catch (err) {
  console.error('Error:', err.stack);
} finally {
  await client.end();
}