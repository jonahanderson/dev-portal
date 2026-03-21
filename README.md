# Candidate Profile API

Candidate APIs as a resume. Can run locally, on App Runner, or on AWS Lambda.

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

## Deployment notes

For this specific project, Lambda is a good fit:

- The API is stateless and reads mostly in-memory data.
- Traffic is likely bursty and low-volume, so pay-per-request is usually cheaper than keeping a container warm.
- There are no websockets, background workers, or long-running requests that would push you toward App Runner.

App Runner is still fine if you want a traditional always-on Node server and easier container-style debugging. Lambda is usually the better default here if you want lower cost and simpler scaling.

## Deploy To AWS Lambda

This repo includes:

- Shared request handling in `src/app.js`
- Lambda entrypoint in `src/lambda.js`
- AWS SAM template in `template.yaml`

### 1. Install the AWS SAM CLI

Follow AWS's install steps for your machine, then verify:

```bash
sam --version
```

### 2. Build the Lambda package

```bash
sam build
```

### 3. Deploy it

Replace the parameter values below with your real secrets:

```bash
sam deploy --guided \
  --parameter-overrides \
    AuthTokenSecret=replace_with_a_long_random_string \
    EmailJsServiceId=your_service_id \
    EmailJsTemplateId=your_template_id \
    EmailJsPublicKey=your_public_key \
    EmailJsPrivateKey=your_private_key
```

`sam deploy --guided` will help you create the stack, pick a region, and save those answers into `samconfig.toml` for future deploys.

### 4. Use the output URL

After deploy, AWS will print an `ApiUrl` output. Your endpoints will be available at paths like:

```text
GET  https://your-api-url/candidate
POST https://your-api-url/auth/token
```

### 5. Optional custom domain

If you want the API on your own domain, attach a custom domain to the API Gateway HTTP API that SAM creates.

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
- Shared request handler: `src/app.js`
- Lambda handler: `src/lambda.js`
- AWS SAM template: `template.yaml`
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
