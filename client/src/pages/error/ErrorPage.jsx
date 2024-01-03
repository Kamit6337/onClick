import { Link, useLocation, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const message =
    state?.message ||
    state?.errMsg ||
    "Something went Wrong. Please login again.";

  return (
    <div className="w-full h-screen flex justify-center items-center bg-color_1">
      <div className="h-[400px] w-[600px] bg-color_2 box_shadow rounded-xl border border-color_3 flex flex-col justify-between p-6">
        <p className="text-lg ">Error Message :</p>

        <p className="text-2xl text-red-200 h-full mt-10">{message}</p>

        <div className="flex justify-between gap-8 items-center text-lg font-semibold tracking-wide">
          <p
            className="rounded-xl border border-color_3 py-4 flex-1 flex justify-center bg-color_1 cursor-pointer hover:bg-color_1/85"
            onClick={() => navigate("/login")}
          >
            Login
          </p>
          <p
            className="rounded-xl border border-color_3  py-4 flex-1 flex justify-center bg-color_1 cursor-pointer hover:bg-color_1/85"
            onClick={() => navigate("/")}
          >
            Home
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
