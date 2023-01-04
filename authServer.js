const express = require('express');
const cors = require('cors');
const bcrypts = require('bcryptjs')
const { User } = require('./models');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express();
const port = process.env.PORT_AUTH || 8081;

app.use(cors());
app.use(express.json());
app.use('/', express.urlencoded({
    extended: false, // INTINYA GAK BISA NERIMA ARRAY DI DALEM OBJECT KALO DI FALSE
}));

app.post('/postLogin', async (req, res) => {
    try {
        const { email, password } = req.body
        if (email && password) {
            const user = await User.findOne({ where: { email: email } })
            if (user) {
              const isValidPass = bcrypts.compareSync(password, user.password)
              console.log(password, user.password);
              console.log(isValidPass);
              if (isValidPass) {
                const payload = {
                  email: user.email
                }
                const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET_KEY)
                res.status(200).json({
                    message: "Allowed",
                    access_token: accessToken
                })
              } else {
                throw ({
                  name: 'Invalid Username or Password'
                })
              }
            } else {
              throw ({
                name: 'Invalid Username or Password'
              })
            }
        } else {
            throw ({
                name: 'Invalid Username or Password'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            messageDetail: error,
        })
    }
});

// app.post('/postTest', authenticateToken, (req, res) => {
//     res.json(req.payload)
// });

// function authenticateToken(req, res, next) {
//     try {
//         const authHeader = req.headers['authorization']
//         const token = authHeader && authHeader.split(' ')[1]
//         if (token == null) return res.sendStatus(401)

//         jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, payload) => {
//             if(err) return res.sendStatus(403)
//             req.payload = payload
//             next()
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: 'Internal Server Error',
//             messageDetail: error,
//         })
//     }
// }

app.listen(port, () => {
    console.log('Server is Running. Port = ' + port);
});
