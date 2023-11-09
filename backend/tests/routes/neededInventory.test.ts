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

describe("GET /neededInventory/ - no auth", () => {
  test("Get neededInventory without auth", async () => {
    const res = await request(app).get("/neededInventory/");
    expect(res.statusCode).toBe(403);
    expect(res.body.body).toBe("Authentication failed");
  });
});

describe("GET /neededInventory/ - with auth", () => {
  test("Get neededInventory with regular user auth", async () => {
    const { regularToken } = await tokens;
    const res = await request(app)
      .get("/neededInventory/")
      .set("Authorization", `bearer ${regularToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.body)).toBe(true);
  });
});

describe("GET /neededInventory/ - with admin", () => {
  test("Get neededInventory with admin auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .get("/neededInventory/")
      .set("Authorization", `bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.body)).toBe(true);
  });
});

describe("UPDATE /neededInventory/ - user without proper auth", () => {
  test("Update neededInventory with auth to a different command from the command of the unit of the item that its value is updated", async () => {
    const { regularToken } = await tokens;
    const res = await request(app)
      .patch("/neededInventory/")
      .set("Authorization", `bearer ${regularToken}`)
      .send({
        value: 100,
        unit_id: 9,
        item_id: 3,
      });
    expect(res.statusCode).toBe(403);
  });
});

describe("UPDATE /neededInventory/ - user with invalid inputs", () => {
  test("Update neededInventory with invalid inputs", async () => {
    const { regularToken } = await tokens;
    const res = await request(app)
      .patch("/neededInventory/")
      .set("Authorization", `bearer ${regularToken}`)
      .send({
        value: -100,
        unit_id: 8,
        item_id: 3,
      });
    expect(res.statusCode).toBe(422);
  });
});

describe("UPDATE /neededInventory/ - update with regular user", () => {
  test("Update neededInventory with regular user auth", async () => {
    const { regularToken } = await tokens;
    const res = await request(app)
      .patch("/neededInventory/")
      .set("Authorization", `bearer ${regularToken}`)
      .send({
        value: 100,
        unit_id: 8,
        item_id: 3,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.body.value).toBe(100);
    expect(res.body.body.unit_name).toBe("Unit B");
  });
});

describe("UPDATE /neededInventory/ - update with admin", () => {
  test("Update neededInventory with admin auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .patch("/neededInventory/")
      .set("Authorization", `bearer ${adminToken}`)
      .send({
        value: 0,
        unit_id: 8,
        item_id: 3,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.body.value).toBe(0);
    expect(res.body.body.unit_name).toBe("Unit B");
  });
});

afterAll((done) => {
  app.close(() => done());
});
