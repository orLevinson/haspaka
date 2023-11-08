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

let new_user_id: number;

describe("POST /users/register", () => {
  test("register to the website", async () => {
    const res = await request(app)
      .post("/users/register")
      .send({ username: "testuser", password: "password", name: "testuser" });
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.body.token).toBe("string");
    expect(res.body.body.password).toBe(undefined);
    new_user_id = res.body.body.user_id;
  });
});

describe("POST /users/login", () => {
  test("login to the website", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({ username: "testuser", password: "password" });
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.body.token).toBe("string");
    expect(res.body.body.password).toBe(undefined);
  });
});

// regular users routes

describe("GET /users/checkToken", () => {
  test("check token validity", async () => {
    const { regularToken } = await tokens;
    const res = await request(app)
      .get("/users/checkToken")
      .set("Authorization", `bearer ${regularToken}`);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.body.user_id).toBe("number");
    expect(res.body.body.password).toBe(undefined);
  });
});

// admin routes

// admin routes

describe("GET /users/", () => {
  test("get all users info", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .get("/users/")
      .set("Authorization", `bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.body)).toBe(true);
    expect(typeof res.body.body[0].user_id).toBe("number");
    expect(res.body.body[0].password).toBe(undefined);
  });
});

describe("PATCH /users/:uid", () => {
  test("change user's command", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .patch(`/users/${new_user_id}`)
      .set("Authorization", `bearer ${adminToken}`)
      .send({ command_id: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.body.command_id).toBe(1);
    expect(res.body.body.password).toBe(undefined);
  });
});

describe("PATCH /users/:uid - to a non existent user", () => {
  test("change non-existent user's command", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .patch(`/users/4321531255643262345`)
      .set("Authorization", `bearer ${adminToken}`)
      .send({ command_id: 1 });
    expect(res.statusCode).toBe(500);
  });
});

describe("DELETE /users/:uid", () => {
  test("delete a user", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .delete(`/users/${new_user_id}`)
      .set("Authorization", `bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.body.command_id).toBe(1);
    expect(res.body.body.password).toBe(undefined);
  });
});

describe("DELETE /users/:uid - to a non existent user", () => {
  test("delete a non-existent user", async () => {
    const { adminToken } = await tokens;
    const res = await request(app)
      .delete(`/users/${new_user_id}`)
      .set("Authorization", `bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.body).toBe(undefined);
  });
});

afterAll((done) => {
  app.close(() => done());
});
