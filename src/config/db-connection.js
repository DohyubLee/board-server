/**
 * @fileoverview setting connection information of mysql
 */
const ENV = require('./environment');
var mysql = require('mysql');
/**
 * Connection info of mysql
 * @typedef mysqlConnection
 * @property {string} host - connection host name
 * @property {string} user - connection user name
 * @property {string} password - connection password
 * @property {string} database - connection default schema
 * @property {number} port - connection port
 */
/**
 * @type {mysqlConnection}
 */
const mysqlConnection = {
    host: ENV.dbServer,
    user: ENV.dbUser,
    password: ENV.dbPassword,
    database: ENV.dbUseSchema,
    port: 3306
}

module.exports = mysql.createPool(mysqlConnection);
