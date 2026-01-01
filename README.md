# PRATIA Backend (IoT GPS Tracker)

Minimal scaffold implementing the PRATIA backend spec (Node.js, Express, MySQL, Sequelize).

Quick start:

1. Copy `.env.example` to `.env` and update DB credentials.
2. Install deps:

```bash
npm install
```

3. Start server:

```bash
npm run dev
```

Overview:
- Login via `user_key` (no password)
- Devices identified by hashed `device_id` (original never stored)
- Devices post locations using `device_hash` + `device_key`
- App reads latest locations (read-only)

Folder structure: `src/{config,database,models,controllers,services,routes,middlewares,utils}`

Example requests & responses are provided in the `examples` section below.

Examples

- Login (App):

Request:

POST /auth/login
{
  "user_key": "USER_KEY_123"
}

Response:

{
  "session_token": "...",
  "expired_at": "2026-01-08T..."
}

- Claim device (App):

POST /devices/claim (Auth: Bearer <session_token>)
{
  "device_id": "DEVICE_REAL_ID_FROM_DEVICE"
}

Response (success):
{
  "device": { "id": 1, "device_hash": "...", "label": null, "status": "active" }
}

- Device send location (Device -> Webhook):

POST /device/webhook
{
  "device_hash": "...",
  "device_key": "SECRET_FROM_DEVICE",
  "latitude": -6.200000,
  "longitude": 106.816666,
  "speed": 12.5,
  "battery": 88
}

Response:
{ "ok": true }
