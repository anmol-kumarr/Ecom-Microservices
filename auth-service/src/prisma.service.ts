/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, OnModuleInit } from "@nestjs/common";
import { join } from "path";
import type { PrismaClient as PrismaClientType } from "../generated/prisma";

// Dynamically load PrismaClient from the generated folder using absolute path
const PrismaClientClass = require(join(process.cwd(), 'generated', 'prisma')).PrismaClient as typeof PrismaClientType;

@Injectable()
export class PrismaService extends PrismaClientClass implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }
}
