import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: RedisClientType

    async onModuleInit() {
        this.client = createClient({ url: process.env.REDIS_URL })

        this.client.on('error', (err) => console.log('Redis error', err))

        await this.client.connect()
        console.log('redis connected')

    }

    async onModuleDestroy() {
        await this.client.quit()
        console.log('redis disconnected')
    }

    async set(key: string, value:string, ttl?: number) {
        if (ttl) {
            await this.client.set(key, value, { EX: ttl })
        } else {
            await this.client.set(key, value)
        }
    }

    async get(key: string) {
        return await this.client.get(key);
    }
}