const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const premiumMembershipSchema = new Schema({
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
        required: true
    },
    status: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model("Premium", premiumMembershipSchema);

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database.js");



// const Premium = sequelize.define('premium', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     paymentId: Sequelize.STRING,
//     orderId: Sequelize.STRING,
//     status: Sequelize.STRING
// });

// module.exports = Premium;