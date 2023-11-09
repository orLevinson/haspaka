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

describe("GET /inventoryTracking/ - no auth", () => {
  test("Get inventoryTracking without auth", async () => {
    const res = await request(app).get("/inventoryTracking/");
    expect(res.statusCode).toBe(403);
    expect(res.body.body).toBe("Authentication failed");
  });
});

describe("GET /inventoryTracking/ - with admin", () => {
  test("Get inventoryTracking with admin auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .get("/inventoryTracking/")
      .set("Authorization", `bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.body)).toBe(true);
  });
});

describe("UPDATE /inventoryTracking/ - user without proper auth", () => {
  test("Update inventoryTracking with auth to a different command from the command of the unit of the item that its value is updated", async () => {
    const { regularToken } = await tokens;
    const res = await request(app)
      .patch("/inventoryTracking/")
      .set("Authorization", `bearer ${regularToken}`)
      .send({
        value: 100,
        date: "01-01-2023",
        item_id: 3,
      });
    expect(res.statusCode).toBe(403);
  });
});

describe("UPDATE /inventoryTracking/ - user with invalid inputs", () => {
  test("Update inventoryTracking with invalid inputs", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .patch("/inventoryTracking/")
      .set("Authorization", `bearer ${adminToken}`)
      .send({
        value: 10,
        date: "01-01-1טקסט9",
        item_id: 3,
      });
    expect(res.statusCode).toBe(422);
  });
});

describe("UPDATE /inventoryTracking/ - update with admin", () => {
  test("Update inventoryTracking with admin auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .patch("/inventoryTracking/")
      .set("Authorization", `bearer ${adminToken}`)
      .send({
        value: 100,
        date: "01-01-2023",
        item_id: 3,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.body.value).toBe(100);
    expect(res.body.body.item_name).toBe("Item 1");
  });
});

describe("UPDATE /inventoryTracking/ - update with admin", () => {
  test("Update inventoryTracking with admin auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .patch("/inventoryTracking/")
      .set("Authorization", `bearer ${adminToken}`)
      .send({
        value: 0,
        date: "01-01-2023",
        item_id: 3,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.body.value).toBe(0);
    expect(res.body.body.item_name).toBe("Item 1");
  });
});

describe("POST /inventoryTracking/ - add record", () => {
  test("Update inventoryTracking with admin auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .post("/inventoryTracking/")
      .set("Authorization", `bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.body)).toBe(true);
  });
});

describe("DELETE /inventoryTracking/ - add record", () => {
  test("Update inventoryTracking with admin auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .delete("/inventoryTracking/")
      .set("Authorization", `bearer ${adminToken}`)
      .send({
        date: new Date().toISOString(),
      });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.body)).toBe(true);
  });
});

afterAll((done) => {
  app.close(() => done());
});
