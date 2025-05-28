import { DataSource } from "typeorm";


const AppDataSource = new DataSource({
    type: 'mysql',
    host: '10.161.248.71',
    port: 3307,
    username: 'eh_o_tigas',
    password: '#Edp.202412',
    database: 'edp',
    entities: [__dirname + '/../**/*.entity.ts'],
    migrations: [__dirname + '/../**/*_migration.ts'],
    synchronize: false,
    logging: true,
    connectTimeout: 30000
});

export default AppDataSource;