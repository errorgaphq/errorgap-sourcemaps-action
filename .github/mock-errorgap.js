// A stand-in for an Errorgap instance, for CI: accepts every request and logs
// one JSON line per request to the file named on the command line.
const http = require("node:http");
const fs = require("node:fs");

const log = process.argv[2] || "requests.log";

http
  .createServer((req, res) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const body = Buffer.concat(chunks);
      fs.appendFileSync(
        log,
        JSON.stringify({
          method: req.method,
          url: req.url,
          key: req.headers["x-errorgap-upload-key"] || req.headers["x-errorgap-project-key"] || "",
          size: body.length,
          body: body.length < 4096 ? body.toString("utf8") : "",
        }) + "\n",
      );
      res.statusCode = req.method === "POST" ? 201 : 200;
      res.setHeader("content-type", "application/json");
      res.end("{}");
    });
  })
  .listen(8787, "127.0.0.1", () => console.log("mock errorgap on 127.0.0.1:8787"));
