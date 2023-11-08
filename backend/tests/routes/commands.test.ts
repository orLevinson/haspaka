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

describe("GET /commands/ - no auth", () => {
  test("Get all of commands without auth", async () => {
    const res = await request(app).get("/commands/");
    expect(res.statusCode).toBe(403);
    expect(res.body.body).toBe("Authentication failed");
  });
});

describe("GET /commands/ - with auth", () => {
  test("Get all of commands withauth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .get("/commands/")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.body)).toBe(true);
  });
});

let new_command_id: number;

describe("POST /commands/", () => {
  test("new command with auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .post("/commands/")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.body.command_id == "number").toBe(true);
    new_command_id = res.body.body.command_id;
  });
});

describe("POST /commands/ - with wrong types", () => {
  test("new command with wrong types", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .post("/commands/")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ command_name: [1234] });
    expect(res.statusCode).toBe(422);
  });
});

describe("PATCH /commands/:cid", () => {
  test("change command with auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .patch(`/commands/${new_command_id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ command_name: "try" });
    expect(res.statusCode).toBe(200);
    expect(res.body.body.command_name).toBe("try");
  });
});

describe("DELETE /commands/", () => {
  test("delete command with auth", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .delete(`/commands/`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ commands_ids: [new_command_id] });
    expect(res.statusCode).toBe(200);
    expect(res.body.body[0].command_name).toBe("try");
  });
});

describe("DELETE /commands/ - for non-existent command", () => {
  test("delete the command we've just deleted again", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .delete(`/commands/`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ commands_ids: [new_command_id] });
    expect(res.statusCode).toBe(500);
  });
});

afterAll((done) => {
  app.close(() => done());
});
