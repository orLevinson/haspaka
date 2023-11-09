// DB imports
import pool from "../Database/connectionToDB";
// model imports
import DefaultController from "./defaultController";
import HttpError from "./http-error";
// type imports
import { NextFunction } from "express";
import { User } from "../Types/users";

class CommandsController extends DefaultController<User> {
  constructor(errCallback: NextFunction) {
    super({
      errCallback,
      table: "Users",
      columns: ["username", "password", "name", "command_id"],
      id_column: "user_id",
      joins: { Commands: "command_id" },
    });
  }

  async getUsers() {
    const users = await this.getAll();
    if (users) {
      return users.map((user) => {
        const copy = { ...user };
        delete copy.password;
        return copy;
      });
    }
    return [];
  }

  async getUserById(id: number) {
    const user = await this.getById(id);
    if (user) {
      delete user.password;
      return user;
    }
  }

  async getUserByName(name: string) {
    let data: User;
    try {
      const { rows }: { rows: Array<User> } = await pool.query(
        this.CreateJoinedQuery(`SELECT * FROM ${this.table} WHERE name=$1`),
        [name]
      );

      data = rows[0];
      return data;
    } catch (error) {
      return this.errCallback(
        new HttpError("an error occured please try again", 500)
      );
    }
  }

  async getUserByUsername(username: string) {
    let data: User;
    try {
      const { rows }: { rows: Array<User> } = await pool.query(
        this.CreateJoinedQuery(`SELECT * FROM ${this.table} WHERE username=$1`),
        [username]
      );

      data = rows[0];
      return data;
    } catch (error) {
      return this.errCallback(
        new HttpError("an error occured please try again", 500)
      );
    }
  }

  async addUser(username: string, password: string, name: string) {
    const user = await this.add({ username, password, name });
    if (user) {
      delete user.password;
      return user;
    }
  }

  async updateUserCommand(user_id: number, command_id: number) {
    const user = await this.update(user_id, {
      command_id,
    });
    if (user) {
      delete user.password;
      return user;
    }
  }

  async deleteUser(user_id: number[]) {
    const users = await this.delete(user_id);
    if (users && users.length > 0) {
      const copy = { ...users[0] };
      delete copy.password;
      return copy;
    }
  }
}

export default CommandsController;
