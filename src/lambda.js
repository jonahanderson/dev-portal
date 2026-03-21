const { handleRequest } = require("./app");

function buildRequestUrl(event) {
  const path = event.rawPath || event.path || "/";

  if (typeof event.rawQueryString === "string" && event.rawQueryString.length > 0) {
    return `${path}?${event.rawQueryString}`;
  }

  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(event.queryStringParameters || {})) {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  }

  const queryString = queryParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

function getEventBody(event) {
  if (!event.body) {
    return "";
  }

  if (event.isBase64Encoded) {
    return Buffer.from(event.body, "base64").toString("utf8");
  }

  return event.body;
}

exports.handler = async (event) => (
  handleRequest({
    method: event.requestContext?.http?.method || event.httpMethod || "GET",
    url: buildRequestUrl(event),
    headers: event.headers || {},
    body: getEventBody(event),
  })
);
