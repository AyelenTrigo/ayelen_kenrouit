"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPrice = exports.getInfoFromDatabase = exports.connectDb = void 0;
const pg_1 = require("pg");
const DATABASE_NAME = "ayelen";
const TABLE = "prices";
const EXISTS_DATABASE_QUERY = `SELECT 'CREATE DATABASE ${DATABASE_NAME}' WHERE EXISTS (SELECT datname FROM pg_database WHERE datname = '${DATABASE_NAME}');`;
const CREATE_DATABASE_QUERY = `CREATE DATABASE ${DATABASE_NAME};`;
const CREATE_TABLE_PRICE = `CREATE TABLE IF NOT EXISTS ${TABLE} (
    id_price serial,
    price_token VARCHAR(40),
    price_value real
);`;
const CONNECTION_DATA = {
    user: "postgres",
    host: "localhost",
    //database: DATABASE_NAME,
    password: "root",
    port: 5432
};
const CONNECTION_DATA_W_DB = Object.assign(Object.assign({}, CONNECTION_DATA), { database: DATABASE_NAME });
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new pg_1.Client(CONNECTION_DATA);
        yield client.connect();
        const existDatabase = yield client.query(EXISTS_DATABASE_QUERY);
        if (existDatabase.rows.length == 0) {
            yield client.query(CREATE_DATABASE_QUERY);
        }
        yield client.end();
        const client2 = new pg_1.Client(CONNECTION_DATA_W_DB);
        yield client2.connect();
        yield client2.query(CREATE_TABLE_PRICE);
        yield client2.end();
    }
    catch (error) {
        console.log(error);
    }
});
exports.connectDb = connectDb;
function getInfoFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new pg_1.Client(CONNECTION_DATA_W_DB);
        yield client.connect();
        console.log('cliente conectado');
        const queryResult = yield client.query(`SELECT * FROM ${TABLE}`);
        console.log(queryResult);
        yield client.end();
        return queryResult;
    });
}
exports.getInfoFromDatabase = getInfoFromDatabase;
function setPrice(token, price) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new pg_1.Client(CONNECTION_DATA_W_DB);
        yield client.connect();
        console.log('cliente conectado');
        const query = `INSERT INTO ${TABLE}(price_token, price_value) VALUES ('${token}', ${price});`;
        yield client.query(query);
        console.log(query);
        yield client.end();
        console.log(`Recording price ${price} for token ${token}`);
    });
}
exports.setPrice = setPrice;
