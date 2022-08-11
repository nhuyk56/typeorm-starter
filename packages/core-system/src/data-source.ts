import "reflect-metadata"
import { DataSource } from "typeorm"
import { Story } from "./entity/Story"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "iii3studi1",
    database: "TS60",
    synchronize: true,
    logging: false,
    entities: [Story],
    migrations: [],
    subscribers: [],
})
