const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

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
app.get('/getDinamics', UserController.getDinamic);
app.post('/postusers', UserController.postInsert);
app.post(
    '/postusersvalidated', 
    // password must be at least 4 chars long
    body('name').isLength({ min: 4 }).withMessage('must be at least 4 chars longmust be in e-mail format'),
    // username must be an email
    body('email').isEmail().withMessage('username must be an email'),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }).withMessage('must be at least 5 chars longmust be in e-mail format'),
    (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        
        User.create({
            name: req.body.name ,
            email : req.body.email,
            password : req.body.password,
            createdAt : new Date,
            updatedAt : new Date,
        }).then(user => res.json(user));
    }
);
app.post('/postupdateusers', UserController.postUpdate);
app.post('/postupsertusers', UserController.postUpdateWithBody);
app.post('/postDinamicUpsert', UserController.postDinamicUpsert);

app.listen(port, () => {
    console.log(' Server is Running');
});
