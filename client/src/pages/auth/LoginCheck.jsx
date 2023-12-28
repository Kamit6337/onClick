import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import createCookies from "../../utils/crypto/createCookies";
import UseOAuthLogin from "../../hooks/query/UseOAuthLogin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const LoginCheck = () => {
  const navigate = useNavigate();
  const { isLoading, isError, error, isSuccess } = UseOAuthLogin();

  const showSuccessMessage = ({ message, time = 5000 }) => {
    toast.success(message || "Somethings went Wrong !", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: time,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Successfully Logged In.", time: 2000 });
      createCookies();

      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      navigate("/login", { state: { message: error.message } });
    }
  }, [isError, error, navigate]);

  // useEffect(() => {
  //   if (isError) {
  //     navigate("/error", {
  //       state: {
  //         errMsg: error?.message || "Something Went Wrong",
  //       },
  //     });
  //   } else if (isSuccess) {
  //     createCookies();
  //     navigate("/");
  //   }
  // }, [navigate, isError, isSuccess, error]);

  if (isLoading) {
    return <Loading />;
  }

  return <ToastContainer />;
};

export default LoginCheck;
