import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.DB_url, {
    })
    .then(() => {
      console.log("DB connected");
    })
    .catch((error) => {
      console.log("Error in connection :(", error);
    });
};

export default connectDB;
