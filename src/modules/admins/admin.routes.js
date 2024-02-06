import { Router } from "express";
import * as ac from "./controller/admin.js";
import { multerCloudFunction } from "../../utils/multerCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import {
  authentication,
  authorization,
} from "../../middleware/authentication.js";
import * as schema from "./admin.vaidation.js";
import { valid } from "../../middleware/validation.js";
import roles from "../../utils/systemroles.js";
const router = Router();

router.post(
  "/createstudent",
  authentication,
  authorization([roles.admin, roles.superAdmin]),
  multerCloudFunction(allowedExtensions.Image).single("studentImage"),
  valid(schema.createstudent),
  ac.createstudent
);

router.post("/updatestudent");
export default router;
