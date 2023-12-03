import { environment } from "./environment.js";

export const cookieSessionOptions = {
  name: "OAuth-session",
  keys: [environment.JWT_SECRET_KEY],
  maxAge: Number(environment.JWT_EXPIRES_IN),
};
