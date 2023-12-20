import Cookies from "js-cookie";
import environment from "../environment";
import { encryptString } from "./crypto_js";

const createCookies = () => {
  const encrypt = encryptString(environment.CRYPTO_SECRET_VALUE);
  Cookies.set("_at", encrypt, {
    expires: 7,
    secure: true,
    path: "/",
    sameSite: true,
  });
};

export default createCookies;
