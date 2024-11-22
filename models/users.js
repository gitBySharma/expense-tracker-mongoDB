const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isPremiumUser: {
        type: Boolean,
        default: false
    },
    totalExpense: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("User", UserSchema);

// const Sequelize = require("sequelize");

// const sequelize = require("../util/database.js");
// const { type } = require("os");

// const Users = sequelize.define("users", {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true
//     },
//     password: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     isPremiumUser: {
//         type: Sequelize.BOOLEAN,
//     },
//     totalExpense: {
//         type: Sequelize.DOUBLE
//     }
// });

// module.exports = Users;