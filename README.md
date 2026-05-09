# School Management API

A REST API built with **Node.js**, **Express.js**, and **MySQL** to manage school data — add schools and retrieve them sorted by proximity to any location.

---

## Project Structure

```
school-management-api/
├── api/
│   └── index.js          # App entry point
├── src/
│   ├── db.js             # MySQL connection pool
│   ├── routes/
│   │   └── schools.js    # API route handlers
│   └── validators/
│       └── school.js     # Input validation
├── .env                  # Environment variables (never commit this)
├── .gitignore
├── vercel.json           # Vercel deployment config
└── package.json
```

---

## Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) (v18 or above)
- [MySQL](https://dev.mysql.com/downloads/) (local) or a [Railway](https://railway.app) MySQL instance
- [Postman](https://www.postman.com/) for testing

---

## Getting Started (Local)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/school-management-api.git
cd school-management-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file in the root

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
```

### 4. Create the database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS school_management;
EXIT;
```

> The `schools` table is **created automatically** on the first API call — no manual SQL needed.

### 5. Start the development server

```bash
npm run dev
```

Server runs at: `http://localhost:3000`

---

## Deploying to Railway

### 1. Push to GitHub

```bash
git add .
git commit -m "initial commit"
git push -u origin main
```

### 2. Set up Railway

1. Go to [railway.app](https://railway.app) and log in with GitHub
2. Click **New Project** → **Add a service** → **Database** → **MySQL**
3. Once provisioned, click **Add a service** → **GitHub Repo** → select this repo
4. Go to your Node.js service → **Variables** tab and add:

| Key | Value |
|-----|-------|
| `DB_HOST` | from Railway MySQL `MYSQLHOST` |
| `DB_PORT` | from Railway MySQL `MYSQLPORT` |
| `DB_USER` | from Railway MySQL `MYSQLUSER` |
| `DB_PASSWORD` | from Railway MySQL `MYSQLPASSWORD` |
| `DB_NAME` | from Railway MySQL `MYSQLDATABASE` |

5. Go to **Settings** → **Networking** → **Generate Domain**

Your live URL will look like:
```
https://school-management-api-production.up.railway.app
```

---

## API Reference

### Health Check

```
GET /
```

**Response:**
```json
{ "message": "School Management API is running." }
```

---

### Add a School

```
POST /addSchool
```

**Request Body (JSON):**

```json
{
  "name": "City Montessori School",
  "address": "Lucknow, Uttar Pradesh",
  "latitude": 26.85,
  "longitude": 80.94
}
```

**Validation Rules:**
- `name` — required, non-empty string
- `address` — required, non-empty string
- `latitude` — required, number between `-90` and `90`
- `longitude` — required, number between `-180` and `180`

**Success Response `201`:**
```json
{
  "success": true,
  "message": "School added successfully.",
  "data": {
    "id": 1,
    "name": "City Montessori School",
    "address": "Lucknow, Uttar Pradesh",
    "latitude": 26.85,
    "longitude": 80.94
  }
}
```

**Validation Error Response `400`:**
```json
{
  "success": false,
  "errors": ["latitude must be a valid number between -90 and 90."]
}
```

---

### List Schools by Proximity

```
GET /listSchools?latitude={lat}&longitude={lon}
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `latitude` | float | Your current latitude (e.g. `26.4499`) |
| `longitude` | float | Your current longitude (e.g. `80.3319`) |

**Success Response `200`:**
```json
{
  "success": true,
  "count": 2,
  "user_location": {
    "latitude": 26.4499,
    "longitude": 80.3319
  },
  "data": [
    {
      "id": 2,
      "name": "City Montessori School",
      "address": "Lucknow, UP",
      "latitude": 26.85,
      "longitude": 80.94,
      "distance_km": 88.4
    },
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "Sector 45, Noida",
      "latitude": 28.56,
      "longitude": 77.36,
      "distance_km": 406.1
    }
  ]
}
```

> Schools are sorted from **nearest to farthest** using the Haversine formula.

---

## Testing with Postman

1. Open Postman
2. Create a new **Collection** named `School Management API`
3. Add the following requests:

**Request 1 — Add School**
- Method: `POST`
- URL: `http://localhost:3000/addSchool`
- Body → raw → JSON

**Request 2 — List Schools**
- Method: `GET`
- URL: `http://localhost:3000/listSchools`
- Params tab → add `latitude` and `longitude`

Replace `http://localhost:3000` with your Railway URL when testing the live deployment.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon (auto-restart on changes) |
| `npm start` | Start server normally (used by Railway) |

---

## Database Schema

The `schools` table is auto-created on first request:

```sql
CREATE TABLE IF NOT EXISTS schools (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  address   VARCHAR(255) NOT NULL,
  latitude  FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
```

---

## Distance Calculation

Schools are sorted using the **Haversine formula**, which calculates the great-circle distance between two points on Earth given their latitude and longitude. The result is returned as `distance_km` in each school object.

---

## Author

Shivansh Singh
