# Candidate Profile API

Candidate APIs as a resume. Deployed with Render.

## Run locally

```bash
npm start
```

The API listens on `http://localhost:3000`.

All endpoints except `POST /auth/token` require a bearer token from `POST /auth/token`.

For `POST /auth/token` and `POST /contact` to send email via EmailJS, set these environment variables before starting the server:

```bash
export AUTH_TOKEN_SECRET=replace_with_a_long_random_string
export EMAILJS_SERVICE_ID=your_service_id
export EMAILJS_TEMPLATE_ID=your_template_id
export EMAILJS_PUBLIC_KEY=your_public_key
export EMAILJS_PRIVATE_KEY=your_private_key # optional, recommended for server-side use
```

## Auth flow

1. Request a demo token:

```bash
curl -X POST http://localhost:3000/auth/token \
  -H "Content-Type: application/json" \
  -d '{"email":"recruiter@example.com"}'
```

2. Use the returned bearer token on protected endpoints:

```bash
curl http://localhost:3000/candidate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Included artifacts

- Local API server: `src/server.js`
- Seed data: `src/data.js`
- OpenAPI spec: `openapi/candidate-profile-api.yaml`
- Postman collection: `postman/Candidate Profile API.postman_collection.json`

## Available endpoints

- `POST /auth/token`
- `GET /candidate`
- `GET /experience`
- `GET /experience/:id`
- `GET /projects`
- `GET /projects/:id`
- `GET /contact/availability`
- `GET /resume?format=json|pdf`
- `POST /contact`
