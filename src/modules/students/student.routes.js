import { Router } from "express";
import * as uc from "./controller/student.js";
import { valid } from "../../middleware/validation.js";
import * as schema from "./validSchema.js";
const router = Router();
router.post("/login", valid(schema.login), uc.login);
export default router;
