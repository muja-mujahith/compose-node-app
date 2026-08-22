const test = require("node:test");
const assert = require("node:assert");
const http = require("http");

const { server } = require("../server");

test("GET /health returns 200 OK", async () => {
  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const port = server.address().port;

  const response = await new Promise((resolve, reject) => {
    const request = http.get(
      `http://127.0.0.1:${port}/health`,
      (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            body
          });
        });
      }
    );

    request.on("error", reject);
  });

  assert.strictEqual(response.statusCode, 200);
  assert.strictEqual(response.body, "OK");

  await new Promise((resolve) => {
    server.close(resolve);
  });
});