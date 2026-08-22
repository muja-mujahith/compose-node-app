const mysql = require("mysql2");
const http = require("http");
const os = require('os');

const connection = mysql.createConnection({
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


const server = http.createServer((req, res) => {

  // if (req.url === "/health-broken") {
  //   // res.writeHead(200, { "Content-Type": "text/plain" });
  //   // res.end("OK");
  //   res.writeHead(500);
  //   res.end('not ok');
  //   return;
  // }

  if (req.url === "/health") {
  res.writeHead(200);
  res.end("OK");
  return;
}

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello from ${os.hostname()}\n`);
});


// server.listen(3000, "0.0.0.0", () => {
//   console.log("Server running on port 3000");
// });

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");

  server.close(() => {
    console.log("HTTP server closed.");

    connection.end((err) => {
      if (err) {
        console.error("MySQL connection close failed:", err.message);
        process.exit(1);
      }

      console.log("MySQL connection closed.");
      process.exit(0);
    });
  });
});