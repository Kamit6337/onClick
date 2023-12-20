import Cookies from "js-cookie";
import { decryptString } from "./crypto_js";
import environment from "../environment";

const isUserLoggedIn = () => {
  // WORK: TAKING VALUE FROM COOKIES AND DECRYPT IT
  const authStr = Cookies.get("_at");

  const decrypt = authStr ? decryptString(authStr) : null;

  if (decrypt === environment.CRYPTO_SECRET_VALUE) {
    return { loggedIn: true };
  } else {
    return { loggedIn: false };
  }
};

export default isUserLoggedIn;
