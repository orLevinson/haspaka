// get the testing stuff
import request from "supertest";

// get envs
import dotenv from "dotenv";
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

// import app and db
import app from "../../src/app";

// import auth
import getAuthTokens from "../getAuth";

const tokens = getAuthTokens(app);

describe("GET /marhasInventory/ - no auth", () => {
    test("Get marhasInventory without auth", async () => {
      const res = await request(app).get("/marhasInventory/");
      expect(res.statusCode).toBe(403);
      expect(res.body.body).toBe("Authentication failed");
    });
  });
  
  describe("GET /marhasInventory/ - with admin", () => {
    test("Get marhasInventory with admin auth", async () => {
      const { adminToken } = await tokens;
      const res = await request(app)
        .get("/marhasInventory/")
        .set("Authorization", `bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.body)).toBe(true);
    });
  });

  afterAll((done) => {
    app.close(() => done());
  });
  