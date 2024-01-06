/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import UseSocket from "../../../../hooks/socket/UseSocket";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Loading from "../../../../components/Loading";
import ChatMediaMessage from "./components/ChatMediaMessage";
import { useSelector } from "react-redux";
import { roomsState } from "../../../../redux/slice/roomSlice";
import UseRoomChat from "../../../../hooks/query/UseRoomChat";
import ChatRoomHeader from "./components/ChatRoomHeader";
import DifferentChatMessages from "./components/DifferentChatMessages";

const ChatRoom = () => {
  const { emit } = UseSocket();
  const divRef = useRef(null);
  const { activeRoom, activeRoomChats } = useSelector(roomsState);

  const [messageList, setMessageList] = useState([]);

  const { isLoading, isError, error, data } = UseRoomChat({
    toggle: false,
    id: activeRoom,
    page: 1,
  });

  useEffect(() => {
    if (activeRoom) {
      setMessageList(activeRoomChats);
    }
  }, [activeRoom, activeRoomChats]);

  useEffect(() => {
    if (data?.data) {
      setMessageList((prev) => [...data.data, ...prev]);
    }
  }, [data]);

  useLayoutEffect(() => {
    if (divRef.current) {
      const divHeight = divRef.current.scrollHeight;

      divRef.current.scrollTo({
        top: divHeight,
        behavior: "auto", // Use "auto" for instant move
      });
    }
  }, [messageList]);

  const { register, getValues, reset } = useForm({
    defaultValues: {
      inputChat: "",
    },
  });

  if (isError) {
    return <p>{error.message}</p>;
  }

  const sendChat = (roomId) => {
    const { inputChat } = getValues();

    if (inputChat) {
      const res = {
        message: inputChat,
        room: roomId,
      };
      emit("chatMessage", res, (err) => {
        if (err) {
          console.log(err);
        }
      });

      reset({ inputChat: "" });
    }
  };

  const sendChatFromInput = (e, roomId) => {
    if (e.key === "Enter") {
      sendChat(roomId);
    }
  };

  if (!activeRoom) {
    return (
      <div className="w-full h-full flex justify-center items-center text-xl font-semibold tracking-wider">
        <p>Please Select a chat </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* MARK: HEADER */}
      <ChatRoomHeader />
      {/* MARK: CHAT MESSAGES AREA */}
      <div
        className=" overflow-y-scroll p-6 flex flex-col gap-4"
        ref={divRef}
        style={{ height: "calc(100% - 112px)" }}
      >
        {messageList?.length > 0 ? (
          messageList.map((chat, i) => {
            return <DifferentChatMessages key={i} chat={chat} />;
          })
        ) : (
          <p className="h-full w-full flex justify-center items-center text-xl font-semibold tracking-wide">
            No chat available
          </p>
        )}
      </div>

      {/* MARK: INPUT CHAT BOX */}
      <div className="w-full top_box_shadow bottom-0 border-t border-color_2 py-2 px-4 pr-10 h-14 flex justify-between gap-4 items-center">
        <div className="w-10 h-full">
          <ChatMediaMessage />
        </div>
        <div className="w-full">
          <input
            type="text"
            {...register("inputChat", {
              pattern: /^[A-Za-z]+$/i,
            })}
            spellCheck="false"
            autoCorrect="off"
            autoComplete="off"
            onKeyDown={(e) => sendChatFromInput(e, activeRoom)}
            placeholder="Chat Message"
            className="text-color_1  border border-color_2 rounded-3xl p-1 px-6 w-full"
          />
        </div>
        <div
          // disabled={!getValues("inputChat")}
          onClick={() => sendChat(activeRoom)}
          className="cursor-pointer bg-color_1 text-color_4 border px-5 py-1 rounded-3xl"
        >
          Send
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
