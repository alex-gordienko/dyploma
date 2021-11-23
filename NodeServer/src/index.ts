import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import Home from './routes/Home';
import cors from 'cors';
import mysql from 'mysql2';

export const connectDB = async(): Promise<mysql.Connection | null> => {
    try{
        const con = await mysql.createConnection({
            host: 'localhost',
            user: 'alexoid1999',
            password: '18ebyhwb',
            database: 'RadianceEternal'
        });
        con.connect();
        return con;
    } catch (err: any) {
        console.error(err.message);
        return null;
    }
}

export const connectCountriesDB = async(): Promise<mysql.Connection | null> => {
    try{
        const con = await mysql.createConnection({
            host: 'localhost',
            user: 'alexoid1999',
            password: '18ebyhwb',
            database: 'ContryCity'
        });
        con.connect();
        return con;
    } catch (err: any) {
        console.error(err.message);
        return null;
    }
}

export const closeConnectionDB = (connection: mysql.Connection) => {
    return connection.end()
}

const app: express.Express = express();

app.use(cors());

app.use(express.static(path.resolve(__dirname, "../Front/build")));

app.all('*',(request, response) => {
    let filePath = path.resolve(__dirname, "../Front/build/index.html");
    if(request.url !== "/"){
        // получаем путь после слеша
        filePath = request.url.substr(1);
        console.log(`Go to ${filePath}`);
    }
    fs.readFile(filePath, (error, data)=>{
        if(error){
            response.statusCode = 404;
            response.end("Resource not found!");
        }
        else{
            response.end(data);
        }
    });
})

const port = process.env.PORT || 5001;

if (false) {
    const server = https.createServer(app).listen(port, ()=>{
        console.log(`App Started at port ${port}`);
    });
    Home(server);
} else {
    const server = app.listen(port,()=>{
        console.log(`App Started at port ${port}`);
    });
    Home(server);
}
