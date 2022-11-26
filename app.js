const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const UserController = require('./controllers/UserController')

app.use(cors());
app.use(express.json());
app.use('/', express.urlencoded({
    extended: false, // INTINYA GAK BISA NERIMA ARRAY DI DALEM OBJECT KALO DI FALSE
}));

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello World from GET',
    });
});

app.get('/users', UserController.get);
app.get('/users/:id', UserController.getdetail);

app.listen(port, () => {
    console.log('Server is Running');
});