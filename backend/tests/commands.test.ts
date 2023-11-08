// get the testing stuff
import request from "supertest"
import { describe, it } from "node:test";

// get envs
import dotenv from "dotenv"
dotenv.config({path: `.env.${process.env.NODE_ENV}`})

// import app
import app from "../src/app";

// describe("GET /api/products/:id", () => {
//     it("should return a product", async () => {
//       const res = await request(app).get(
//         "/api/products/6331abc9e9ececcc2d449e44"
//       );
//       expect(res.statusCode).toBe(200);
//       expect(res.body.name).toBe("Product 1");
//     });
//   });
