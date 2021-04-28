const pg = require('pg');

// 数据库配置
const config = {
  database:"todolist_development",
  port:5432,
  host:'postgres'
}
// 创建连接池
const db = new pg.Pool(config);

module.exports = db;
