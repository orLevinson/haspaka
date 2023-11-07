import { Request } from "express";
import { User } from "./users";

interface ExtendedRequest extends Request {
  userData: User;
}

export default ExtendedRequest;
