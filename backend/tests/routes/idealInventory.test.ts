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

describe("GET /idealInventory/ - no auth", () => {
  test("Get idealInventory without auth", async () => {
    const res = await request(app).get("/idealInventory/");
    expect(res.statusCode).toBe(403);
    expect(res.body.body).toBe("Authentication failed");
  });
});

describe("GET /idealInventory/ - with auth", () => {
  test("Get idealInventory with regular user auth", async () => {
    const { regularToken } = await tokens;
    const res = await request(app)
      .get("/idealInventory/")
      .set("Authorization", `bearer ${regularToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.body)).toBe(true);
  });
});

describe("GET /idealInventory/ - with admin", () => {
  test("Get idealInventory with admin auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .get("/idealInventory/")
      .set("Authorization", `bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.body)).toBe(true);
  });
});

describe("UPDATE /idealInventory/ - user without proper auth", () => {
  test("Update idealInventory with auth to a different command from the command of the unit of the item that its value is updated", async () => {
    const { regularToken } = await tokens;
    const res = await request(app)
      .patch("/idealInventory/")
      .set("Authorization", `bearer ${regularToken}`)
      .send({
        value: 100,
        unit_id: 9,
        item_id: 3,
      });
    expect(res.statusCode).toBe(403);
  });
});

describe("UPDATE /idealInventory/ - user with invalid inputs", () => {
  test("Update idealInventory with invalid inputs", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .patch("/idealInventory/")
      .set("Authorization", `bearer ${adminToken}`)
      .send({
        value: -100,
        unit_id: 8,
        item_id: 3,
      });
    expect(res.statusCode).toBe(422);
  });
});

describe("UPDATE /idealInventory/ - update with admin", () => {
  test("Update idealInventory with admin auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .patch("/idealInventory/")
      .set("Authorization", `bearer ${adminToken}`)
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

describe("UPDATE /idealInventory/ - update with admin again", () => {
    test("Update idealInventory with admin auth", async () => {
      const { adminToken } = await tokens;
      const res = await request(app)
        .patch("/idealInventory/")
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
