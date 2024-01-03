/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import UseContinuousCheck from "../../../../hooks/query/UseContinuousCheck";
import changeDate from "../../../../utils/javaScript/changeDate";
import UseSocket from "../../../../hooks/socket/UseSocket";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Loading from "../../../../components/Loading";
import ChatMediaMessage from "./components/ChatMediaMessage";
import environment from "../../../../utils/environment";
import { useSelector } from "react-redux";
import { roomsState } from "../../../../redux/slice/roomSlice";
import UseRoomChat from "../../../../hooks/query/UseRoomChat";
import ChatRoomHeader from "./components/ChatRoomHeader";

const SERVER_URL = environment.SERVER_URL;

const ChatRoom = () => {
  const { data: user } = UseContinuousCheck(true);
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
      emit("chat", res, (err) => {
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
          messageList.map((obj, i) => {
            let {
              message,
              sender: { _id: id, name },
              updatedAt,
              isPhoto,
              photo,
            } = obj;

            photo = `${SERVER_URL}/${photo}`;

            if (!isPhoto) {
              if (id !== user?.id) {
                return (
                  <div
                    key={i}
                    className={`flex items-end gap-2 w-max  self-end `}
                  >
                    <p className="text-xs mb-1">{changeDate(updatedAt)}</p>
                    <div className="p-2 px-4 border border-color_3 text-color_1 bg-color_3 rounded-2xl max-w-96 ">
                      <p className="font-extrabold tracking-wide text-color_1 ">
                        {name.split(" ")[0]}
                      </p>
                      <p className="break-all font-thin">{message}</p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={i} className={`flex items-end gap-2 w-max `}>
                    <div className="p-2 px-4 border border-color_3 rounded-2xl max-w-96">
                      <p className="font-extrabold tracking-wide text-color_3 ">
                        {name.split(" ")[0]}
                      </p>

                      <p className="font-thin break-all">{message}</p>
                    </div>
                    <p className="text-xs mb-1">{changeDate(updatedAt)}</p>
                  </div>
                );
              }
            }

            if (isPhoto) {
              if (id !== user?.id) {
                return (
                  <div
                    key={i}
                    className={`flex items-end gap-2 w-max self-end `}
                  >
                    <p className="text-xs mb-1">{changeDate(updatedAt)}</p>

                    <div className="p-1 border border-color_3 text-color_1 bg-color_3 rounded-xl max-w-96 ">
                      <p className="font-extrabold tracking-wide text-color_1 px-3 py-2">
                        {name.split(" ")[0]}
                      </p>
                      <img
                        src={photo}
                        alt="photo"
                        className="w-full rounded-b-xl"
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={i} className={`flex items-end gap-2 w-max `}>
                    <div className="p-1 border border-color_3 rounded-2xl max-w-96">
                      <p className="font-extrabold tracking-wide text-color_3 px-3 py-2">
                        {name.split(" ")[0]}
                      </p>
                      <img
                        src={photo}
                        alt="photo"
                        className="w-full rounded-xl"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-xs mb-1">{changeDate(updatedAt)}</p>
                  </div>
                );
              }
            }
          })
        ) : (
          <p>No chat available</p>
        )}
      </div>

      {/* MARK: INPUT CHAT BOX */}
      <div className="w-full top_box_shadow bottom-0 border-t border-color_2 py-2 px-4 pr-10 h-14 flex justify-between gap-4 items-center">
        <div className="w-10 h-full">
          <ChatMediaMessage activeRoom={activeRoom} />
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
