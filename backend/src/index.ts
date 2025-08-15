import express = require('express');

const app = express();
const route = express.Router();


const PORT = 5000;

app.get('/kuy', (req, res) => {
    res.status(200).send('Hello World');
})

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
});