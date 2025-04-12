// config/mysqlConfig.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root", // Username MySQL (mặc định là root)
  password: "", // Password MySQL (mặc định là rỗng)
  database: "prescripto_logs", // Tên database bạn vừa tạo
});

export default pool;
