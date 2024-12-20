# Glide Mobile App

This is a working prototype of an on-demand autonomous shuttle bus booking app built for SIT students at the SIT Punggol campus.

Built for INF2002 module.

### Tech Stack

- [Next.js (React)](https://nextjs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Lucia Auth](https://lucia-auth.com/)
- [Tailwind](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [lucide-react icons](https://lucide.dev/icons/)

## Requirements

#### You need to download [Node.js](https://nodejs.org/en) and [PostgreSQL](https://www.postgresql.org/download/) to get started.

## Development

### Install

Run these commands to install pnpm for development and install the required packages.

```
git clone https://github.com/jiaweing/hci.git
npm i -g pnpm
pnpm i
```

### Run Migration

1. Setup DATABASE_URL in .env first with your PostgreSQL connection string
2. Example Format:
   `postgresql://user:password@localhost:5432/databasename`

Run command to seed the required tables into the database.

```
pnpm db:migrate
```

### Start Server

```
pnpm dev
```

## Account Registration

[Sign up](http://localhost:3000/signup) as a new user on the site UI and look for the OTP code in the console logs.

E.g.

```
📨 Email sent to: reach.jiawei@gmail.com with template: EmailVerification and props: {"code":"87377561"}
 ✓ Compiled /verify-email in 370ms (1318 modules)
```
