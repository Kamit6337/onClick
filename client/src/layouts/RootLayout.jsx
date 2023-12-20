import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getAuthReq } from "../utils/api/authApi";
import { useEffect } from "react";
import isUserLoggedIn from "../utils/crypto/isUserLoggedIn";
import removeCookies from "../utils/crypto/removeCookies";

const RootLayout = () => {
  const navigate = useNavigate();

  const { loggedIn } = isUserLoggedIn();

  const { isError, error } = useQuery({
    queryKey: ["continuousCheck"],
    queryFn: () => getAuthReq("/login/check"),
    enabled: loggedIn,
    refetchInterval: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isError) {
      navigate("/error", { state: { errMsg: error.message } });
      removeCookies();
    }
  }, [isError, error, navigate]);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn, navigate]);

  if (!loggedIn) return;

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default RootLayout;
