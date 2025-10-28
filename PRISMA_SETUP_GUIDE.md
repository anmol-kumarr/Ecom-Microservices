# Prisma Setup Guide for NestJS Microservices

This guide explains how to properly configure Prisma in your NestJS microservices to avoid common export and module resolution errors.

## Table of Contents
- [Quick Setup](#quick-setup)
- [Common Issues & Solutions](#common-issues--solutions)
- [Service Configuration](#service-configuration)
- [Troubleshooting](#troubleshooting)

---

## Quick Setup

### 1. Prisma Schema Configuration

**File:** `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"  // ✅ IMPORTANT: Use "prisma-client-js", NOT "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Your models here...
```

### 2. PrismaService Implementation

**File:** `src/prisma.service.ts`

```typescript
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, OnModuleInit } from "@nestjs/common";
import { join } from "path";
import type { PrismaClient as PrismaClientType } from "../generated/prisma/client.js";

// Dynamically load PrismaClient from the generated folder using absolute path
const PrismaClientClass = require(join(process.cwd(), 'generated', 'prisma')).PrismaClient as typeof PrismaClientType;

@Injectable()
export class PrismaService extends PrismaClientClass implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }
}
```

### 3. Register in Module

**File:** `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Module({
  imports: [/* your imports */],
  controllers: [AppController],
  providers: [AppService, PrismaService],  // ✅ Add PrismaService here
})
export class AppModule {}
```

### 4. Generate Prisma Client

```bash
# Run this after any schema changes
npx prisma generate
```

---

## Common Issues & Solutions

### Issue 1: "Cannot find module '../generated/prisma'"

**Cause:** Wrong generator provider in schema.prisma

**Solution:**
```prisma
# ❌ WRONG
generator client {
  provider = "prisma-client"
}

# ✅ CORRECT
generator client {
  provider = "prisma-client-js"
}
```

After fixing, run:
```bash
npx prisma generate
```

---

### Issue 2: "Property 'user' does not exist on type 'PrismaService'"

**Cause:** PrismaService is not properly extending PrismaClient

**Solution:** Use the dynamic require pattern shown above in [Service Configuration](#2-prismaservice-implementation)

---

### Issue 3: "Nest can't resolve dependencies of the AppController"

**Cause:** PrismaService not added to module providers

**Solution:**
```typescript
@Module({
  providers: [AppService, PrismaService],  // ✅ Add PrismaService
})
```

---

### Issue 4: "Cannot find module at runtime (dist folder)"

**Cause:** Generated files not being copied to dist or wrong path resolution

**Solution:** The dynamic require pattern with `process.cwd()` automatically handles this:
```typescript
const PrismaClientClass = require(join(process.cwd(), 'generated', 'prisma')).PrismaClient;
```

This works because:
- During development: reads from `project-root/generated/prisma`
- In production (dist): TypeScript copies generated folder to `dist/generated/prisma`

---

## Service Configuration

### Why Use Dynamic Require?

When using `"module": "nodenext"` in tsconfig.json, static imports of Prisma don't work properly because:
1. Prisma generates ESM modules with `import.meta.url`
2. TypeScript's module resolution can't handle mixed module systems
3. The dynamic require pattern bypasses these issues

### TypeScript Configuration

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "esModuleInterop": true,
    "skipLibCheck": true,        // ✅ Important for Prisma
    "baseUrl": "./",
    "outDir": "./dist"
  }
}
```

---

## Troubleshooting

### Check Generated Files

After running `npx prisma generate`, verify these files exist:

```bash
generated/prisma/
├── index.js          # ✅ Must exist
├── index.d.ts        # ✅ Must exist
├── default.js        # ✅ Must exist
├── default.d.ts      # ✅ Must exist
├── package.json      # ✅ Must exist
├── client.js
├── client.d.ts
├── client.ts
└── ...
```

**If missing:** You're using wrong provider. Change to `"prisma-client-js"` and regenerate.

### Verify Import Path

```typescript
// ✅ Correct - Type import with .js extension
import type { PrismaClient as PrismaClientType } from "../generated/prisma/client.js";

// ✅ Correct - Runtime require without extension
const PrismaClientClass = require(join(process.cwd(), 'generated', 'prisma')).PrismaClient;
```

### Test PrismaService

```typescript
// In your controller or service
constructor(private readonly prisma: PrismaService) {}

async testConnection() {
  // Should work if configured correctly
  const users = await this.prisma.user.findMany();
  return users;
}
```

---

## Complete Working Example

### Directory Structure
```
your-service/
├── prisma/
│   ├── schema.prisma        # ✅ provider = "prisma-client-js"
│   └── migrations/
├── generated/
│   └── prisma/              # ✅ Created by prisma generate
│       ├── index.js
│       ├── package.json
│       └── ...
├── src/
│   ├── prisma.service.ts    # ✅ Dynamic require pattern
│   ├── app.module.ts        # ✅ PrismaService in providers
│   ├── app.controller.ts
│   └── main.ts
└── tsconfig.json
```

### Full Schema Example
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          Int       @id @default(autoincrement())
  email       String    @unique
  phoneNumber String?
  password    String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

---

## Migration Commands

```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Generate Prisma Client (after schema changes)
npx prisma generate

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

---

## Environment Variables

**File:** `.env`

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
```

---

## Quick Fix Checklist

When you encounter Prisma errors, follow this checklist:

- [ ] Check `schema.prisma` has `provider = "prisma-client-js"`
- [ ] Run `npx prisma generate`
- [ ] Verify `generated/prisma/index.js` exists
- [ ] Use dynamic require pattern in `prisma.service.ts`
- [ ] Add `PrismaService` to module `providers` array
- [ ] Import `PrismaService` in module file
- [ ] Restart your development server
- [ ] Check TypeScript compilation errors are gone

---

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Prisma Recipe](https://docs.nestjs.com/recipes/prisma)
- [Prisma with TypeScript](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client#generating-the-client-for-typescript)

---

## Support

If you still encounter issues:
1. Delete `generated` folder
2. Run `npx prisma generate` again
3. Delete `node_modules` and reinstall: `pnpm install`
4. Clear TypeScript cache: Delete `dist` folder and rebuild

---

**Last Updated:** October 28, 2025
