import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { IUser } from "../interfaces";

export function createContext(opts?: CreateExpressContextOptions) {
  function getUserFromHeader(): IUser | null {
    const user = opts?.req.user || null;

    return user as IUser | null;
  }
  const user = getUserFromHeader();

  return {
    user,
  };
}
