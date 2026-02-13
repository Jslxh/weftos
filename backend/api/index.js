const app = require("../app");
const connectDB = require("../config/db");

// Establish DB connection before handling requests
connectDB();

module.exports = app;
