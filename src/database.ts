import { Client } from 'pg'

const DATABASE_NAME = "ayelen"
const TABLE = "prices"

const EXISTS_DATABASE_QUERY = `SELECT 'CREATE DATABASE ${DATABASE_NAME}' WHERE EXISTS (SELECT datname FROM pg_database WHERE datname = '${DATABASE_NAME}');`
const CREATE_DATABASE_QUERY = `CREATE DATABASE ${DATABASE_NAME};`
const CREATE_TABLE_PRICE = `CREATE TABLE IF NOT EXISTS ${TABLE} (
    id_price serial,
    price_token VARCHAR(40),
    price_value real
);`

const CONNECTION_DATA = {
    user: "postgres",
            host: "localhost",
            //database: DATABASE_NAME,
            password:"root",
            port: 5432
}
const CONNECTION_DATA_W_DB = {
    ...CONNECTION_DATA,
    database: DATABASE_NAME
}

export const connectDb = async () => {
    try{
        const client = new Client(CONNECTION_DATA)

        await client.connect()
        const existDatabase = await client.query(EXISTS_DATABASE_QUERY)
        if(existDatabase.rows.length==0){
            await client.query(CREATE_DATABASE_QUERY)
        }
        await client.end()

        const client2 = new Client(CONNECTION_DATA_W_DB)
        await client2.connect()
        await client2.query(CREATE_TABLE_PRICE)
        await client2.end()
    } catch(error){
        console.log(error)
    }
}


export async function getInfoFromDatabase(){
    const client = new Client( CONNECTION_DATA_W_DB)
    await client.connect()
    console.log('cliente conectado')
    const queryResult = await client.query(`SELECT * FROM ${TABLE}`)
    console.log(queryResult)
    await client.end()
    return queryResult
}

export async function setPrice(token: string, price: number){
    const client = new Client(CONNECTION_DATA_W_DB)
    await client.connect()
    console.log('cliente conectado')
    const query = `INSERT INTO ${TABLE}(price_token, price_value) VALUES ('${token}', ${price});`
    await client.query(query)
    console.log(query)
    await client.end()
    console.log(`Recording price ${price} for token ${token}`)
}