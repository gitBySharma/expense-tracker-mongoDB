const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DownloadUrlSchema = new Schema({
    fileUrl: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("DownloadUrl", DownloadUrlSchema);

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const DownloadUrls = sequelize.define("downloadUrls", {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true
//     },
//     fileUrl: {
//         type: Sequelize.STRING,
//     }
// });

// module.exports = DownloadUrls;