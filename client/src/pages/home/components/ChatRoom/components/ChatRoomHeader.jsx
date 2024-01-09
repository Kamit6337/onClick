import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetActiveRoom,
  roomsState,
} from "../../../../../redux/slice/roomSlice";
import { Icons } from "../../../../../assets/icons";
import UseContinuousCheck from "../../../../../hooks/query/UseContinuousCheck";
import OnClickOutside from "../../../../../lib/onClickOutside";
import { toggleUpdateGroupChatForm } from "../../../../../redux/slice/toggleSlice";
import DeleteSingleChat from "../../../../../hooks/mutation/DeleteSingleChat";
import DeleteGroupChat from "../../../../../hooks/mutation/DeleteGroupChat";
import Toastify from "../../../../../lib/Toastify";

const ChatRoomHeader = () => {
  const dispatch = useDispatch();
  const { data: user } = UseContinuousCheck(true);
  const { rooms, activeRoom } = useSelector(roomsState);
  const [toggleOptions, setToggleOptions] = useState(false);
  const [activeRoomDetail, setActiveRoomDetail] = useState(null);
  const [deleteOption, setDeleteOption] = useState("Delete");
  const { ToastContainer, showErrorMessage } = Toastify();

  const {
    mutate: mutateSingleChat,
    error: errorSingleChat,
    reset: resetSingleChat,
  } = DeleteSingleChat(activeRoom);
  const {
    mutate: mutateGroupChat,
    error: errorGroupChat,
    reset: resetGroupChat,
  } = DeleteGroupChat(activeRoom);
  useEffect(() => {
    if (activeRoom) {
      const findRoom = rooms?.find((obj) => obj._id === activeRoom);

      if (findRoom?.isGroupChat && findRoom.admin._id !== user._id) {
        setDeleteOption("Leave Group");
      }

      setActiveRoomDetail(findRoom);
    }
  }, [activeRoom, rooms, user]);

  useEffect(() => {
    if (errorGroupChat) {
      showErrorMessage({ message: errorGroupChat.message, time: 5000 });
      setTimeout(() => {
        resetGroupChat();
      }, 5000);
    }

    if (errorSingleChat) {
      showErrorMessage({ message: errorSingleChat.message, time: 5000 });
      setTimeout(() => {
        resetSingleChat();
      }, 5000);
    }
  }, [
    errorSingleChat,
    errorGroupChat,
    showErrorMessage,
    resetGroupChat,
    resetSingleChat,
  ]);

  const handleDelete = () => {
    console.log("delete room");
    dispatch(resetActiveRoom());
    if (activeRoomDetail.isGroupChat) {
      mutateGroupChat(activeRoom);
    } else {
      mutateSingleChat(activeRoom);
    }
  };

  const success = () => {
    setToggleOptions(false);
  };

  const { ref: optionRef } = OnClickOutside(success);

  return (
    <>
      <div className="relative w-full h-14 bottom_box_shadow  flex justify-between items-center px-4 text-color_4 border-b border-color_3">
        {activeRoomDetail?.isGroupChat ? (
          <>
            <div className="flex gap-2 items-center">
              <p>{activeRoomDetail.name}</p>
              <p className="text-xs">
                {activeRoomDetail.members.length} members
              </p>
            </div>
            <p>Total Chat : {activeRoomDetail?.chats.length}</p>
            <div
              className="rounded-full hover:bg-color_2 cursor-pointer p-2"
              onClick={() => setToggleOptions((prev) => !prev)}
              ref={optionRef}
            >
              <Icons.options className="text-xl" />
            </div>
          </>
        ) : (
          <>
            <p>
              {activeRoomDetail?.members?.find((id) => id !== user.id).name}
            </p>
            <p>Total Chat : {activeRoomDetail?.chats.length}</p>
            <div
              className="rounded-full hover:bg-color_2 cursor-pointer p-2"
              onClick={() => setToggleOptions((prev) => !prev)}
              ref={optionRef}
            >
              <Icons.options className="text-xl " />
            </div>
          </>
        )}

        {toggleOptions && (
          <div className="absolute bg-color_2 z-50 right-0 top-full -mt-1 mr-6 border border-color_3 rounded-xl">
            <p className="px-6 py-3 rounded-t-xl border-b border-color_3 hover:bg-color_1/80 cursor-pointer">
              Info
            </p>
            {activeRoomDetail?.isGroupChat && (
              <p
                className="px-6 py-3 border-b border-color_3 hover:bg-color_1/80 cursor-pointer"
                onClick={() => dispatch(toggleUpdateGroupChatForm(true))}
              >
                Update
              </p>
            )}
            <p
              className="px-6 py-3 rounded-b-xl hover:bg-color_1/80 cursor-pointer"
              onClick={handleDelete}
            >
              {deleteOption}
            </p>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default ChatRoomHeader;
