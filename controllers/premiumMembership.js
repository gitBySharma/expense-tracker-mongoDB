const Razorpay = require('razorpay');
require('dotenv').config();

const Premium = require('../models/premiumMembership');
const Users = require('../models/users.js');
const Expense = require('../models/expenses.js');
const jwt = require('jsonwebtoken');
const AWS = require("aws-sdk");
const DownloadUrls = require('../models/DownloadUrls.js');



exports.purchasePremium = async (req, res, next) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, async (error, order) => {
            if (error) {
                console.log(error);
                return res.status(404).json({ message: "Failed to create order", error: error });
            }

            try {
                await Premium.create({
                    orderId: order.id,
                    status: "PENDING",
                    userId: req.user.id
                });

                return res.status(201).json({ order, key_id: rzp.key_id });

            } catch (error) {
                console.log(error);
                return res.status(404).json({ message: "Failed to create order in database", error: error });
            }
        });

    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Something went wrong", error: err });
    }
};



exports.updateTransactionStatus = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;

        const premiumMembership = await Premium.findOne({ orderId: order_id });

        if (premiumMembership) {

            if (payment_id === "payment_failed") {
                //update the status
                premiumMembership.status = "FAILED";
                await premiumMembership.save();

                return res.status(401).json({ success: false, message: "Payment failed" });

            } else {
                //update the paymentId and status
                premiumMembership.paymentId = payment_id;
                premiumMembership.status = "SUCCESSFUL";
                await premiumMembership.save();

                //make the user premium
                const user = await Users.findById(req.user.id);
                if (user) {
                    user.isPremiumUser = true;
                    await user.save();
                }

                return res.status(201).json({ success: true, message: "Transaction successful" });
            }

        } else {
            res.status(404).json({ success: false, message: "Premium membership not found" });

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
};



exports.showLeaderBoard = async (req, res, next) => {
    try {
        const leaderBoardData = await Users.find()
            .select("_id name totalExpense")
            .sort({ totalExpense: -1 });

        res.status(200).json({ success: true, leaderBoardData: leaderBoardData });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
};



async function uploadToS3(data, fileName) {
    const s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
        Bucket: "expense-tracker-mongodb"
    });

    var params = {
        Bucket: "expense-tracker-mongodb",
        Key: fileName,
        Body: data,
        ACL: "public-read"
    }

    try {
        const response = await s3bucket.upload(params).promise();   //.promise() returns a promise
        return response.Location;

    } catch (error) {
        console.log("Error", error);

    }
}


exports.downloadExpense = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id });
        const stringifiedExpenses = JSON.stringify(expenses);
        const fileName = `Expenses${req.user.id}/${new Date().toISOString()}.txt`;
        const fileUrl = await uploadToS3(stringifiedExpenses, fileName);

        await DownloadUrls.create({   //storing the history of downloads
            fileUrl: fileUrl,
            userId: req.user.id
        })
        res.status(201).json({ fileUrl, success: true });

    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ Error: "Something went wrong", success: false });
    }
};



exports.downloadHistory = async (req, res, next) => {
    try {
        const history = await DownloadUrls.find({ userId: req.user.id });
        if (history) {
            res.status(201).json({ history, success: true });

        } else {
            res.status(400).json({ Error: "No download history found" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Something went wrong", success: false });
    }
};