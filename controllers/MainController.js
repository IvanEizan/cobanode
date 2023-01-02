const express = require('express');
const { User, Post } = require('../models');
const { updateOrCreate, comparePassword, createToken } = require('../helper/helper.js');

class MainController {
    
    static async getDinamic (req, res) {
        try {
            let modelName;
            //untuk set modelnya agar tidak string
            if (req.body.tableName === "User") {
                modelName = User
            }
            else if (req.body.tableName === "Post") {
                modelName = Post
            }
            const users = await modelName.findAll({
                attributes: req.body.tableSelect,
                where: req.body.tableFilter
            });
            res.status(200).json({
                message: 'Success',
                data: users,
            });    
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                messageDetail: error,
            })
        }
    };

    static async postDinamicUpsert(req, res) {
        try{
            // console.log(abc());
            var a;
            // console.log(req.body.tableName);
            if (req.body.tableName === "User") {
                a = User
            }
            else if (req.body.tableName === "Post") {
                a = Post
            }
            
            const atas = await updateOrCreate(a, req.body.tableFilter, req.body.details);
            res.status(200).json({
                message: 'Success',
                created: atas.created,
            });    
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Internal Server Error',
                messageDetail: error,
            })
        }
    };

    static async postLogin (req, res) {
        try {
            const { email, password } = req.body
            if (email && password) {
                const user = await User.findOne({ where: { email: email } })
                if (user) {
                  const isValidPass = comparePassword(password, user.password)
                  console.log(password, user.password);
                  console.log(isValidPass);
                  if (isValidPass) {
                    const payload = {
                      email: user.email
                    }
                    res.status(200).json({
                        message: "Allowed",
                        access_token: createToken(payload)
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
    };

}

module.exports = MainController;