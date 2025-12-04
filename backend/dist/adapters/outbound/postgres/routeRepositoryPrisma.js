"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteRepositoryPrisma = void 0;
const prismaClient_1 = require("./prismaClient");
/**
 * Route Repository Adapter (Prisma implementation)
 * Handles all database operations for maritime routes.
 */
class RouteRepositoryPrisma {
    /**
     * Retrieve all routes from the database.
     */
    async findAll() {
        const rows = await prismaClient_1.prisma.route.findMany();
        return rows;
    }
    /**
     * Find a specific route by its numeric ID.
     */
    async findById(id) {
        return prismaClient_1.prisma.route.findUnique({
            where: { id },
        });
    }
    /**
     * Find a specific route by its unique route_id (string).
     */
    async findByRouteId(routeId) {
        return prismaClient_1.prisma.route.findUnique({
            where: { route_id: routeId },
        });
    }
    /**
     * Set a route as baseline for its year.
     * Clears baseline from all other routes in the same year.
     */
    async setBaseline(routeId) {
        const route = await prismaClient_1.prisma.route.findUnique({
            where: { route_id: routeId },
        });
        if (!route)
            throw new Error(`Route with ID ${routeId} not found`);
        await prismaClient_1.prisma.route.updateMany({
            where: { year: route.year },
            data: { is_baseline: false },
        });
        await prismaClient_1.prisma.route.update({
            where: { route_id: routeId },
            data: { is_baseline: true },
        });
    }
    /**
     * Find the baseline route for a given year.
     */
    async findBaselineByYear(year) {
        return prismaClient_1.prisma.route.findFirst({
            where: { year, is_baseline: true },
        });
    }
    /**
     * Find routes for comparison (optionally filtered by year).
     */
    async findComparison(year) {
        const routes = await prismaClient_1.prisma.route.findMany({
            where: year ? { year } : undefined,
            orderBy: { year: "desc" },
        });
        return routes;
    }
}
exports.RouteRepositoryPrisma = RouteRepositoryPrisma;
