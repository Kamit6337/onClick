import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import createCookies from "../../utils/crypto/createCookies";
import UseOAuthLogin from "../../hooks/query/UseOAuthLogin";

const LoginCheck = () => {
  const navigate = useNavigate();

  const { isLoading, isError, error, isSuccess } = UseOAuthLogin();

  useEffect(() => {
    if (isError) {
      navigate("/error", {
        state: {
          errMsg: error?.message || "Something Went Wrong",
        },
      });
    } else if (isSuccess) {
      createCookies();
      navigate("/");
    }
  }, [navigate, isError, isSuccess, error]);

  if (isLoading) {
    return <Loading />;
  }

  return null;
};

export default LoginCheck;
