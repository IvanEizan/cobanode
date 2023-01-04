require('dotenv').config()

const bcrypts = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secret = 'babigendut'

function updateOrCreate (model, where, newItem) {
    // First try to find the record
    return model
    .findOne({where: where})
    .then(function (foundItem) {
        if (!foundItem) {
            // Item not found, create a new one
            return model
                .create(newItem)
                .then(function (item) { return  {item: item, created: true}; })
        }
         // Found an item, update it
        return model
            .update(newItem, {where: where})
            .then(function (item) { return {item: item, created: false} });
    });
};


function hashPassword (password) {
  const salt = bcrypts.genSaltSync(8)
  const hash = bcrypts.hashSync(password, salt)
  return hash
}

function comparePassword (passwordLogin, passwordDatabase) {
  return bcrypts.compareSync(passwordLogin, passwordDatabase)
}

function createToken (payload) {
  return jwt.sign(payload, process.env.TOKEN_SECRET_KEY)
}

function verifyToken (token) {
  jwt.verify(token, process.env.TOKEN_SECRET_KEY)
}

module.exports = {updateOrCreate, hashPassword, comparePassword, createToken, verifyToken}