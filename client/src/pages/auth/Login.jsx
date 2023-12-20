import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { postAuthReq } from "../../utils/api/authApi";
import { useMutation } from "@tanstack/react-query";
import { encryptString } from "../../utils/crypto/crypto_js";
import environment from "../../utils/environment";
import Cookies from "js-cookie";
import validator from "validator";

const SERVER_URL = environment.SERVER_URL;

const Login = () => {
  const navigate = useNavigate();
  const [togglePassword, setTogglePassword] = useState(false);

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

  const { isLoading, mutate, data, error, isError } = useMutation({
    mutationKey: ["login"],
    mutationFn: (body) => postAuthReq("/login", body),
    cacheTime: Infinity,
    retry: 3,
  });

  useEffect(() => {
    if (data) {
      const encrypt = encryptString(environment.CRYPTO_SECRET_VALUE);
      Cookies.set("_at", encrypt, {
        expires: 7,
        secure: true,
        path: "/",
        sameSite: true,
      });
      navigate("/");
    }
  }, [data, navigate]);

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

  const facebookOAuth = () => {
    const url = `${SERVER_URL}/auth/facebook`;

    const openWindow = window.open(url, "_self");

    if (!openWindow) {
      console.error("Failed to open the facebook OAuth window");
    } else {
      openWindow.onerror = (event) => {
        console.error(
          "Error occurred while opening the facebook OAuth window:",
          event
        );
      };
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-2">
      {/* WORK: SHOW THE ERROR MESSAGE */}
      <p className="h-6 text-red-400">{isError && error}</p>

      {/* NOTE: THE CENTER PAGE */}

      <div className="h-[500px] w-[700px] border border-gray-600 rounded-xl flex justify-center ">
        {/* WORK: THE OAUTH */}
        <div className="flex-1 flex flex-col gap-4 justify-center items-center p-6">
          <div
            className="border border-slate-500 rounded-lg p-3 w-full cursor-pointer bg-red-200 font-semibold  tracking-wide"
            onClick={googleOAuth}
          >
            Login in Google
          </div>
          <div
            className="border border-slate-500 rounded-lg p-3 w-full mb-20 cursor-pointer bg-blue-200 font-semibold  tracking-wide"
            onClick={facebookOAuth}
          >
            Login in Facebook
          </div>
        </div>
        {/* WORK: BORDER / MARGIN*/}

        <div className="h-full w-[1px] bg-gray-300" />

        {/* WORK: FORM AND GO TO LOGIN BUTTON*/}
        <div className="flex-1 flex flex-col justify-center items-center  p-6">
          {/* WORK: SIGNUP FORM*/}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-rows-3 gap-2 w-full"
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

              <p role="alert" className="text-xs text-red-500 pl-2 h-4">
                {errors.email?.type === "required" && " Email is required"}
              </p>
            </div>

            {/* WORK: PASSWORD FIELD*/}
            <div>
              <div className="flex justify-between items-center border border-slate-600 rounded-lg ">
                <input
                  type={togglePassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  placeholder="Password"
                  className="w-full p-3 rounded-l-lg"
                />

                <p
                  className="p-2"
                  onClick={() => setTogglePassword((prev) => !prev)}
                >
                  {togglePassword ? "Hide" : "Show"}
                </p>
              </div>
              <p role="alert" className="text-xs text-red-500 pl-2 h-4">
                {errors.password?.type === "required" &&
                  " Password is required"}
              </p>
            </div>

            {/* WORK: SUBMIT BUTTON*/}
            <div>
              <input
                type="submit"
                className="border border-slate-600 p-3 rounded-lg bg-purple-300 font-semibold text-lg tracking-wide cursor-pointer w-full"
              />
            </div>
          </form>

          {/* WORK: GO TO LOGIN PAGE*/}

          <p className="self-start">
            <Link to={`/signup`}>Go to Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
