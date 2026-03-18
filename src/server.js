const http = require("node:http");
const { randomUUID } = require("node:crypto");

const {
  availability,
  candidateProfile,
  experience,
  experienceNewestFirst,
  projects,
  resume,
  resumePdf,
} = require("./data");

const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

async function sendContactEmail(payload) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EMAIL_NOT_CONFIGURED");
  }

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      ...(privateKey ? { accessToken: privateKey } : {}),
      template_params: {
        name: payload.name,
        email: payload.email,
        company: payload.company,
        message: payload.message,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const emailError = new Error("EMAIL_SEND_FAILED");
    emailError.details = errorText;
    throw emailError;
  }
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);

  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  res.end(body);
}

function sendError(res, statusCode, code, message) {
  sendJson(res, statusCode, {
    error: {
      code,
      message,
    },
  });
}

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function parseBooleanQuery(value) {
  if (value === null) {
    return { provided: false, value: null };
  }

  if (value === "true") {
    return { provided: true, value: true };
  }

  if (value === "false") {
    return { provided: true, value: false };
  }

  return { provided: true, value: "invalid" };
}

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
    });

    req.on("end", () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(new Error("INVALID_JSON"));
      }
    });

    req.on("error", () => {
      reject(new Error("REQUEST_STREAM_ERROR"));
    });
  });
}

function validateContactRequest(payload) {
  const requiredFields = ["name", "email", "company", "message"];

  for (const field of requiredFields) {
    if (typeof payload[field] !== "string" || payload[field].trim() === "") {
      return `${field} is required`;
    }
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(payload.email)) {
    return "email must be a valid email address";
  }

  return null;
}

function routeRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = normalizePath(url.pathname);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && pathname === "/candidate") {
    sendJson(res, 200, candidateProfile);
    return;
  }

  if (req.method === "GET" && pathname === "/experience") {
    const currentQuery = parseBooleanQuery(url.searchParams.get("current"));
    if (currentQuery.value === "invalid") {
      sendError(res, 400, "BAD_REQUEST", "current must be true or false");
      return;
    }

    const response = currentQuery.provided
      ? experienceNewestFirst.filter((role) => role.current === currentQuery.value)
      : experienceNewestFirst;

    sendJson(res, 200, response);
    return;
  }

  if (req.method === "GET" && pathname.startsWith("/experience/")) {
    const id = pathname.split("/")[2];
    const role = experience.find((item) => item.id === id);

    if (!role) {
      sendError(res, 404, "NOT_FOUND", "Experience not found");
      return;
    }

    sendJson(res, 200, role);
    return;
  }

  if (req.method === "GET" && pathname === "/projects") {
    const summaries = projects.map(({ id, name, summary }) => ({
      id,
      name,
      summary,
    }));

    sendJson(res, 200, summaries);
    return;
  }

  if (req.method === "GET" && pathname.startsWith("/projects/")) {
    const id = pathname.split("/")[2];
    const project = projects.find((item) => item.id === id);

    if (!project) {
      sendError(res, 404, "NOT_FOUND", "Project not found");
      return;
    }

    sendJson(res, 200, project);
    return;
  }

  if (req.method === "GET" && pathname === "/contact/availability") {
    sendJson(res, 200, availability);
    return;
  }

  if (req.method === "GET" && pathname === "/resume") {
    const format = url.searchParams.get("format") || "json";

    if (format === "json") {
      sendJson(res, 200, resume);
      return;
    }

    if (format === "pdf") {
      sendJson(res, 200, resumePdf);
      return;
    }

    sendError(res, 400, "BAD_REQUEST", "format must be json or pdf");
    return;
  }

  if (req.method === "POST" && pathname === "/contact") {
    readJsonBody(req)
      .then(async (payload) => {
        const validationError = validateContactRequest(payload);

        if (validationError) {
          sendError(res, 400, "BAD_REQUEST", validationError);
          return;
        }

        await sendContactEmail(payload);

        const contactId = `contact_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
        sendJson(res, 201, {
          id: contactId,
          status: "received",
        });
      })
      .catch((error) => {
        if (error.message === "INVALID_JSON") {
          sendError(res, 400, "BAD_REQUEST", "Invalid request body");
          return;
        }

        if (error.message === "EMAIL_NOT_CONFIGURED") {
          sendError(
            res,
            500,
            "CONFIGURATION_ERROR",
            "Contact email is not configured on the server",
          );
          return;
        }

        if (error.message === "EMAIL_SEND_FAILED") {
          process.stderr.write(`EmailJS send failed: ${error.details || "Unknown error"}\n`);
          sendError(
            res,
            502,
            "EMAIL_SEND_FAILED",
            "Unable to send contact email",
          );
          return;
        }

        sendError(res, 500, "INTERNAL_SERVER_ERROR", "Unexpected server error");
      });
    return;
  }

  sendError(res, 404, "NOT_FOUND", "Route not found");
}

const server = http.createServer(routeRequest);

server.listen(PORT, () => {
  process.stdout.write(
    `Candidate Profile API listening on http://localhost:${PORT}\n`,
  );
});
