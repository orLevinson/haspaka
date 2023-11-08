import { Server } from "http";
import request from "supertest";

const getAuth = async (app: Server) => {
  const adminRes = await request(app)
    .post("/users/login")
    .set("Content-Type", "application/json")
    .send({
      username: "admin",
      password: "password",
    });
  const nonAdminRes = await request(app)
    .post("/users/login")
    .set("Content-Type", "application/json")
    .send({
      username: "regular-user",
      password: "password",
    });
  const unAuthRes = await request(app)
    .post("/users/login")
    .set("Content-Type", "application/json")
    .send({
      username: "no-auth",
      password: "password",
    });

  return {
    adminToken: adminRes.body.body.token,
    regularToken: nonAdminRes.body.body.token,
    noAuthToken: unAuthRes.body.body.token,
  };
};

export default getAuth;
