import express from "express"
import { getInfoFromDatabase, setPrice, connectDb } from "./database"
import  bodyParser  from 'body-parser'
import cors from 'cors'

const app = express()
const port = 3000
var jsonParser = bodyParser.json()
run()

async function run(){
    await connectDb()
}
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

var urlencodedParser = bodyParser.urlencoded({ extended: false})

app.options('*', cors())

app.get('/api/helloWorld', async (req: any, res: any)=> {
    const data = await getInfoFromDatabase()
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    console.log(data)
    res.send(data.rows)
})

app.post('/api/price', jsonParser, async (req: any, res:any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    //console.log(res.body.token)
    const token = req.body.token
    const price = req.body.price
    await setPrice(token, price)
    console.log(token, price)
    res.send({message: "Price saved successfully"})
})

