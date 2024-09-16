const express = require('express');
const app = express();
const cookieParser= require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDataBase = require('./src/Configs/connectDataBase.js');
connectDataBase();



app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));


app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.listen(3033, () => {
    console.log("Server is running.....");
})