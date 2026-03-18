# Candidate Profile API

Candidate APIs as a resume. Deployed with Render.

## Run locally

```bash
npm start
```

The API listens on `http://localhost:3000`.

For `POST /contact` to send email via EmailJS, set these environment variables before starting the server:

```bash
export EMAILJS_SERVICE_ID=your_service_id
export EMAILJS_TEMPLATE_ID=your_template_id
export EMAILJS_PUBLIC_KEY=your_public_key
export EMAILJS_PRIVATE_KEY=your_private_key # optional, recommended for server-side use
```

## Included artifacts

- Local API server: `src/server.js`
- Seed data: `src/data.js`
- OpenAPI spec: `openapi/candidate-profile-api.yaml`
- Postman collection: `postman/Candidate Profile API.postman_collection.json`

## Available endpoints

- `GET /candidate`
- `GET /experience`
- `GET /experience/:id`
- `GET /projects`
- `GET /projects/:id`
- `GET /contact/availability`
- `GET /resume?format=json|pdf`
- `POST /contact`
