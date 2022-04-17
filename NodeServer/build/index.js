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
exports.closeConnectionDB = exports.connectDB = void 0;
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Home_1 = __importDefault(require("./routes/Home"));
const cors_1 = __importDefault(require("cors"));
const mysql2_1 = __importDefault(require("mysql2"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const con = yield mysql2_1.default.createConnection({
            host: 'localhost',
            user: 'alexoid1999',
            password: '18ebyhwb',
            database: 'RadianceEternal'
        });
        con.connect();
        return con;
    }
    catch (err) {
        console.error(err.message);
        return null;
    }
});
exports.connectDB = connectDB;
const closeConnectionDB = (connection) => {
    return connection.end();
};
exports.closeConnectionDB = closeConnectionDB;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../Front/build")));
app.all('*', (request, response) => {
    let filePath = path_1.default.resolve(__dirname, "../Front/build/index.html");
    if (request.url !== "/") {
        // получаем путь после слеша
        filePath = request.url.substr(1);
        console.log(`Go to ${filePath}`);
    }
    fs_1.default.readFile(filePath, (error, data) => {
        if (error) {
            response.statusCode = 404;
            response.end("Resource not found!");
        }
        else {
            response.end(data);
        }
    });
});
const port = process.env.PORT || 5001;
if (false) {
    const server = https_1.default.createServer(app).listen(port, () => {
        console.log(`App Started at port ${port}`);
    });
    (0, Home_1.default)(server);
}
else {
    const server = app.listen(port, () => {
        console.log(`App Started at port ${port}`);
    });
    (0, Home_1.default)(server);
}
//# sourceMappingURL=index.js.map