// src/adapters/inbound/http/poolingRouter.ts

import { Router } from "express";
import { PoolingRepository } from "../../../core/ports/poolingRepository";
import { ComplianceRepository } from "../../../core/ports/complianceRepository";
import { makeCreatePool } from "../../../core/application/pooling/createPool";

export default function makePoolingRouter(
  poolingRepo: PoolingRepository,
  complianceRepo: ComplianceRepository
) {
  const router = Router();

  const createPool = makeCreatePool(complianceRepo, poolingRepo);

  router.post("/", async (req, res) => {
    try {
      const { shipIds, year } = req.body;
      const result = await createPool(shipIds, year);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
