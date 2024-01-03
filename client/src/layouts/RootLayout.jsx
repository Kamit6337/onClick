import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import isUserLoggedIn from "../utils/crypto/isUserLoggedIn";
import removeCookies from "../utils/crypto/removeCookies";
import UseContinuousCheck from "../hooks/query/UseContinuousCheck";
import UseAllUser from "../hooks/query/UseAllUser";
import UseUserRooms from "../hooks/query/UseUserRooms";
import Loading from "../components/Loading";
import UseRoomChats from "../hooks/query/UseRoomChats";

const RootLayout = () => {
  const navigate = useNavigate();
  const { loggedIn } = isUserLoggedIn();

  const { isError, error } = UseContinuousCheck(loggedIn);
  const { isLoading: usersIsLoading, isError: usersIsError } =
    UseAllUser(loggedIn);

  const {
    isLoading: roomsIsLoading,
    isError: roomssIsError,
    isSuccess,
    data,
  } = UseUserRooms(loggedIn);

  const {
    isLoading: roomChatsIsLoading,
    isError: roomChatsIsError,
    error: roomChatsError,
  } = UseRoomChats({ toggle: isSuccess, list: data?.data });

  useEffect(() => {
    if (isError || usersIsError || roomssIsError || roomChatsIsError) {
      navigate("/error", {
        state: {
          errMsg:
            error?.message ||
            roomChatsError?.message ||
            "Something went wrong. Please login Again",
        },
      });
      removeCookies();
    }
  }, [
    isError,
    usersIsError,
    roomssIsError,
    error,
    navigate,
    roomChatsIsError,
    roomChatsError,
  ]);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn, navigate]);

  if (!loggedIn) return;

  if (usersIsLoading || roomsIsLoading || roomChatsIsLoading) {
    return <Loading />;
  }

  return (
    <main className="max-w-full h-screen">
      <Outlet />
    </main>
  );
};

export default RootLayout;
