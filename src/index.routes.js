import studentRouter from "./modules/students/student.routes.js";
import adminRouter from "./modules/admins/admin.routes.js";
import cors from "cors";
import connectDB from "../DB/connection.js";
import { GlobalErrorHandling } from "./utils/errorHandling.js";
const bootstarp = (app, express) => {
  app.use(cors());
  connectDB();
  app.use(express.json());

  app.use("/student", studentRouter);
  app.use("/admin", adminRouter);
  // =================================================================
  const port = process.env.port || 8000;
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  // =====================================================================
  app.use(GlobalErrorHandling);
  app.use("*", (req, res) => {
    return res.status(404).json("Invalid url Request");
  });
};
export default bootstarp;
