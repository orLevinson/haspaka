import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

let isPoolClosed = false;

const closePool = async () => {
  if (!isPoolClosed) {
    isPoolClosed = true;
    console.log("Attempting to close pool connection");
    pool
      .end()
      .then(() => {
        console.log("Connection pool closed");
        process.exit(1);
      })
      .catch((err: Error) =>
        console.error("Error closing connection pool:", err)
      );
  }
};

process.on("uncaughtException", async (err) => {
  console.error("Encountered error", err);
  await closePool();
});

export default pool;
