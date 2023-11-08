// DB imports
import pool from "../Database/connectionToDB";
// model imports
import HttpError from "./http-error";
// type imports
import { NextFunction } from "express";

class DefaultController<T> {
  errCallback: NextFunction;
  table: string;
  columns: string[];
  id_column?: string;
  joins?: { [table: string]: string };
  constructor(constructorObject: {
    errCallback: NextFunction;
    table: string;
    columns: string[];
    id_column?: string;
    joins?: { [table: string]: string };
  }) {
    this.errCallback = constructorObject.errCallback;
    this.table = constructorObject.table;
    this.columns = constructorObject.columns;
    this.id_column = constructorObject.id_column;
    this.joins = constructorObject.joins;
  }

  CreateJoinedQuery(query: string) {
    let current_query = query;
    Object.entries(this.joins).forEach(([table, join_key], index) => {
      const layerName = `layer${index}`;
      current_query = `WITH ${layerName} AS (${current_query})
        SELECT ${layerName}.*,${table}.* FROM ${layerName}
        LEFT JOIN ${table} 
        ON ${layerName}.${join_key}=${table}.${join_key}`;
    });
    return current_query;
  }

  async getAll() {
    let data: Array<T> = [];
    try {
      const { rows }: { rows: Array<T> } = await pool.query(
        this.CreateJoinedQuery(`SELECT * FROM ${this.table}`)
      );
      data = rows;
      return data;
    } catch (error) {
      return this.errCallback(
        new HttpError("An error occured while fetching data", 500)
      );
    }
  }

  async getById(id: number) {
    let data: T;
    try {
      const { rows }: { rows: Array<T> } = await pool.query(
        this.CreateJoinedQuery(
          `SELECT * FROM ${this.table} WHERE ${this.id_column}=$1`
        ),
        [id]
      );

      if (rows.length == 0) {
        return this.errCallback(
          new HttpError(
            "There was no instances in database with the given id",
            204
          )
        );
      }

      data = rows[0];
      return data;
    } catch (error) {
      return this.errCallback(
        new HttpError("An error occured while fetching data", 500)
      );
    }
  }

  async add(dataObj: { [key in (typeof this.columns)[number]]?: any }) {
    let data: T;
    try {
      const queryKeyString = `(${this.columns.join(",")})`;
      const queryParamArray: string[] = [];
      const queryValueArray: any[] = [];
      let paramIdx = 1;
      this.columns.forEach((col) => {
        if (col !== this.id_column) {
          if (dataObj[col] && dataObj[col] !== 0) {
            queryParamArray.push(`$${paramIdx}`);
            paramIdx++;
            queryValueArray.push(dataObj[col]);
          } else {
            queryParamArray.push("NULL");
          }
        }
      });
      const queryParamString = `(${queryParamArray.join(",")})`;
      const { rows }: { rows: Array<T> } = await pool.query(
        this.CreateJoinedQuery(
          `INSERT INTO ${this.table} ${queryKeyString} VALUES ${queryParamString} RETURNING *`
        ),
        queryValueArray
      );
      data = rows[0];
      return data;
    } catch (error) {
      return this.errCallback(
        new HttpError("An error occured while adding data", 500)
      );
    }
  }

  async update(
    id: number,
    dataObj: { [key in (typeof this.columns)[number]]?: any }
  ) {
    let data: T;
    try {
      const queryParamArray: string[] = [];
      const queryValueArray: any[] = [];
      let paramIdx = 1;
      this.columns.forEach((col) => {
        if (col !== this.id_column) {
          if (dataObj[col] && dataObj[col] !== 0) {
            queryParamArray.push(`${col}=$${paramIdx}`);
            paramIdx++;
            queryValueArray.push(dataObj[col]);
          }
        }
      });
      const queryParamString = `${queryParamArray.join(",")}`;
      const { rows }: { rows: Array<T> } = await pool.query(
        this.CreateJoinedQuery(
          `UPDATE ${this.table} SET ${queryParamString} WHERE ${this.id_column}=$${paramIdx} RETURNING *`
        ),
        [...queryValueArray, id]
      );

      if (rows.length == 0) {
        throw new Error();
      }

      data = rows[0];
      return data;
    } catch (error) {
      return this.errCallback(
        new HttpError("An error occured while updating data", 500)
      );
    }
  }

  async delete(id: number) {
    let data: T;
    try {
      const { rows }: { rows: Array<T> } = await pool.query(
        `DELETE FROM ${this.table} WHERE ${this.id_column}=$1 RETURNING *`,
        [id]
      );
      if (rows.length == 0) {
        throw new Error();
      }
      data = rows[0];
      return data;
    } catch (error) {
      console.log(error);
      return this.errCallback(
        new HttpError("An error occured while deleting data", 500)
      );
    }
  }
}

export default DefaultController;
