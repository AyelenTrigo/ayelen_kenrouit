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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
var jsonParser = body_parser_1.default.json();
run();
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, database_1.connectDb)();
    });
}
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
var urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
app.options('*', (0, cors_1.default)());
app.get('/api/helloWorld', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, database_1.getInfoFromDatabase)();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    console.log(data);
    res.send(data.rows);
}));
app.post('/api/price', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    console.log(res.body.token);
    const token = res.body.token;
    const price = req.body.price;
    yield (0, database_1.setPrice)(token, price);
    console.log(token, price);
    res.send({ message: "Price saved successfully" });
}));
