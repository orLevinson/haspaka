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

// admin routes

describe("GET /items/ - no auth", () => {
  test("Get all of items without auth", async () => {
    const res = await request(app).get("/items/");
    expect(res.statusCode).toBe(403);
    expect(res.body.body).toBe("Authentication failed");
  });
});

describe("GET /items/ - with auth", () => {
  test("Get all of items with auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .get("/items/")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.body)).toBe(true);
  });
});

let new_item_id: number;

describe("POST /items/", () => {
  test("new item with auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .post("/items/")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});
    expect(res.statusCode).toBe(200);
    expect(res.body.body.item_type).toBe("חורף");
    new_item_id = res.body.body.item_id;
  });
});

describe("POST /items/ - with wrong types", () => {
  test("new command with wrong types", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .post("/items/")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ item_name: [1234] });
    expect(res.statusCode).toBe(422);
  });
});

describe("PATCH /items/:iid", () => {
  test("change item name and type with auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .patch(`/items/${new_item_id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ item_name: "try", item_type: "חורף" });
    expect(res.statusCode).toBe(200);
    expect(res.body.body.item_type).toBe("חורף");
  });
});

describe("PATCH /items/:iid - invalid type", () => {
  test("change item type to an invalid type", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .patch(`/items/${new_item_id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ item_type: "invalid" });
    expect(res.statusCode).toBe(422);
  });
});

describe("DELETE /items/", () => {
  test("delete item with auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .delete(`/items/`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ items_ids: [new_item_id] });
    expect(res.statusCode).toBe(200);
    expect(res.body.body[0].item_name).toBe("try");
  });
});

describe("DELETE /items/ - for non-existent item", () => {
  test("delete the item we've just deleted again", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .delete(`/items/`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ items_ids: [new_item_id] });
    expect(res.statusCode).toBe(500);
  });
});

afterAll((done) => {
  app.close(() => done());
});
