const { createHmac, randomUUID, timingSafeEqual } = require("node:crypto");

const {
  availability,
  candidateProfile,
  experience,
  experienceNewestFirst,
  projects,
  resume,
  resumePdf,
} = require("./data");

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const AUTH_TOKEN_PREFIX = "cpat";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function sendEmailNotification(payload) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EMAIL_NOT_CONFIGURED");
  }

  let response;

  try {
    response = await fetch(EMAILJS_ENDPOINT, {
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
  } catch (error) {
    const emailError = new Error("EMAIL_SEND_FAILED");
    emailError.details = error.message;
    throw emailError;
  }

  if (!response.ok) {
    const errorText = await response.text();
    const emailError = new Error("EMAIL_SEND_FAILED");
    emailError.details = errorText;
    throw emailError;
  }
}

function createResponse(statusCode, body = "", extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      ...extraHeaders,
    },
    body,
  };
}

function jsonResponse(statusCode, payload, extraHeaders = {}) {
  return createResponse(
    statusCode,
    JSON.stringify(payload, null, 2),
    {
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  );
}

function errorResponse(statusCode, code, message, extraHeaders = {}) {
  return jsonResponse(statusCode, {
    error: {
      code,
      message,
    },
  }, extraHeaders);
}

function unauthorizedResponse() {
  return errorResponse(
    401,
    "UNAUTHORIZED",
    "A valid bearer token is required",
    {
      "WWW-Authenticate": 'Bearer realm="candidate-profile-api"',
    },
  );
}

function normalizeHeaders(headers) {
  const normalizedHeaders = {};

  for (const [key, value] of Object.entries(headers || {})) {
    normalizedHeaders[key.toLowerCase()] = value;
  }

  return normalizedHeaders;
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

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function isValidEmail(email) {
  return EMAIL_PATTERN.test(email);
}

function parseJsonBody(body) {
  if (body === undefined || body === null || body === "") {
    return {};
  }

  if (typeof body === "object") {
    return body;
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error("INVALID_JSON");
  }
}

function validateContactRequest(payload) {
  const requiredFields = ["name", "email", "company", "message"];

  for (const field of requiredFields) {
    if (typeof payload[field] !== "string" || payload[field].trim() === "") {
      return `${field} is required`;
    }
  }

  if (!isValidEmail(normalizeEmail(payload.email))) {
    return "email must be a valid email address";
  }

  return null;
}

function validateAuthTokenRequest(payload) {
  if (typeof payload.email !== "string" || payload.email.trim() === "") {
    return "email is required";
  }

  if (!isValidEmail(normalizeEmail(payload.email))) {
    return "email must be a valid email address";
  }

  return null;
}

function getAuthTokenSecret() {
  const secret = process.env.AUTH_TOKEN_SECRET;

  if (!secret) {
    throw new Error("AUTH_NOT_CONFIGURED");
  }

  return secret;
}

function createTokenSignature(email) {
  return createHmac("sha256", getAuthTokenSecret())
    .update(email)
    .digest();
}

function createAccessToken(email) {
  const normalizedEmail = normalizeEmail(email);
  const encodedEmail = Buffer.from(normalizedEmail, "utf8").toString("base64url");
  const signature = createTokenSignature(normalizedEmail).toString("hex");

  return `${AUTH_TOKEN_PREFIX}_${encodedEmail}.${signature}`;
}

function getBearerToken(headers) {
  if (typeof headers.authorization !== "string") {
    return null;
  }

  const parts = headers.authorization.trim().split(/\s+/);

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}

function verifyAccessToken(token) {
  if (typeof token !== "string") {
    return null;
  }

  const prefix = `${AUTH_TOKEN_PREFIX}_`;
  if (!token.startsWith(prefix)) {
    return null;
  }

  const tokenBody = token.slice(prefix.length);
  const separatorIndex = tokenBody.indexOf(".");

  if (separatorIndex === -1) {
    return null;
  }

  const encodedEmail = tokenBody.slice(0, separatorIndex);
  const signatureHex = tokenBody.slice(separatorIndex + 1);

  if (!encodedEmail || !signatureHex || !/^[0-9a-f]+$/i.test(signatureHex)) {
    return null;
  }

  try {
    const email = Buffer.from(encodedEmail, "base64url").toString("utf8");
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return null;
    }

    const providedSignature = Buffer.from(signatureHex, "hex");
    const expectedSignature = createTokenSignature(normalizedEmail);

    if (providedSignature.length !== expectedSignature.length) {
      return null;
    }

    if (!timingSafeEqual(providedSignature, expectedSignature)) {
      return null;
    }

    return { email: normalizedEmail };
  } catch {
    return null;
  }
}

function buildAuthRequestPayload(email) {
  return {
    name: "Auth request",
    email,
    company: "Candidate Profile API",
    message: "Requested a demo bearer token for the Candidate Profile API.",
  };
}

function requiresAuth(method, pathname) {
  if (method === "GET") {
    return (
      pathname === "/candidate" ||
      pathname === "/experience" ||
      pathname.startsWith("/experience/") ||
      pathname === "/projects" ||
      pathname.startsWith("/projects/") ||
      pathname === "/contact/availability" ||
      pathname === "/resume"
    );
  }

  return method === "POST" && pathname === "/contact";
}

async function handleRequest({ method, url, headers = {}, body = "" }) {
  try {
    const normalizedHeaders = normalizeHeaders(headers);
    const requestUrl = new URL(url, `http://${normalizedHeaders.host || "localhost"}`);
    const pathname = normalizePath(requestUrl.pathname);

    if (method === "OPTIONS") {
      return createResponse(204);
    }

    if (requiresAuth(method, pathname)) {
      try {
        const token = getBearerToken(normalizedHeaders);
        const authContext = verifyAccessToken(token);

        if (!authContext) {
          return unauthorizedResponse();
        }
      } catch (error) {
        if (error.message === "AUTH_NOT_CONFIGURED") {
          return errorResponse(
            500,
            "CONFIGURATION_ERROR",
            "Auth token signing is not configured on the server",
          );
        }

        return errorResponse(500, "INTERNAL_SERVER_ERROR", "Unexpected server error");
      }
    }

    if (method === "POST" && pathname === "/auth/token") {
      try {
        const payload = parseJsonBody(body);
        const validationError = validateAuthTokenRequest(payload);

        if (validationError) {
          return errorResponse(400, "BAD_REQUEST", validationError);
        }

        const email = normalizeEmail(payload.email);
        await sendEmailNotification(buildAuthRequestPayload(email));

        return jsonResponse(200, {
          access_token: createAccessToken(email),
          token_type: "Bearer",
        });
      } catch (error) {
        if (error.message === "INVALID_JSON") {
          return errorResponse(400, "BAD_REQUEST", "Invalid request body");
        }

        if (error.message === "EMAIL_NOT_CONFIGURED") {
          return errorResponse(
            500,
            "CONFIGURATION_ERROR",
            "Email notifications are not configured on the server",
          );
        }

        if (error.message === "AUTH_NOT_CONFIGURED") {
          return errorResponse(
            500,
            "CONFIGURATION_ERROR",
            "Auth token signing is not configured on the server",
          );
        }

        if (error.message === "EMAIL_SEND_FAILED") {
          process.stderr.write(`EmailJS send failed: ${error.details || "Unknown error"}\n`);
          return errorResponse(
            502,
            "EMAIL_SEND_FAILED",
            "Unable to send email notification",
          );
        }

        return errorResponse(500, "INTERNAL_SERVER_ERROR", "Unexpected server error");
      }
    }

    if (method === "GET" && pathname === "/candidate") {
      return jsonResponse(200, candidateProfile);
    }

    if (method === "GET" && pathname === "/experience") {
      const currentQuery = parseBooleanQuery(requestUrl.searchParams.get("current"));
      if (currentQuery.value === "invalid") {
        return errorResponse(400, "BAD_REQUEST", "current must be true or false");
      }

      const response = currentQuery.provided
        ? experienceNewestFirst.filter((role) => role.current === currentQuery.value)
        : experienceNewestFirst;

      return jsonResponse(200, response);
    }

    if (method === "GET" && pathname.startsWith("/experience/")) {
      const id = pathname.split("/")[2];
      const role = experience.find((item) => item.id === id);

      if (!role) {
        return errorResponse(404, "NOT_FOUND", "Experience not found");
      }

      return jsonResponse(200, role);
    }

    if (method === "GET" && pathname === "/projects") {
      const summaries = projects.map(({ id, name, summary }) => ({
        id,
        name,
        summary,
      }));

      return jsonResponse(200, summaries);
    }

    if (method === "GET" && pathname.startsWith("/projects/")) {
      const id = pathname.split("/")[2];
      const project = projects.find((item) => item.id === id);

      if (!project) {
        return errorResponse(404, "NOT_FOUND", "Project not found");
      }

      return jsonResponse(200, project);
    }

    if (method === "GET" && pathname === "/contact/availability") {
      return jsonResponse(200, availability);
    }

    if (method === "GET" && pathname === "/resume") {
      const format = requestUrl.searchParams.get("format") || "json";

      if (format === "json") {
        return jsonResponse(200, resume);
      }

      if (format === "pdf") {
        return jsonResponse(200, resumePdf);
      }

      return errorResponse(400, "BAD_REQUEST", "format must be json or pdf");
    }

    if (method === "POST" && pathname === "/contact") {
      try {
        const payload = parseJsonBody(body);
        const validationError = validateContactRequest(payload);

        if (validationError) {
          return errorResponse(400, "BAD_REQUEST", validationError);
        }

        await sendEmailNotification(payload);

        const contactId = `contact_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
        return jsonResponse(201, {
          id: contactId,
          status: "received",
        });
      } catch (error) {
        if (error.message === "INVALID_JSON") {
          return errorResponse(400, "BAD_REQUEST", "Invalid request body");
        }

        if (error.message === "EMAIL_NOT_CONFIGURED") {
          return errorResponse(
            500,
            "CONFIGURATION_ERROR",
            "Email notifications are not configured on the server",
          );
        }

        if (error.message === "EMAIL_SEND_FAILED") {
          process.stderr.write(`EmailJS send failed: ${error.details || "Unknown error"}\n`);
          return errorResponse(
            502,
            "EMAIL_SEND_FAILED",
            "Unable to send email notification",
          );
        }

        return errorResponse(500, "INTERNAL_SERVER_ERROR", "Unexpected server error");
      }
    }

    return errorResponse(404, "NOT_FOUND", "Route not found");
  } catch (error) {
    process.stderr.write(`Unhandled request error: ${error.stack || error.message}\n`);
    return errorResponse(500, "INTERNAL_SERVER_ERROR", "Unexpected server error");
  }
}

module.exports = {
  handleRequest,
};
