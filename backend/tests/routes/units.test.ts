// get the testing stuff
import request from "supertest";

// get envs
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// import app and db
import app from "../../src/app";

// import auth
import getAuthTokens from "../getAuth";

const tokens = getAuthTokens(app);

// admin routes

describe("GET /units/ - no auth", () => {
  test("Get all of units without auth", async () => {
    const res = await request(app).get("/units/");
    expect(res.statusCode).toBe(403);
    expect(res.body.body).toBe("Authentication failed");
  });
});

describe("GET /units/ - with auth", () => {
  test("Get all of units withauth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .get("/units/")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.body)).toBe(true);
  });
});

let new_unit_id: number;

describe("POST /units/", () => {
  test("new unit with auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .post("/units/")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});
    expect(res.statusCode).toBe(200);
    expect(res.body.body.command_id).toBe(1);
    new_unit_id = res.body.body.unit_id;
  });
});

describe("POST /units/ - with wrong types", () => {
  test("new command with wrong types", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .post("/units/")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ unit_name: [1234] });
    expect(res.statusCode).toBe(422);
  });
});

describe("PATCH /units/:cid", () => {
  test("change unit name with auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .patch(`/units/${new_unit_id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ command_id: 4, unit_name: "try" });
    expect(res.statusCode).toBe(200);
    expect(res.body.body.unit_name).toBe("try");
  });
});

describe("DELETE /units/", () => {
  test("delete unit with auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .delete(`/units/`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ units_ids: [new_unit_id] });
    expect(res.statusCode).toBe(200);
    expect(res.body.body[0].unit_name).toBe("try");
  });
});

describe("DELETE /units/ - for non-existent unit", () => {
  test("delete the unit we've just deleted again", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .delete(`/units/`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ units_ids: [new_unit_id] });
    expect(res.statusCode).toBe(500);
  });
});

afterAll((done) => {
  app.close(() => done());
});
