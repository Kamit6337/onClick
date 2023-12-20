import Cookies from "js-cookie";

const removeCookies = () => {
  Cookies.remove("_at", { secure: true, path: "/", sameSite: true }); // removed!
};

export default removeCookies;
