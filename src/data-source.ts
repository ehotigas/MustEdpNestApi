import { DataSource } from "typeorm";


const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'edp',
    entities: [__dirname + '/../**/*.entity.ts'],
    migrations: [__dirname + '/../**/*_migration.ts'],
    synchronize: false,
    logging: true,
});

export default AppDataSource;