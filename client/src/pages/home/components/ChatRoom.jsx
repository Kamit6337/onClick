/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import UseContinuousCheck from "../../../hooks/query/UseContinuousCheck";
import changeDate from "../../../utils/javaScript/changeDate";
import UseSocket from "../../../hooks/socket/UseSocket";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import UseRoomChats from "../../../hooks/query/UseRoomChats";
import Loading from "../../../components/Loading";
import ChatMediaMessage from "../../../components/material_UI/ChatMediaMessage";
import environment from "../../../utils/environment";

const SERVER_URL = environment.SERVER_URL;

const ChatRoom = ({ activeRoom, list }) => {
  const { data: user } = UseContinuousCheck(true);
  const { socket, emit, on, off } = UseSocket();
  const divRef = useRef(null);

  const { isLoading, isError, error, data } = UseRoomChats({
    toggle: false,
    id: activeRoom,
    page: 1,
  });

  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    setMessageList(list || []);
  }, [list]);

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

  useEffect(() => {
    const chatArg = (arg) => {
      const { room } = arg;
      if (room === activeRoom) {
        setMessageList((prev) => [...prev, arg]);
      }
    };

    const imageArg = (arg) => {
      const { room } = arg;
      console.log("arg", arg);

      if (room === activeRoom) {
        setMessageList((prev) => [...prev, arg]);
      }
    };

    on("chatMsg", chatArg);
    on("image", imageArg);

    return () => {
      // Cleanup: Remove the listener when the component unmounts
      off("chatMsg", chatArg);
      off("image", imageArg);
    };
  }, [socket, on, off, activeRoom]);

  // useEffect(() => {
  //   if (divRef.current) {
  //     const divHeight = divRef.current.scrollHeight;

  //     divRef.current.scrollTo({
  //       top: divHeight,
  //       behavior: "smooth",
  //     });
  //   }
  // }, [messageList]);

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

      if (socket) {
        emit("chat", res, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
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
      <div className="flex-1 h-full">
        <p>Please Select a chat </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative flex-1 h-full">
      {/* WORK: CHAT MESSAGES AREA */}
      <div
        className=" overflow-y-scroll h-full p-6 flex flex-col gap-4"
        ref={divRef}
        style={{ height: "calc(100% - 56px)" }}
      >
        {messageList?.length > 0 ? (
          messageList.map((obj, i) => {
            console.log("messga", obj);

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
                    className={`flex items-end gap-1 w-max  self-end `}
                  >
                    <p className="text-xs mb-1">{changeDate(updatedAt)}</p>

                    <p className="text-sm"></p>
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
                  <div key={i} className={`flex items-end gap-1 w-max `}>
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

      {/* WORK: INPUT CHAT BOX */}
      <div className="absolute z-10 w-full bottom-0 border-t border-color_2 py-2 px-4 pr-10 h-14 flex justify-between gap-4 items-center">
        <div>
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
