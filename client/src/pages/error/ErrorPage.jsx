import { Link, useLocation } from "react-router-dom";

const ErrorPage = () => {
  const { state } = useLocation();

  const message =
    state?.message ||
    state?.errMsg ||
    "Something went Wrong. Please login again.";

  return (
    <div>
      <p>Error ErrorPage</p>
      <p className="text-3xl">{message}</p>
      <p>
        <Link to={`/login`}>Login</Link>
      </p>
      <p>
        <Link to={`/`}>Home</Link>
      </p>
    </div>
  );
};

export default ErrorPage;
