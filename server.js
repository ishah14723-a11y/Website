const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 10000;
const HOST = "0.0.0.0";
const htmlPath = path.join(__dirname, "index.html");

const server = http.createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    return res.end("ok");
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    return res.end("Method Not Allowed");
  }

  fs.readFile(htmlPath, (error, content) => {
    if (error) {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      return res.end("Unable to load the website.");
    }
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "content-length": content.length,
      "cache-control": "no-cache"
    });
    res.end(req.method === "HEAD" ? undefined : content);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Website listening on http://${HOST}:${PORT}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
