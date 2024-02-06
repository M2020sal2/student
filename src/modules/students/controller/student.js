import jwt from "jsonwebtoken";
import studentModel from "../../../../DB/models/student.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { tokenmodel } from "../../../../DB/models/Token.model.js";

export const login = asyncHandler(async (req, res, next) => {
  const { StudentCode, password } = req.body;
  console.log({ StudentCode, password });
  // chk StudentCode
  const student = await studentModel.findOne({ StudentCode });
  if (!student) {
    return next(new Error("Invalid to log in", { cause: 400 }));
  }
  // =================chk password================
  if (student?.password) {
    if (student?.password != password) {
      return next(new Error("Invalid password"));
    }
  }
  // =====================chk national number =====================
  else {
    if (student.national_number != parseInt(password)) {
      return next(new Error("Invalid password"));
    }
  }

  //======== generate token===========
  const token = jwt.sign(
    { _id: student._id, StudentCode: student.StudentCode },
    process.env.signatureToken,
    { expiresIn: "1h" }
  );
  if (!token) {
    return next(new Error("Invalid to generate token", { cause: 400 }));
  }
  const createToken = {
    token: token,
    userId: student._id,
    agent: req.headers["user-agent"],
    expiredAt: "1h",
  };
  const safetoken = await tokenmodel.create(createToken);
  if (!safetoken) {
    return next(new Error("error try later", { cause: 400 }));
  }
  return res.json({ message: "done", token: token });
});
