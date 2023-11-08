// get the testing stuff
import request from "supertest";

// get envs
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// import app
import app from "../src/app";

describe("For High Moral", () => {
  test("Just one passing test to boost up the moral :)", () => {
    expect(2 + 2).toBe(4);
  });
});

afterAll((done) => {
  app.close(() => done());
});
