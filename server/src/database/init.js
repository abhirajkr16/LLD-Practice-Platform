const fs = require("fs");
const path = require("path");

const db = require("./connection");

const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");

db.exec(schema);

console.log("Database schema initialized.");

module.exports = db;
