# Candidate Profile API

Candidate APIs as a resume. Deployed with Render.

## Run locally

```bash
npm start
```

The API listens on `http://localhost:3000`.

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
- `GET /availability`
- `GET /resume?format=json|pdf`
- `POST /contact`
