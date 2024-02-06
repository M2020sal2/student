import { Schema, Types, model } from "mongoose";

const studentschema = new Schema(
  {
    fullName: {
      type: String,
      unique: true,
      required: true,
    },
    national_number: {
      type: Number,
      unique: true,
      required: true,
      length: 15,
    },
    StudentCode: {
      type: Number,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      unique: false,
    },
    Images: {
      public_id: {
        required: false,
        type: String,
      },
      secure_url: {
        required: false,
        type: String,
      },
    },
    level: {
      required: true,
      type: String,
      enum: ["one", "two", "there", "four"],
    },
    role: {
      type: String,
      required: true,
      enum: ["student", "admin", "superAdmin"],
    },
  },
  { timestampst: true }
);

const studentModel = model("student", studentschema);

export default studentModel;
