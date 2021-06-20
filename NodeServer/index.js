const express = require('express');
const fs = require("fs");
const path = require('path');
const Home = require("./routes/Home");
const cors = require('cors');

const app = express();

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

server = app.listen(port,()=>{
    console.log(`App Started at port ${port}`);
});



Home(server);