// backend/testMySQL.js
import pool from "./config/mysqlConfig.js";

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Kết nối MySQL thành công!");
    connection.release();
  } catch (error) {
    console.error("Lỗi kết nối MySQL:", error);
  }
};

testConnection();
