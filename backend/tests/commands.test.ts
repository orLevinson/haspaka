// import the testing files
import request from "supertest";
import app from "../src/app";

// get envs
import dotenv from "dotenv"
dotenv.config({path: `.env.${process.env.NODE_ENV}`})


