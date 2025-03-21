const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

var appController = require("./app/app");

const port = process.env.PORT;

app.use(cors());
app.use(express.json()); // For parsing JSON
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`PORT: ${port}`);
});

app.use("/api", appController);
