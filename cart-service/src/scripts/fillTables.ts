import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

const fillTables = async (): Promise<void> => {
  const client = new Client(dbOptions);
  await client.connect()

  try {
    await client.query(`
      do $$ begin
        create type status_type as enum('OPEN','ORDERED');
      exception
        when duplicate_object then null;
      end $$;
    `);
    await client.query(`
      create table if not exists carts (
        id uuid not null default uuid_generate_v4() primary key,
        user_id uuid not null,
        created date not null,
        updated date not null,
        status status_type
      )
    `)
    await client.query(`
      create table if not exists cart_items (
        cart_id uuid,
        product_id uuid,
        count integer,
        foreign key ("cart_id") references "carts" ("id")
      )
    `)

    const cartId = uuidv4();
    const userId = uuidv4();
    await client.query(`
      insert into carts (id, user_id, created, updated, status) values
        ('${cartId}', '${userId}', '${new Date().toISOString()}', '${new Date().toISOString()}', 'OPEN')
    `);
    await client.query(`
      insert into cart_items (cart_id, product_id, count) values
        ('${cartId}', 'c8b50843-f41c-4685-a594-77a54b098b1f', 2)
    `);
  } catch (error) {
    console.error(`DB error: ${error}`);
  } finally {
    client.end()
  }
}

(async () => {
  await fillTables();
})();
