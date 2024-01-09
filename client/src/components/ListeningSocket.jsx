import { useEffect } from "react";
import { updateRooms } from "../redux/slice/roomSlice";
import UseSocket from "../hooks/socket/UseSocket";
import { useDispatch } from "react-redux";
import UseUserRooms from "../hooks/query/UseUserRooms";
import UseContinuousCheck from "../hooks/query/UseContinuousCheck";

const ListeningSocket = () => {
  const dispatch = useDispatch();
  const { on, off, socket } = UseSocket();
  const { refetch } = UseUserRooms(true);
  const { data: user } = UseContinuousCheck();

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
      const findUser = members?.includes(user._id);
      if (findUser) {
        refetch();
      }
    };

    const groupRoomArg = (arg) => {
      const { members } = arg;
      const findUser = members?.includes(user._id);

      if (findUser) {
        refetch();
      }
    };

    const deleteRoomArg = (arg) => {
      const { members } = arg;
      const findUser = members?.includes(user._id);

      if (findUser) {
        refetch();
      }
    };

    const updateGroupRoomArg = (arg) => {
      const { members } = arg;
      const findUser = members?.includes(user._id);

      if (findUser) {
        refetch();
      }
    };

    on("chatMessage", chatMessageArg);
    on("chatFile", chatFileArg);
    on("singleRoom", singleRoomArg);
    on("groupRoom", groupRoomArg);
    on("deleteRoom", deleteRoomArg);
    on("updateGroupRoom", updateGroupRoomArg);

    return () => {
      // Cleanup: Remove the listener when the component unmounts
      off("chatMessage", chatMessageArg);
      off("chatFile", chatFileArg);
      off("singleRoom", singleRoomArg);
      off("groupRoom", groupRoomArg);
      off("deleteRoom", deleteRoomArg);
      off("updateGroupRoom", updateGroupRoomArg);
    };
  }, [socket, on, off, dispatch, refetch, user]);

  return null;
};

export default ListeningSocket;
