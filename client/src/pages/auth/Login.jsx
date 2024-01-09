import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { postAuthReq } from "../../utils/api/authApi";
import { useMutation } from "@tanstack/react-query";
import environment from "../../utils/environment";
import validator from "validator";
import createCookies from "../../utils/crypto/createCookies";
import isUserLoggedIn from "../../utils/crypto/isUserLoggedIn";
import Toastify from "../../lib/Toastify";

const SERVER_URL = environment.SERVER_URL;

const Login = () => {
  const navigate = useNavigate();
  const [togglePassword, setTogglePassword] = useState(false);
  const { loggedIn } = isUserLoggedIn();

  const { state } = useLocation();

  const [oAuthLoginState, setOAuthLoginState] = useState(state || null);
  console.log("state from login", state);

  const { ToastContainer, showErrorMessage, showSuccessMessage } = Toastify();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isPending, mutate, error, isError, isSuccess } = useMutation({
    mutationKey: ["login"],
    mutationFn: (body) => postAuthReq("/login", body),
    retry: 3,
  });

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate]);

  useEffect(() => {
    if (isError) {
      showErrorMessage({ message: error.message });
    }
  }, [isError, error, showErrorMessage]);

  useEffect(() => {
    if (oAuthLoginState) {
      showErrorMessage({ message: oAuthLoginState.message });
      setOAuthLoginState(null);
    }
  }, [oAuthLoginState, showErrorMessage]);

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage({ message: "Successfully Logged In.", time: 2000 });
      createCookies();

      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [isSuccess, navigate]);

  const onSubmit = async (data) => {
    mutate(data);
  };

  const googleOAuth = () => {
    const url = `${SERVER_URL}/auth/google`;
    const openWindow = window.open(url, "_self");

    if (!openWindow) {
      console.error("Failed to open the Google OAuth window");
    } else {
      openWindow.onerror = (event) => {
        console.error(
          "Error occurred while opening the Google OAuth window:",
          event
        );
      };
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-2 bg-color_2">
      {/* NOTE: THE CENTER PAGE */}
      <div className="bg-color_1 box_shadow h-[500px] w-[600px] border border-color_3 rounded-xl flex flex-col justify-evenly items-center px-8">
        {/* MARK: HEADLINE*/}
        <p className="text-xl font-bold tracking-wide">Login</p>
        {/* MARK: FORM AND GO TO LOGIN BUTTON*/}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full text-color_1"
        >
          {/* MARK: EMAIL FIELD*/}

          <div className="flex flex-col">
            <input
              type="email"
              {...register("email", {
                required: true,
                validate: (value) => {
                  return validator.isEmail(value);
                },
              })}
              placeholder="Email"
              className="border border-slate-600 p-3 rounded-lg"
            />

            <p role="alert" className="text-xs text-red-500 pl-2 h-4 mt-[2px]">
              {errors.email?.type === "required" && " Email is required"}
              {errors.email?.type === "validate" &&
                "Please provide correct Email Id."}
            </p>
          </div>

          {/* MARK: PASSWORD FIELD*/}
          <div>
            <div className="h-12 flex justify-between items-center border rounded-lg w-full ">
              <input
                type={togglePassword ? "text" : "password"}
                {...register("password", { required: true })}
                placeholder="Password"
                className="w-full h-full rounded-l-lg px-3"
              />

              <div
                className="text-color_4 cursor-pointer w-20 h-full flex justify-center items-center"
                onClick={() => setTogglePassword((prev) => !prev)}
              >
                <p>{togglePassword ? "Hide" : "Show"}</p>
              </div>
            </div>
            <p role="alert" className="text-xs text-red-500 pl-2 h-4 mt-[2px]">
              {errors.password?.type === "required" && " Password is required"}
            </p>
          </div>

          {/* MARK: SUBMIT BUTTON*/}

          <div className="flex flex-col">
            <div className="border h-12 mt-8 rounded-lg bg-purple-300 font-semibold text-lg tracking-wide cursor-pointer w-full text-center ">
              {/* <Loading hScreen={false} small={true} /> */}

              {isPending ? (
                <Loading hScreen={false} small={true} />
              ) : (
                <input type="submit" className="w-full h-full cursor-pointer" />
              )}
            </div>
            <div className="mt-2 text-color_4 text-sm flex justify-between items-center">
              <p>
                Create an account
                <span className="ml-1 underline">
                  <Link to={`/signup`}>Sign Up</Link>
                </span>
              </p>
              <p>
                <Link to={`/forgotPassword`}>Forgot Password</Link>
              </p>
            </div>
          </div>
        </form>

        {/* MARK: GO TO LOGIN PAGE*/}
        <div
          className="border rounded-lg p-3 w-full cursor-pointer bg-red-500 font-semibold  tracking-wide text-center"
          onClick={googleOAuth}
        >
          Login in Google
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
