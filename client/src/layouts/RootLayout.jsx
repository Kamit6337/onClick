import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import isUserLoggedIn from "../utils/crypto/isUserLoggedIn";
import removeCookies from "../utils/crypto/removeCookies";
import UseContinuousCheck from "../hooks/UseContinuousCheck";
import UseAllUser from "../hooks/UseAllUser";
import UseUserRooms from "../hooks/UseUserRooms";
import Loading from "../components/Loading";

const RootLayout = () => {
  const navigate = useNavigate();
  const { loggedIn } = isUserLoggedIn();

  const { isError, error } = UseContinuousCheck(loggedIn);
  const { isLoading: usersIsLoading, isError: usersIsError } =
    UseAllUser(loggedIn);
  const { isLoading: roomsIsLoading, isError: roomssIsError } =
    UseUserRooms(loggedIn);

  useEffect(() => {
    if (isError || usersIsError || roomssIsError) {
      navigate("/error", {
        state: {
          errMsg: error?.message || "Something went wrong. Please login Again",
        },
      });
      removeCookies();
    }
  }, [isError, usersIsError, roomssIsError, error, navigate]);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn, navigate]);

  if (!loggedIn) return;

  if (usersIsLoading || roomsIsLoading) {
    return <Loading />;
  }

  return (
    <main className="max-w-full h-screen">
      <Outlet />
    </main>
  );
};

export default RootLayout;
