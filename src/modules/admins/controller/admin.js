import studentModel from "../../../../DB/models/student.model.js";
import cloudinary from "../../../utils/configCloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { customAlphabet } from "nanoid";
import slugify from "slugify";
const nanoid = customAlphabet(
  "AASDFGHJLQWERTYUIOPZXCVBNMqwertyuiasdfghjlzxcvbnm1234567890",
  4
);

export const createstudent = asyncHandler(async (req, res, next) => {
  const { fullName, national_number, StudentCode, level } = req.body;
  console.log({ fullName, national_number, StudentCode, level });
  if (!req.file) {
    return next(new Error("please upload your image", { cause: 404 }));
  }
  console.log(req.file.path);
  //===================Check Name ====================
  const chkname = await studentModel.findOne({ fullName });
  if (chkname) {
    return next(new Error("Student Name is ALready Exist !", { cause: 404 }));
  }
  //===================Check national_number ====================
  const chknational_number = await studentModel.findOne({ national_number });
  if (chknational_number) {
    return next(
      new Error("Student national_number is ALready Exist !", { cause: 404 })
    );
  }

  //===================Check StudentCode ====================
  const chkStudentCode = await studentModel.findOne({ StudentCode });
  if (chkStudentCode) {
    return next(
      new Error("Student StudentCode is ALready Exist !", { cause: 404 })
    );
  }

  // ===========================================================================
  const slug = slugify(fullName, "_");
  const customId = `${slug}` + "_" + nanoid();
  const folder = `${process.env.folder}/profile_picture/${customId}`;
  console.log(folder, slug);

  // ===============================upload Img =====================================
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: folder,
      use_filename: true,
      unique_filename: true,
    }
  );
  console.log({ secure_url, public_id });

  // ====================================create object =============================================
  const student = {
    fullName,
    national_number,
    StudentCode,
    level: level,
    Images: {
      public_id: public_id,
      secure_url: secure_url,
    },
    role: "student",
  };

  const result = await studentModel.create(student);
  return res.json({ message: "done", student: result });
});
