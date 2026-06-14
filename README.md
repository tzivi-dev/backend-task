# 🎮 Game Management System — Prisma & Docker

A backend simulation demonstrating user creation, game initialization, and player registration using **Node.js**, **Prisma ORM**, and **PostgreSQL**, fully containerized with **Docker**.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Business Logic](#business-logic)
- [Getting Started](#getting-started)
- [Expected Output](#expected-output)
- [Error Handling](#error-handling)
- [Future Improvements](#future-improvements)

---

## Overview

This project simulates a real-world backend flow:

1. A **user** is created or retrieved (upsert pattern)
2. A **game** is opened with status `WAITING`
3. The user **joins the game** via the `joinGame` service
4. The result is logged to the console

All database interactions are handled through **Prisma**, and the entire environment runs inside **Docker** — no local PostgreSQL or Node.js installation required.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Prisma ORM** | Database access, migrations, and schema management |
| **PostgreSQL** | Relational database |
| **Docker & Docker Compose** | Containerized, isolated environment |

---

## Project Structure

```
project-root/
│
├── prisma/
│   ├── migrations/
│   │   └── 20260414180745_init/   # Initial migration
│   ├── migration_lock.toml
│   └── schema.prisma              # Database schema & models
│
├── src/
│   ├── services/
│   │   └── game.service.js        # joinGame business logic
│   └── main.js                    # Entry point & simulation runner
│
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── package-lock.json
```

---

## Database Schema

Defined in `prisma/schema.prisma` using **PostgreSQL**.

### Enums

```prisma
enum GameStatus {
  WAITING      // Game is open for players to join
  LIVE         // Game is in progress
  COMPLETED    // Game has ended
}

enum ParticipantRole {
  PLAYER
  ADMIN
}
```

### Models

#### `User`
| Field | Type | Notes |
|---|---|---|
| `id` | Int | Auto-incremented primary key |
| `username` | String | Unique |
| `createdAt` | DateTime | Defaults to `now()` |
| `games` | GameParticipant[] | Relation — games this user participates in |

#### `Game`
| Field | Type | Notes |
|---|---|---|
| `id` | Int | Auto-incremented primary key |
| `status` | GameStatus | Defaults to `WAITING` |
| `createdAt` | DateTime | Defaults to `now()` |
| `participants` | GameParticipant[] | Relation — all participants in this game |

#### `GameParticipant` *(junction table)*
| Field | Type | Notes |
|---|---|---|
| `id` | Int | Auto-incremented primary key |
| `score` | Int | Defaults to `0` |
| `role` | ParticipantRole | Defaults to `PLAYER` |
| `joinedAt` | DateTime | Defaults to `now()` |
| `userId` | Int | FK → User |
| `gameId` | Int | FK → Game |

> **Unique constraint:** `@@unique([userId, gameId])` — a user can only join the same game once.

### Entity Relationship Diagram

```
User (1) ──────< GameParticipant >────── (1) Game
                    - score
                    - role
                    - joinedAt
```

---

## Business Logic

### `joinGame(userId, gameId)` — `src/services/game.service.js`

Registers a user as a participant in a game. Enforces the following rules:

| Check | Behavior |
|---|---|
| Game does not exist | Throws `'Game not found'` |
| Game status is not `WAITING` | Throws `'Game already started'` |
| User already joined this game | Catches Prisma error `P2002`, throws `'User is already registered for this game'` |
| Success | Creates and returns a `GameParticipant` record |

### `main()` — `src/main.js`

Orchestrates the full simulation:

1. Connects to the database via Prisma
2. Creates or retrieves a user (`test_user`) using `upsert`
3. Creates a new game with status `WAITING`
4. Calls `joinGame(userId, gameId)`
5. Logs success or error
6. Disconnects from the database via `prisma.$disconnect()`

---

## Getting Started

> Docker Desktop must be running. No local Node.js or PostgreSQL installation is needed.

### 1. Clone the repository

```bash
git clone https://github.com/tzivi-dev/backend-task
cd project-root
```

### 2. Run with Docker Compose

```bash
docker-compose up --build
```

This command will:
- Build the Node.js application image
- Start a PostgreSQL container
- Run Prisma migrations automatically
- Execute `main.js`

### Environment Variables

The database connection is configured via the `DATABASE_URL` environment variable, set inside `docker-compose.yml`:

```
DATABASE_URL=postgresql://user:password@db:5432/gamedb
```

---

## Expected Output

```
🚀 Starting simulation...
👤 User created/found: test_user (ID: 1)
🎮 Game created in WAITING status (ID: 1)
📝 Attempting to join game...
✅ Success: User joined game (Participation ID: 1)
app-1 exited with code 0
```

---

## Error Handling

| Scenario | Error Message |
|---|---|
| Game ID does not exist | `Game not found` |
| Game is `LIVE` or `COMPLETED` | `Game already started` |
| User already joined this game | `User is already registered for this game` |
| Any other DB error | Re-thrown as-is |
| Any top-level failure | Logged via `console.error`, exits with code `1` |

---

## Future Improvements

- [ ] REST API layer (Express.js) exposing `POST /games/:id/join`
- [ ] Authentication & authorization (JWT)
- [ ] Unit and integration tests (Jest + Prisma mock)
- [ ] Support for `ADMIN` role assignment
- [ ] Game lifecycle management — transition from `WAITING` → `LIVE` → `COMPLETED`
- [ ] Score tracking and leaderboard endpoint
- [ ] Input validation layer (Zod / Joi)

---

## Author

**tzivi-dev** — Backend Assessment Project
