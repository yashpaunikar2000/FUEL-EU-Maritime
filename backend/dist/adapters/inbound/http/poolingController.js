"use strict";
// src/adapters/inbound/http/poolingRouter.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = makePoolingRouter;
const express_1 = require("express");
const createPool_1 = require("../../../core/application/pooling/createPool");
function makePoolingRouter(poolingRepo, complianceRepo) {
    const router = (0, express_1.Router)();
    const createPool = (0, createPool_1.makeCreatePool)(complianceRepo, poolingRepo);
    router.post("/", async (req, res) => {
        try {
            const { shipIds, year } = req.body;
            const result = await createPool(shipIds, year);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    });
    return router;
}
