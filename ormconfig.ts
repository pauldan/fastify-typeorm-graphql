function createConnectionOptions() {
  const defaultConfig = {
    type: 'sqlite',
    database: 'database.sqlite',

    synchronize: true,
    // dropSchema: true, // recreates the schema. wipes all data.
    logging: true,
    entities: ['dist/entity/*{.ts,.js}'],
    migrations: ['dist/migration/**/*{.ts,.js}'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration/',
      subscribersDir: 'src/subscriber',
    },
  };
  const { PG_DATABASE, PG_HOST, PG_USER, PG_PASSWD, PG_PORT } = process.env;

  // if the environment is set for postgres use it
  if (PG_DATABASE && PG_HOST && PG_USER && PG_PASSWD && PG_PORT) {
    return {
      ...defaultConfig,
      type: 'postgres',
      host: PG_HOST,
      port: Number.parseInt(PG_PORT, 10),
      username: PG_USER,
      password: PG_PASSWD,
      database: PG_DATABASE,
    };
  } else {
    return defaultConfig;
  }
}

module.exports = createConnectionOptions();
