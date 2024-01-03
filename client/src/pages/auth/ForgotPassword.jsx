import { useEffect } from "react";
import UseForgotPassword from "../../hooks/mutation/UseForgotPassword";
import { useForm } from "react-hook-form";
import validator from "validator";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error, isSuccess } = UseForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const showErrorMessage = ({ message, time = 5000 } = {}) => {
    toast.error(message || "Somethings went Wrong !", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: time,
    });
  };
  const showSuccessMessage = ({ message, time = 5000 } = {}) => {
    toast.success(message || "Successful!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: time,
    });
  };

  useEffect(() => {
    if (isError) {
      showErrorMessage({ message: error?.message, time: 3000 });
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      showSuccessMessage();
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
  }, [isSuccess, navigate]);

  const onSubmit = (data) => {
    const { email } = data;
    mutate(email);
  };

  return (
    <>
      <section className="w-full h-screen flex justify-center items-center bg-color_1">
        <form
          className="h-[600px] w-[600px] bg-color_2 border border-color_3 text-color_4 flex flex-col justify-center items-start gap-4 px-8 rounded-xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full  rounded-xl">
            <div className="w-full h-12 rounded-xl border border-color_3 text-color_1">
              <input
                {...register("email", {
                  required: true,
                  validate: (value) => {
                    console.log(value);
                    return validator.isEmail(value);
                  },
                })}
                placeholder="Type your email "
                className="w-full h-full px-4 rounded-xl"
              />
            </div>

            <p
              role="alert"
              className="w-full h-4 mt-1 ml-2 text-red-200 text-xs "
            >
              {errors.email?.type === "required" && " Email is required"}
              {errors.email?.type === "validate" &&
                "Please provide a valid Email!"}
            </p>
          </div>
          <div className="w-full h-12 bg-color_1 border border-color_3 flex justify-center items-center rounded-xl">
            {isPending ? (
              <Loading hScreen={false} small={true} />
            ) : (
              <input type="submit" className="w-full h-full cursor-pointer" />
            )}
          </div>

          <p className="text-xs mt-10">
            An One-Time-Password will be send to your email. These password only
            be used once. After successful login, change your password{" "}
            <strong>immediately</strong> from you profile section.
          </p>
        </form>
      </section>
      <ToastContainer />
    </>
  );
};

export default ForgotPassword;
