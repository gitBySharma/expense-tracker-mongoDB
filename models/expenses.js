const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    expenseAmount: {
        type: Number,
        required: true
    },
    expenseCategory: {
        type: String,
        required: true
    },
    expenseDescription: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model("Expense", ExpenseSchema);

// const Sequelize = require("sequelize");

// const sequelize = require("../util/database");

// const Expense = sequelize.define("expenseDetails", {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true
//     },
//     expenseAmount: {
//         type: Sequelize.INTEGER,
//         allowNull: false
//     },
//     expenseCategory: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     expenseDescription: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

// module.exports = Expense;