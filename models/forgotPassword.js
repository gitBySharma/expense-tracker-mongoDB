const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const forgotPasswordRequestsSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    active: {
        type: Boolean
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model("ForgotPasswordRequest", forgotPasswordRequestsSchema);

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const ForgotPassword = sequelize.define('forgotPasswordRequests', {
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true,
//     },
//     active: Sequelize.BOOLEAN
// });

// module.exports = ForgotPassword;