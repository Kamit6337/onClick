import { useEffect, useState } from "react";
import UseUserRooms from "../../../../hooks/query/UseUserRooms";
import UseSocket from "../../../../hooks/socket/UseSocket";
import UseContinuousCheck from "../../../../hooks/query/UseContinuousCheck";
import { useDispatch } from "react-redux";
import { setActiveRoom } from "../../../../redux/slice/roomSlice";
import ChatType from "./components/ChatType";
import environment from "../../../../utils/environment";

const SERVER_URL = environment.SERVER_URL;

/* eslint-disable react/prop-types */
const SidebarMenu = () => {
  const { data, refetch } = UseUserRooms(true);
  const { socket, on, off } = UseSocket();
  const { data: user } = UseContinuousCheck(true);
  const [roomSelected, setRoomSelected] = useState(null);
  const dispatch = useDispatch();
  const rooms = data?.data;

  useEffect(() => {
    const roomArg = (arg) => {
      const { members } = arg;

      if (members?.includes(user.id)) {
        refetch();
      }
    };

    on("singleRoomCreated", roomArg);

    return () => {
      // Cleanup: Remove the listener when the component unmounts
      off("singleRoomCreated", roomArg);
    };
  }, [socket, on, off, refetch, user]);

  const showRoomChats = (roomId) => {
    setRoomSelected(roomId);
    dispatch(setActiveRoom(roomId));
  };

  return (
    <div
      className="relative w-full h-full "
      // style={{ height: "calc(100% - 56px)" }}
    >
      {rooms.length > 0 ? (
        rooms.map((room, i) => {
          const { id, name, members, photo, isGroupChat } = room;

          if (!isGroupChat) {
            const friend = members.find((id) => id !== user.id);

            const {
              name: friendName,
              email: friendEmail,
              photo: friendPhoto,
            } = friend;

            const userPhoto = `${SERVER_URL}/${friendPhoto}`;

            return (
              <div
                key={i}
                className={`w-full cursor-pointer hover:bg-color_3 hover:text-color_1 pl-6 border-b border-color_2 p-3 flex items-center gap-4 ${
                  id === roomSelected && "bg-color_3 text-color_1"
                }`}
                onClick={() => showRoomChats(id)}
              >
                <img
                  src={userPhoto}
                  alt="profile"
                  loading="lazy"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div>{friendName}</div>
                  <div className="text-xs">{friendEmail}</div>
                </div>
              </div>
            );
          }

          if (isGroupChat) {
            const groupPhoto = `${SERVER_URL}/${photo}`;

            return (
              <div
                key={i}
                className={`w-full cursor-pointer hover:bg-color_3 hover:text-color_1 pl-6 border-b border-color_2 p-3 flex items-center gap-4 ${
                  id === roomSelected && "bg-color_3 text-color_1"
                }`}
                onClick={() => showRoomChats(id)}
              >
                <img
                  src={groupPhoto}
                  alt="profile"
                  loading="lazy"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div>{name}</div>
                  <div className="text-xs">{members.length} members</div>
                </div>
              </div>
            );
          }
        })
      ) : (
        <div className="w-full h-full flex flex-col justify-center pl-6">
          <p className="text-xl font-semibold tracking-wide">Sorry,</p>
          <p className="mt-1 mb-5">No chat available</p>
          <p className="text-xs">Search the user to create chat.</p>
        </div>
      )}
      <div className="absolute z-50 bottom-0 mb-8 ml-8">
        <ChatType />
      </div>
    </div>
  );
};

export default SidebarMenu;
