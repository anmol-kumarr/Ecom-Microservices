# README — Basic NestJS + Prisma Setup

This document describes the minimal steps to add Prisma to a new NestJS project and a small Prisma service to connect from Nest.

Prerequisites
- Node.js and npm installed
- Nest CLI (optional): `npm i -g @nestjs/cli`
- A database and a connection string (set in `.env`, e.g. `DATABASE_URL="postgresql://user:pass@host:5432/db"`)

Quick commands
1. Create Nest project
```bash
nest new project-name
cd project-name
```
2. Install Prisma (CLI as dev dep) and init
```bash
npm install prisma --save-dev
npx prisma
npx prisma init
```
3. Add Prisma client generator to `prisma/schema.prisma`
```prisma
generator client {
    provider = "prisma-client-js"
    output   = "../generated/prisma"
}
```
4. Update TypeScript config so the generated folder is compiled and available
Add or replace in `tsconfig.json` (or create `tsconfig.app.json` as appropriate):
```json
{
    "extends": "./tsconfig.json",
    "include": ["src", "generated"],
    "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
```
5. Create initial migration and install runtime client
```bash
npx prisma migrate dev --name init
npm install @prisma/client
```

.prisma notes
- Edit `prisma/schema.prisma` to define your models before running `npx prisma migrate dev`.
- Keep `.env` with `DATABASE_URL` at project root.

Prisma service (Nest)
Create `src/prisma/prisma.service.ts`:
```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }
}
```
- Ensure the import path `generated/prisma` matches the `output` in `schema.prisma`.
- If TypeScript cannot resolve the generated types, confirm `generated` is included in the tsconfig `include`.

Register service in module
Example `app.module.ts` (or a dedicated Prisma module):
```ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
```
Then import `PrismaModule` into `AppModule`.

Run and test
- To run migrations after schema changes:
```bash
npx prisma migrate dev --name <migration-name>
```
- Start Nest app:
```bash
npm run start:dev
```

Tips
- Commit `prisma/schema.prisma` and migration files, but do not commit `.env`.
- Regenerate client automatically when running migrations; otherwise run `npx prisma generate`.
- Consider adding graceful shutdown to disconnect Prisma in production.

That's it — you should now have a minimal Nest + Prisma setup with a PrismaService to inject across your modules.