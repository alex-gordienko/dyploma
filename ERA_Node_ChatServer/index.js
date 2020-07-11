const express = require('express');
const Home = require("./routes/Home");
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.static(__dirname+'/public'));

const port = process.env.PORT || 5001;

server = app.listen(port,()=>{
    console.log(`App Started at port ${port}`);
});



Home(server);