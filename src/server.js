const http = require("node:http");

const { handleRequest } = require("./app");

const PORT = Number.parseInt(process.env.PORT || "3000", 10);

async function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
    });

    req.on("end", () => {
      resolve(rawBody);
    });

    req.on("error", reject);
  });
}

function writeNodeResponse(res, response) {
  const body = response.body || "";

  res.writeHead(response.statusCode, {
    ...response.headers,
    "Content-Length": Buffer.byteLength(body),
  });

  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const body = req.method === "GET" || req.method === "OPTIONS"
    ? ""
    : await readRequestBody(req);

  const response = await handleRequest({
    method: req.method || "GET",
    url: req.url || "/",
    headers: req.headers,
    body,
  });

  writeNodeResponse(res, response);
});

server.listen(PORT, () => {
  process.stdout.write(
    `Candidate Profile API listening on http://localhost:${PORT}\n`,
  );
});
