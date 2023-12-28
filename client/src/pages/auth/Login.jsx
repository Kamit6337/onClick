import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { postAuthReq } from "../../utils/api/authApi";
import { useMutation } from "@tanstack/react-query";
import environment from "../../utils/environment";
import validator from "validator";
import createCookies from "../../utils/crypto/createCookies";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import isUserLoggedIn from "../../utils/crypto/isUserLoggedIn";

const SERVER_URL = environment.SERVER_URL;

const Login = () => {
  const navigate = useNavigate();
  const [togglePassword, setTogglePassword] = useState(false);
  const { loggedIn } = isUserLoggedIn();

  const { state } = useLocation();

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

  const showErrorMessage = ({ message }) => {
    toast.error(message || "Somethings went Wrong !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  const showSuccessMessage = ({ message, time = 5000 }) => {
    toast.success(message || "Somethings went Wrong !", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: time,
    });
  };

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
    if (isError || state) {
      showErrorMessage({ message: error.message || state.message });
    }
  }, [isError, error, state]);

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

  // const facebookOAuth = () => {
  //   const url = `${SERVER_URL}/auth/facebook`;

  //   const openWindow = window.open(url, "_self");

  //   if (!openWindow) {
  //     console.error("Failed to open the facebook OAuth window");
  //   } else {
  //     openWindow.onerror = (event) => {
  //       console.error(
  //         "Error occurred while opening the facebook OAuth window:",
  //         event
  //       );
  //     };
  //   }
  // };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-2 bg-color_2">
      {/* NOTE: THE CENTER PAGE */}
      <div className="bg-color_1 box_shadow h-[500px] w-[500px] border border-color_3 rounded-xl flex flex-col justify-evenly items-center px-8">
        {/* WORK: HEADLINE*/}
        <p className="text-xl font-bold tracking-wide">Login</p>
        {/* WORK: FORM AND GO TO LOGIN BUTTON*/}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full text-color_1"
        >
          {/* WORK: EMAIL FIELD*/}

          <div className="flex flex-col">
            <input
              type="email"
              {...register("email", {
                required: true,
                validate: (value) => {
                  return (
                    validator.isEmail(value) ||
                    "Please provide correct Email Id."
                  );
                },
              })}
              placeholder="Email"
              className="border border-slate-600 p-3 rounded-lg"
            />

            <p role="alert" className="text-xs text-red-500 pl-2 h-4 mt-[2px]">
              {errors.email?.type === "required" && " Email is required"}
            </p>
          </div>

          {/* WORK: PASSWORD FIELD*/}
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

          {/* WORK: SUBMIT BUTTON*/}

          <div className="flex flex-col">
            <div className="border h-12 mt-8 rounded-lg bg-purple-300 font-semibold text-lg tracking-wide cursor-pointer w-full text-center ">
              {/* <Loading hScreen={false} small={true} /> */}

              {isPending ? (
                <Loading hScreen={false} small={true} />
              ) : (
                <input type="submit" className="w-full h-full cursor-pointer" />
              )}
            </div>
            <p className="mt-2 text-color_4 text-sm">
              Create an account
              <span className="ml-1 underline">
                <Link to={`/signup`}>Sign Up</Link>
              </span>
            </p>
          </div>
        </form>

        {/* WORK: GO TO LOGIN PAGE*/}
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
