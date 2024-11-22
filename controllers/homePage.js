require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require("path");

exports.getHomePage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'homePage.html'));
};