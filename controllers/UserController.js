const express = require('express');
const { User, Post } = require('../models');
const { updateOrCreate } = require('../helper/helper.js');
const bcrypts = require('bcryptjs')
// INI UNTUK PAKAI RAW QUERY
// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('cobanode', 'postgres', 'sa', {
//     dialect: 'postgres',
// });
  
class UserController {

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
        async (req, res) => {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }
            console.log("sukses sampe sini");
            console.log(res);
            const hashedpassword = await bcrypts.hash(req.body.password, 10)
            User.create({
                name: req.body.name ,
                email : req.body.email,
                password : hashedpassword,
                createdAt : new Date,
                updatedAt : new Date,
            }).then(user => res.json(user));
        }
    }

    static async postUpdate(req, res) {
        try{
            const userUpdated = await User.update(
                { name: 'test update' },
                { where: { id: 4 } }
              )
            if(userUpdated){
                return res.json({message:"User updated successfully",data:userUpdated})
            }
        }catch(errors){
            console.log(errors);
            res.status(400).json({
                ok: false,
                errors
            });
        }
    };

    static async postUpdateWithBody(req, res) {
        try{
            const atas = await updateOrCreate(User, {id: req.body.id ?? 0}, {name: req.body.name, email: req.body.email, password: req.body.password});
            // .then(function(result) {
            //     result.item;  // the model
            //     result.created; // bool, if a new item was created.
            // });
            res.status(200).json({
                message: 'Success',
                created: atas.created,
            });    
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                messageDetail: error,
            })
        }
    };

    // static async postDinamicUpsert(req, res) {
    //     try{
    //         // console.log(abc());
    //         var a;
    //         // console.log(req.body.tableName);
    //         if (req.body.tableName === "User") {
    //             a = User
    //         }
    //         const atas = await updateOrCreate(a, req.body.tableUnique, req.body.details);
    //         res.status(200).json({
    //             message: 'Success',
    //             created: atas.created,
    //         });    
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({
    //             message: 'Internal Server Error',
    //             messageDetail: error,
    //         })
    //     }
    // };

};

module.exports = UserController;
