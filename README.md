# express-di

Sample [Express](https://expressjs.com/) API that uses [Awilix](https://github.com/jeffijoe/awilix) for dependency injection. Intended as a learning reference for layered architecture and per-request DI scopes.

## Requirements

- [Node.js](https://nodejs.org/) **>= 20**
- npm (or compatible package manager)

## Setup

```bash
git clone git@github.com:hamzakhalidchouhdary/express-di.git
cd express-di
npm install
```

## Environment variables

Create a `.env` file in the project root (see `.gitignore`; do not commit secrets):

| Variable     | Description                                    |
|--------------|------------------------------------------------|
| `JWT_SECRET` | Secret used to sign and verify JWTs (required) |
| `PORT`       | HTTP port (optional; default **4000**)         |

Example:

```env
JWT_SECRET=your-development-secret
PORT=4000
```

Vitest loads `JWT_SECRET=test-secret` via `vitest.config.js` for tests.

## Scripts

| Command              | Description                        |
|----------------------|------------------------------------|
| `npm run dev`        | Start dev server with nodemon      |
| `npm test`           | Run tests once (Vitest)            |
| `npm run test:watch` | Run tests in watch mode            |
| `npm run app::build` | Build Docker image (`express-di`)  |
| `npm run app::run`   | Run container (see `package.json`) |

Entry point: `app/index.js` (loads `dotenv` and listens on `PORT`).

## API overview

All `/users` routes expect a **Bearer** token unless you change the middleware:

```http
Authorization: Bearer <jwt>
```

The JWT payload must include an `id` that exists in the in-memory user store. The server resolves the user, builds a role-specific domain object (admin vs guest), and injects it into the request-scoped DI container.

Base path for user routes: **`/users`**.

| Method | Path         | Description   |
|--------|--------------|---------------|
| GET    | `/users`     | List users    |
| GET    | `/users/me`  | Current user  |
| GET    | `/users/:id` | User by id    |
| POST   | `/users`     | Create user   |
| PUT    | `/users/:id` | Update user   |
| DELETE | `/users/:id` | Delete user   |

Validation rules live under `app/validator/`. Error responses use `http-error` and return JSON `{ "message": ... }` (shape may include field errors for validation failures).

## Project structure

```text
app/
  controllers/          # HTTP handlers (awilix-express)
  services/               # Application services (scoped per request)
  entities/               # Domain behavior (admin vs guest)
  factories/              # Entity instances from persisted users
  repository/             # In-memory store (swap for a DB later)
  routers/                # Routes + validation
  middleware/             # JWT verify, etc.
  validator/              # Zod schemas + validate helper
  dependencyInjector/     # Awilix registration
  createApp.js            # App factory (server + tests)
  index.js                # Listen
test/                     # Vitest + Supertest
```

## Architecture notes

- **Per-request scope**: `scopePerRequest` creates a child container per HTTP request. `userController` and `userService` are registered as **scoped** so they align with per-request `currentUser`.
- **Composition root**: `app/dependencyInjector/index.js` registers classes; `createApp()` wires middleware and routes.
- **Testing**: `createApp()` is imported in tests so HTTP behavior is exercised without duplicating wiring.

## Docker

```bash
npm run app::build
```

The image runs `npm run dev` by default (`dockerfile`). Override `CMD` for production-style runs (for example `node app/index.js` without nodemon).

## License

ISC (see `package.json`).
