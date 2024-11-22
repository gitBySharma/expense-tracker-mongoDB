const Expense = require("../models/expenses");
const Users = require('../models/users');

require('dotenv').config();


exports.postAddExpense = async (req, res, next) => {
    const { expenseAmount, expenseCategory, expenseDescription } = req.body;
    try {
        const data = await Expense.create({
            expenseAmount: expenseAmount,
            expenseCategory: expenseCategory,
            expenseDescription: expenseDescription,
            userId: req.user.id,
        });

        //updating the totalExpense for each user when a new expense is added
        const user = await Users.findById(req.user.id);
        let totalExpense = parseInt(user.totalExpense);
        if (isNaN(totalExpense)) {
            totalExpense = 0;
        }
        totalExpense += parseFloat(expenseAmount);

        await Users.findByIdAndUpdate(req.user.id, {
            totalExpense: totalExpense
        });

        res.status(200).json({ expenseDetails: data });

    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "Internal server error" });
    }
};


exports.getExpense = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const totalItems = await Expense.countDocuments({ userId: req.user.id });

        const expenses = await Expense.find({ userId: req.user.id })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
            expenses: expenses,
            isPremiumUser: req.user.isPremiumUser
        });

    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "Internal server error" });
    }
};


exports.deleteExpense = async (req, res, next) => {
    const expenseId = req.params.id;
    try {
        const expense = await Expense.findOne({ _id: expenseId, userId: req.user.id });
        if (expense) {

            await Expense.findByIdAndDelete(expenseId);
            res.status(200).json({ message: "Expense deleted successfully" });

            //updating the totalExpense when a expense is deleted
            const user = await Users.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const existingTotalExpense = parseFloat(user.totalExpense) || 0;
            const newTotalExpense = existingTotalExpense - (parseFloat(expense.expenseAmount));

            await Users.findByIdAndUpdate(req.user.id, {
                totalExpense: newTotalExpense
            });

        } else {
            res.status(404).json({ message: "Expense not found" });
        }

    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Internal server error" });
    }
};


exports.editExpense = async (req, res, next) => {
    const expenseId = req.params.id;
    const { expenseAmount, expenseCategory, expenseDescription } = req.body;
    try {
        const expense = await Expense.findOne({ _id: expenseId, userId: req.user.id });
        if (expense) {
            //calculating the difference between old and new expense amounts
            const oldExpenseAmount = parseFloat(expense.expenseAmount);
            const newExpenseAmount = parseFloat(expenseAmount);
            const expenseDifference = newExpenseAmount - oldExpenseAmount;

            expense.expenseAmount = expenseAmount;
            expense.expenseCategory = expenseCategory;
            expense.expenseDescription = expenseDescription;

            await expense.save();   //saving the updated expense

            //updating the totalExpense for the user
            const user = await Users.findById(req.user.id);
            let totalExpense = parseFloat(user.totalExpense) || 0;
            totalExpense += expenseDifference;

            user.totalExpense = totalExpense;
            await user.save();

            res.status(200).json({ updatedExpense: expense });

        } else {
            res.status(404).json({ error: "Expense not found" });

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};