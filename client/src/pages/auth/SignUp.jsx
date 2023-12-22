import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import environment from "../../utils/environment";
import { postAuthReq } from "../../utils/api/authApi";
import { useMutation } from "@tanstack/react-query";
import validator from "validator";
import createCookies from "../../utils/crypto/createCookies";

const SERVER_URL = environment.SERVER_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState({
    password: false,
    confirmPassword: false,
  });

  const { isLoading, mutate, error, isError, isSuccess } = useMutation({
    mutationKey: ["signup"],
    mutationFn: (body) => postAuthReq("/signup", body),
    retry: 3,
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      createCookies();
      navigate("/");
    }
  }, [isSuccess, navigate]);

  const onSubmit = async (data) => {
    const { confirmPassword, ...formData } = data;

    mutate(formData);
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
    <div className="h-screen w-full flex flex-col gap-2 justify-center items-center">
      {/* NOTE: THE CENTER PAGE */}
      {/* WORK: SHOW ERROR IF OCCUR */}
      <p className="h-6 text-red-400">{isError && error}</p>

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
        <div className="flex-1 flex flex-col p-6 py-10">
          {/* WORK: SIGNUP FORM*/}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 h-full w-full"
          >
            {/* WORK: NAME FIELD*/}
            <div className="flex flex-col">
              <input
                type="text"
                {...register("name", {
                  required: true,
                  pattern: /^[A-Za-z]+$/i,
                  validate: (value) => {
                    return (
                      validator.isAlpha(value) ||
                      "Check you name again. Only Alphabet is allowed."
                    );
                  },
                })}
                placeholder="Name"
                className="border border-slate-600 p-3 rounded-lg"
              />

              <p role="alert" className="text-xs text-red-500 pl-2 h-4">
                {/* {errors.name?.type === "required" && "Name is required"} */}
                {errors.name && errors.name.message}
              </p>
            </div>

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
                {errors.email && errors.email.message}
              </p>
            </div>

            {/* WORK: PASSWORD FIELD*/}
            <div>
              <div className="flex justify-between items-center border border-slate-600 rounded-lg ">
                <input
                  type={toggle.password ? "text" : "password"}
                  {...register("password", { required: true })}
                  placeholder="Password"
                  className="w-full p-3 rounded-l-lg"
                />

                <p
                  className="p-2"
                  onClick={() =>
                    setToggle((prev) => {
                      return {
                        ...prev,
                        password: !prev.password,
                      };
                    })
                  }
                >
                  {toggle.password ? "Hide" : "Show"}
                </p>
              </div>
              <p role="alert" className="text-xs text-red-500 pl-2 h-4">
                {errors.password && errors.password.message}
              </p>
            </div>

            {/* WORK: CONFIRM PASSWORD FIELD*/}
            <div>
              <div className="flex justify-between items-center border border-slate-600 rounded-lg">
                <input
                  type={toggle.confirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) => {
                      return (
                        value === getValues("password") ||
                        "Passwords do not match"
                      );
                    },
                  })}
                  placeholder="Confirm Password"
                  className="h-full w-full p-3 rounded-l-lg"
                />

                <p
                  className="p-2"
                  onClick={() =>
                    setToggle((prev) => {
                      return {
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      };
                    })
                  }
                >
                  {toggle.confirmPassword ? "Hide" : "Show"}
                </p>
              </div>

              <p role="alert" className="text-xs text-red-500 pl-2 h-4">
                {errors.confirmPassword && errors.confirmPassword.message}
              </p>
            </div>

            {/* WORK: MOBILE FIELD*/}
            {/* <div>
              <input
                type="text"
                {...register("mobile", {
                  required: true,
                  validate: (value) => {
                    const numericRegex = /^[0-9]+$/;
                    // The test method returns true if the inputString matches the regular expression

                    return (
                      (value.length === 10 && numericRegex.test(value)) ||
                      "Please check you mobile no again."
                    );
                  },
                })}
                placeholder="Mobile No."
                className="border border-slate-600 p-3 rounded-lg w-full"
              />
              <p role="alert" className="text-xs text-red-500 pl-2 h-4">
                {errors.mobile && errors.mobile.message}
              </p>
            </div> */}

            {/* WORK: SUBMIT BUTTON*/}
            <div className="my-auto">
              <input
                type="submit"
                className="border border-slate-600 p-3 rounded-lg bg-purple-300 font-semibold text-lg tracking-wide cursor-pointer w-full"
              />
            </div>
          </form>

          {/* WORK: GO TO LOGIN PAGE*/}

          <p>
            <Link to={`/login`}>Go to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
