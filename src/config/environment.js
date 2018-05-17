
/**
 * @fileoverview API Server Environments setting
 * 적용 환경에 따른 Configuration
 */

/**
 * @type {boolean} 실행 환경
 */
const isProduction = process.argv[2] === 'production' ? true : false;

 /**
  * 실행 될 환경의 설정 사항
  * TODO: server의 환경에 대한 설정 사항들은 이 곳에 추가하여 확장 시킨다
  * @typedef environments
  * @property {number} port - server port
  * @property {string} dbServer - mysql server host
  * @property {string} dbUser - mysql server user
  * @property {string} dbPassword - mysql server password
  * @property {string} dbUseSchema - mysql server default schema
  */
 /**
  * @type {environments}
  */
const environments = {
    port: isProduction && '[production_server]' || 1337,
    dbServer: isProduction && '[production_server]' || 'localhost',
    dbUser: isProduction && '[production_server]' || 'root',
    dbPassword: isProduction && '[production_server]' || '2ehguq',
    dbUseSchema: isProduction && '[production_server]' || 'board'
};

module.exports = environments;
