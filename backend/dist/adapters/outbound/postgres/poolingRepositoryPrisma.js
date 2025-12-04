"use strict";
// src/adapters/outbound/postgres/poolingRepositoryPrisma.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolingRepositoryPrisma = void 0;
const prismaClient_1 = require("./prismaClient");
class PoolingRepositoryPrisma {
    async createPool(year) {
        const pool = await prismaClient_1.prisma.pool.create({
            data: { year },
        });
        return pool.id;
    }
    async addPoolMembers(poolId, members) {
        await prismaClient_1.prisma.poolMember.createMany({
            data: members.map((m) => ({
                pool_id: poolId,
                ship_id: m.ship_id,
                cb_before: m.cb_before,
                cb_after: m.cb_after,
            })),
        });
    }
}
exports.PoolingRepositoryPrisma = PoolingRepositoryPrisma;
