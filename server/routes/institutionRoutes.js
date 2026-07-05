import express from "express";
import { getInstitutionDashboard } from "../controllers/institutionController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken(["institution"]), getInstitutionDashboard);

export default router;
