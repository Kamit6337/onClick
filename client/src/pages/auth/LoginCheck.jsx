import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import createCookies from "../../utils/crypto/createCookies";
import UseOAuthLogin from "../../hooks/query/UseOAuthLogin";
import Toastify from "../../lib/Toastify";

const LoginCheck = () => {
  const navigate = useNavigate();
  const { isLoading, isError, error, isSuccess } = UseOAuthLogin();
  const { ToastContainer, showSuccessMessage } = Toastify();

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Successfully Logged In.", time: 2000 });
      createCookies();

      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [isSuccess, navigate, showSuccessMessage]);

  useEffect(() => {
    if (isError) {
      navigate("/login", { state: { message: error.message } });
    }
  }, [isError, error, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  return <ToastContainer />;
};

export default LoginCheck;
