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
};

module.exports = UserController;
