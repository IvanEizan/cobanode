const express = require('express');
const cors = require('cors');
const bcrypts = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express();
// const port = 3000;
const port = process.env.PORT_MAIN || 8080;

const { User } = require('./models');
const MainController = require('./controllers/MainController.js')
const UserController = require('./controllers/UserController')
const { body, validationResult } = require('express-validator');

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
app.post('/postusers', UserController.postInsert);
app.post(
    '/postusersvalidated', 
    // password must be at least 4 chars long
    body('name').isLength({ min: 4 }).withMessage('must be at least 4 chars longmust be in e-mail format'),
    // username must be an email
    body('email').isEmail().withMessage('username must be an email'),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }).withMessage('must be at least 5 chars longmust be in e-mail format'),
    async (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const hashedpassword = await bcrypts.hash(req.body.password, 10)

        User.create({
            name: req.body.name ,
            email : req.body.email,
            password : hashedpassword,
            createdAt : new Date,
            updatedAt : new Date,
        }).then(user => res.json(user));
    }
);
app.post('/postupdateusers', UserController.postUpdate);
app.post('/postupsertusers', UserController.postUpdateWithBody);
app.post('/postLogin', MainController.postLogin);
app.get('/checkToken', MainController.checkToken);

// dinamic query here
app.get('/getDinamics', MainController.getDinamic);
app.post('/postDinamicUpsert', MainController.postDinamicUpsert);
app.post('/postTest', authenticateToken, (req, res) => {
    res.json(req.payload)
});

function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, payload) => {
            if(err) return res.sendStatus(403)
            req.payload = payload
            next()
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            messageDetail: error,
        })
    }
}

app.listen(port, () => {
    console.log('Server is Running. Port = ' + port);
});
