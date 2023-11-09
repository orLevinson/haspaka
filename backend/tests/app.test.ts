// get the testing stuff

// get envs
import dotenv from "dotenv";
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

// import app

describe("For High Moral", () => {
  test("Just one passing test to boost up the moral :)", () => {
    expect(2 + 2).toBe(4);
  });
});
