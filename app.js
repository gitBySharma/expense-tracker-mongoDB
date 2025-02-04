const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const router = require("router");
const mongoose = require("mongoose");

require('dotenv').config();


const User = require("./models/users.js");
const Expense = require("./models/expenses.js");
const Premium = require("./models/premiumMembership.js");
const ForgotPassword = require('./models/forgotPassword.js');
const DownloadUrls = require('./models/DownloadUrls.js');

const userRoutes = require("./routes/user.js");
const expenseRoutes = require("./routes/expense.js");
const premiumFeatureRoutes = require("./routes/premiumFeature.js");
const homePageRoutes = require("./routes/homePage.js");

const { FilesApi } = require("sib-api-v3-sdk");


const app = express();

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



app.use(userRoutes);
app.use(expenseRoutes);
app.use(premiumFeatureRoutes);
app.use(homePageRoutes);


// database relations
// User.hasMany(Expense, { foreignKey: 'userId' });
// Expense.belongsTo(User, { foreignKey: 'userId' });

// User.hasMany(Premium);
// Premium.belongsTo(User);

// User.hasMany(ForgotPassword);
// ForgotPassword.belongsTo(User);

// User.hasMany(DownloadUrls);
// DownloadUrls.belongsTo(User);



mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then((result) => {
        console.log("Connected to mongoDB");
        app.listen(process.env.PORT);
        console.log(`Server is live in port ${process.env.PORT}`);
    }).catch(error => {
        console.log(error);
    })

// sequelize.sync()
//     .then((result) => {
//         app.listen(process.env.PORT);
//         console.log(`Server is live in port ${process.env.PORT}`);
//     }).catch((err) => {
//         console.log(err);
//     });