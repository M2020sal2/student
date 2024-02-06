import express from "express";
import bootstarp from "./src/index.routes.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
const app = express();

bootstarp(app, express);


