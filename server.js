const mysql = require("mysql2");
const http = require("http");
const os = require("os");

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    res.end("OK");
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello from ${os.hostname()}\n`);
});

let connection;

function startServer() {
  connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "secret",
    database: "testdb"
  });

  connection.connect((err) => {
    if (err) {
      console.error("MySQL connection failed:", err.message);
      return;
    }

    console.log("Connected to MySQL! version 3");
  });

  server.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
  });
}

function shutdown() {
  console.log("SIGTERM received. Shutting down...");

  server.close(() => {
    console.log("HTTP server closed.");

    if (connection) {
      connection.end((err) => {
        if (err) {
          console.error("MySQL connection close failed:", err.message);
          process.exit(1);
        }

        console.log("MySQL connection closed.");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
}

if (require.main === module) {
  startServer();
  process.on("SIGTERM", shutdown);
}

module.exports = { server };