const { User } = require('../models');
// INI UNTUK PAKAI RAW QUERY
// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('cobanode', 'postgres', 'sa', {
//     dialect: 'postgres',
// });
  
class UserController {
    static async get (req, res) {
        try {
            // INI UNTUK PAKAI RAW QUERY
            // const users = await sequelize.query(`INSERT INTO "Users" ("name", "email", "password", "createdAt", "updatedAt") values ('Far', 'far@gmail.com', 'far', NOW(), NOW())`);
            const users = await User.findAll();
            res.status(200).json({
                message: 'Success',
                data: users,
            });    
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error'
            })
        }
    };

    static async getdetail (req, res) {
        try {
            const paramsId = req.params.id;
            const user = await User.findOne({
                where: {
                    id: paramsId,
                }                
            })
            
            // VALIDASI
            if (!user) {
                res.status(404).json({
                    message: 'User not found',
                })
            };

            res.status(200).json({
                message: 'User found',
                data: user
            });
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error'
            })
        }
    }

    static async postTestInsert (req, res) {
        try{
            
            const newUser = await User.create({
                name: "test" ,
                email : "test@test.com",
                password : "test",
                createdAt : new Date,
                updatedAt : new Date,
            })
            if(newUser){
                return res.json({message:"User created successfully",data:newUser})
            }
        
        }catch(errors){
            console.log(errors);
            res.status(400).json({
                ok: false,
                errors
            });
        }
    }

    static async postInsert() {
        // username must be an email
        body('email').isEmail(),
        // password must be at least 5 chars long
        body('password').isLength({ min: 5 }),
        (req, res) => {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }
            console.log("sukses sampe sini");
            console.log(res);
            User.create({
                name: req.body.name ,
                email : req.body.email,
                password : req.body.password,
                createdAt : new Date,
                updatedAt : new Date,
            }).then(user => res.json(user));
        }
    }

};

module.exports = UserController;
