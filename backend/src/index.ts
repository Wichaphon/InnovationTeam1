import express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello from Express + TypeScript!');
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
});