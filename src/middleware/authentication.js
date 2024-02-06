import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/errorHandling.js";
import { tokenmodel } from "../../DB/models/Token.model.js";
import studentModel from "../../DB/models/student.model.js";

export const authentication = asyncHandler(async (req, res, next) => {
  let { token } = req.headers;
  console.log(token);
  try {
    // decode token
    const decode = jwt.verify(token, process.env.signatureToken);
    //chk token payload is right
    if (!decode.StudentCode && !decode._id) {
      return next(new Error("Invalid Token Payload"), { cause: 400 });
    }

    //chk this token in tokenDB and valid true
    const chktoken = await tokenmodel.findOne({ token: token, isvalid: true });
    if (!chktoken) {
      return next(new Error("Token not found in DB"), { cause: 400 });
    }

    //chk email in token in userDB or _id
    const user = await studentModel.findById({ _id: decode._id });
    //return next()
    req.user = user;
    return next();
  } catch (error) {
    if (error == "TokenExpiredError: jwt expired") {
      //chk and  find token and user in DB
      const findtoken = await tokenmodel.findOne({ token: token });
      if (!findtoken) {
        return next(new Error("invalid token", { cause: 400 }));
      }
      //find user
      const user = await studentModel.findById({ _id: findtoken.userId });
      if (!user) {
        return next(new Error("user not found", { cause: 400 }));
      }
      console.log(user);
      //generate new token
      const refreshToken = jwt.sign(
        { _id: user._id, StudentCode: user.StudentCode },
        process.env.signatureToken,
        { expiresIn: 60 * 60 * 12 }
      );
      if (!refreshToken) {
        return next(new Error("server error invalid token", { cause: 500 }));
      }
      //update DB token
      findtoken.token = refreshToken;
      await findtoken.save();
      res
        .status(200)
        .json({ message: "Done", sucess: true, token: refreshToken });
    } else {
      return next(new Error("invalid token", { cause: 400 }));
    }
  }
});

export const authorization = (accessRoles = []) => {
  console.log(accessRoles);
  return asyncHandler(async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("you not authorization to do this"));
    } else {
      return next();
    }
  });
};
