const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expenses.js");
const userAuthentication = require("../middleware/auth.js");


//handle adding new expense
router.post('/expense/addExpense', userAuthentication.authenticate, expenseController.postAddExpense);

//handle retrieving existing expense
router.get('/expense/getExpense', userAuthentication.authenticate, expenseController.getExpense);

//handle deleting expense
router.delete('/expense/deleteExpense/:id', userAuthentication.authenticate, expenseController.deleteExpense);

//handle editing an existing expense
router.put('/expense/editExpense/:id', userAuthentication.authenticate, expenseController.editExpense);


module.exports = router;