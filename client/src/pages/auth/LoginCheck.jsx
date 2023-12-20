import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { encryptString } from "../../utils/crypto/crypto_js";
import environment from "../../utils/environment";
import { getAuthReq } from "../../utils/api/authApi";

const LoginCheck = () => {
  const navigate = useNavigate();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["loginCheck"],
    queryFn: async () => await getAuthReq("/login/OAuth"),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useEffect(() => {
    if (isError) {
      navigate("/error", { state: { errMsg: error.message } });
    } else if (data) {
      const encrypt = encryptString(environment.CRYPTO_SECRET_VALUE);
      Cookies.set("_at", encrypt, {
        expires: 7,
        secure: true,
        path: "/",
        sameSite: true,
      });
      navigate("/");
    }
  }, [navigate, isError, data, error]);

  if (isLoading) {
    return <Loading />;
  }

  return null;
};

export default LoginCheck;
