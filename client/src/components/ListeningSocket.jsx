import { useEffect } from "react";
import { updateRooms } from "../redux/slice/roomSlice";
import UseSocket from "../hooks/socket/UseSocket";
import { useDispatch } from "react-redux";
import UseUserRooms from "../hooks/query/UseUserRooms";
import UseContinuousCheck from "../hooks/query/UseContinuousCheck";
import Toastify from "../lib/Toastify";

const ListeningSocket = () => {
  const dispatch = useDispatch();
  const { on, off, socket } = UseSocket();
  const { refetch } = UseUserRooms(true);
  const { data: user } = UseContinuousCheck();
  const {
    ToastContainer,
    showErrorMessage,
    showAlertMessage,
    showSuccessMessage,
  } = Toastify();

  useEffect(() => {
    const chatMessageArg = (arg) => {
      console.log("chat message", arg);
      dispatch(updateRooms(arg));
    };

    const chatFileArg = (arg) => {
      console.log("chat file", arg);
      dispatch(updateRooms(arg));
    };

    const singleRoomArg = (arg) => {
      const { members } = arg;
      const findUser = members?.find((id) => id === user._id);
      if (findUser) {
        refetch();
      }
    };

    const groupRoomArg = (arg) => {
      const { members } = arg;
      const findUser = members?.find((id) => id === user._id);

      if (findUser) {
        refetch();
      }
    };

    const disconnectArg = () => {
      showErrorMessage({
        message: "Socket disconnected",
        position: "top-center",
      });
    };
    const reconnectingArg = (attemptNumber) => {
      showAlertMessage({
        message: `Socket in reconnecting : ${attemptNumber}`,
        position: "top-center",
      });
    };
    const reconnectArg = () => {
      showSuccessMessage({
        message: `Successfully Reconnect`,
        position: "top-center",
      });
    };

    on("chatMessage", chatMessageArg);
    on("chatFile", chatFileArg);
    on("singleRoom", singleRoomArg);
    on("groupRoom", groupRoomArg);
    on("disconnect", disconnectArg);
    on("reconnecting", reconnectingArg);
    on("reconnect", reconnectArg);

    return () => {
      // Cleanup: Remove the listener when the component unmounts
      off("chatMessage", chatMessageArg);
      off("chatFile", chatFileArg);
      off("singleRoom", singleRoomArg);
      off("groupRoom", groupRoomArg);
      off("disconnect", disconnectArg);
      off("reconnecting", reconnectingArg);
      off("reconnect", reconnectArg);
    };
  }, [
    socket,
    on,
    off,
    dispatch,
    refetch,
    user,
    showSuccessMessage,
    showAlertMessage,
    showErrorMessage,
  ]);

  return { ToastContainer };
};

export default ListeningSocket;
