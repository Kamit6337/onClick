import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { roomsState } from "../../../../../redux/slice/roomSlice";
import { Icons } from "../../../../../assets/icons";
import UseContinuousCheck from "../../../../../hooks/query/UseContinuousCheck";
import OnClickOutside from "../../../../../lib/onClickOutside";
import { toggleUpdateGroupChatForm } from "../../../../../redux/slice/toggleSlice";

const ChatRoomHeader = () => {
  const dispatch = useDispatch();
  const { data: user } = UseContinuousCheck(true);
  const { activeRoomChats, activeRoomDetail } = useSelector(roomsState);
  const [toggleOptions, setToggleOptions] = useState(false);

  const success = () => {
    setToggleOptions(false);
  };

  const { ref: optionRef } = OnClickOutside(success);

  return (
    <div className="relative w-full h-14 bottom_box_shadow  flex justify-between items-center px-4 text-color_4 border-b border-color_3">
      {activeRoomDetail?.isGroupChat ? (
        <>
          <div className="flex gap-2 items-center">
            <p>{activeRoomDetail.name}</p>
            <p className="text-xs">{activeRoomDetail.members.length} members</p>
          </div>
          <p>Total Chat : {activeRoomChats.length}</p>
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
          <p>{activeRoomDetail?.members?.find((id) => id !== user.id).name}</p>
          <p>Total Chat : {activeRoomChats.length}</p>
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
          <p className="px-6 py-3 rounded-b-xl hover:bg-color_1/80 cursor-pointer">
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatRoomHeader;
