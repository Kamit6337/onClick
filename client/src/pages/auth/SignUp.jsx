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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SERVER_URL = environment.SERVER_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState({
    password: false,
    confirmPassword: false,
  });

  const { isPending, mutate, error, isError, isSuccess } = useMutation({
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

  useEffect(() => {
    if (isError) {
      showErrorMessage({ message: error.message });
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      createCookies();
      showSuccessMessage({ message: "Successfully Logged In.", time: 2000 });

      setTimeout(() => {
        navigate("/");
      }, 2000);
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
    <div className="h-screen w-full flex flex-col gap-2 justify-center items-center bg-color_2">
      {/* NOTE: THE CENTER PAGE */}
      <div className="bg-color_1 box_shadow  h-[600px] w-[600px] border border-color_3 rounded-xl  justify-between items-center   flex flex-col p-6">
        {/* WORK: FORM AND GO TO LOGIN BUTTON*/}
        <p className="text-xl font-bold tracking-wide">Sign Up</p>

        {/* WORK: SIGNUP FORM*/}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full text-color_1"
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
            <div className="h-12 flex justify-between items-center border border-slate-600 rounded-lg ">
              <input
                type={toggle.password ? "text" : "password"}
                {...register("password", { required: true })}
                placeholder="Password"
                className="h-full w-full px-3 rounded-l-lg"
              />

              <div
                className="w-20 flex justify-center items-center text-color_4"
                onClick={() =>
                  setToggle((prev) => {
                    return {
                      ...prev,
                      password: !prev.password,
                    };
                  })
                }
              >
                <p>{toggle.password ? "Hide" : "Show"}</p>
              </div>
            </div>
            <p role="alert" className="text-xs text-red-500 pl-2 h-4">
              {errors.password && errors.password.message}
            </p>
          </div>

          {/* WORK: CONFIRM PASSWORD FIELD*/}
          <div>
            <div className="h-12 flex justify-between items-center border border-slate-600 rounded-lg">
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
                className="h-full w-full px-3 rounded-l-lg"
              />

              <div
                className="w-20 flex justify-center items-center text-color_4"
                onClick={() =>
                  setToggle((prev) => {
                    return {
                      ...prev,
                      confirmPassword: !prev.confirmPassword,
                    };
                  })
                }
              >
                <p>{toggle.confirmPassword ? "Hide" : "Show"}</p>
              </div>
            </div>

            <p role="alert" className="text-xs text-red-500 pl-2 h-4">
              {errors.confirmPassword && errors.confirmPassword.message}
            </p>
          </div>

          {/* WORK: SUBMIT BUTTON*/}
          <div className="flex flex-col gap-1">
            <div className="h-12 border border-slate-600 rounded-lg bg-purple-300 font-semibold text-lg tracking-wide cursor-pointer w-full text-color_1">
              {isPending ? (
                <Loading hScreen={false} small={true} />
              ) : (
                <input type="submit" className="w-full h-full cursor-pointer" />
              )}
            </div>
            <p className="text-sm ml-2 text-color_4">
              Already had account
              <span className="ml-2 underline">
                <Link to={`/login`}>Login</Link>
              </span>
            </p>
          </div>
        </form>

        {/* WORK: GO TO LOGIN PAGE*/}
        <div
          className="border border-slate-500 rounded-lg p-3 w-full cursor-pointer bg-red-500 font-semibold  tracking-wide text-center"
          onClick={googleOAuth}
        >
          Login in Google
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
