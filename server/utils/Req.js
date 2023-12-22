import modifyCookies from "./socket/modifyCookies.js";

const Req = (req) => {
  const { cookie } = req.headers;

  if (!cookie) {
    throw new Error("Cookie is not present");
  }

  const cookies = modifyCookies(cookie);
  return cookies;
};

export default Req;
