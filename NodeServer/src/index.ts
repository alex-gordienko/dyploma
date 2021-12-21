import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import Home from './routes/Home';
import cors from 'cors';
import mysql, { RowDataPacket } from 'mysql2';
import Neural from './Neural/app';

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

app.use(express.static(path.resolve(__dirname, "../buildFront")));

app.all('*', async (request, response, next) => {
    let filePath = path.resolve(__dirname, "../buildFront/index.html");
    if (request.url.includes('/confirm')) {
        try {
            const { token, user } = request.query;
            const con = await connectDB();

            const dbUser = await con?.promise().query(`SELECT regToken FROM Users WHERE username='${user}'`);
            if (dbUser && (dbUser as RowDataPacket[][])[0][0].regToken === token) {
                await con?.promise().query(`UPDATE Users SET isConfirm=1 WHERE username='${user}'`);
                console.log(`${user} is success verified`);
                response.redirect('/login');
            }
        } catch (err) {
            console.error('Confirmation error', { err });
            response.status(400).json({
                    operation: 'User Validation',
                    status: 'Server Error',
                    data: {
                        requestFor: 'validate email',
                        response: err
                    }
                });
        } finally {
            next();
        }
    }
    if (request.url !== "/") {
        // получаем путь после слеша
        filePath = request.url.substr(1);
        console.log(`Go to ${filePath}`);
    }
    fs.readFile(filePath, (error, data)=>{
        if (error) {
            console.error(error);
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
    setInterval(() => {
        Neural({skip_training: true});
    }, 1000 * 10);

    const server = https.createServer(app).listen(port, ()=>{
        console.log(`App Started at port ${port}`);
    });
    Home(server);
} else {
    setTimeout(() => {
        Neural({skip_training: true});
    }, 1000 * 10);

    const server = app.listen(port,()=>{
        console.log(`App Started at port ${port}`);
    });
    Home(server);
}
