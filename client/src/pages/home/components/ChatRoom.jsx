import { useForm } from "react-hook-form";
import UseContinuousCheck from "../../../hooks/query/UseContinuousCheck";
import changeDate from "../../../utils/javaScript/changeDate";
import UseSocket from "../../../hooks/socket/UseSocket";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import UseRoomChats from "../../../hooks/query/UseRoomChats";
import Loading from "../../../components/Loading";

/* eslint-disable react/prop-types */
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

  // useEffect(() => {
  //   if (divRef.current) {
  //     setTimeout(() => {
  //       // divRef.current.scrollTop = divRef.current.scrollHeight;
  //       const divHeight = divRef.current.scrollHeight;

  //       requestAnimationFrame(() => {
  //         divRef.current.scrollTop = divHeight;
  //       });
  //     }, 1000);
  //   }
  // }, [activeRoom]);

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

    if (socket) {
      on("chatMsg", chatArg);
    }

    return () => {
      // Cleanup: Remove the listener when the component unmounts
      off("chatMsg", chatArg);
    };
  }, [socket, on, off, activeRoom]);

  useEffect(() => {
    if (divRef.current) {
      const divHeight = divRef.current.scrollHeight;

      divRef.current.scrollTo({
        top: divHeight,
        behavior: "smooth",
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

  return (
    <div className="relative flex-1 h-full">
      {!activeRoom ? (
        <p>Please Select a chat </p>
      ) : isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className="h-full">
          {/* WORK: CHAT MESSAGES AREA */}
          <div
            className=" overflow-y-scroll h-full p-6 flex flex-col gap-4"
            ref={divRef}
            style={{ height: "calc(100% - 56px)" }}
          >
            {messageList?.length > 0 ? (
              messageList.map((obj, i) => {
                const {
                  message,
                  sender: { _id: id, name },
                  updatedAt,
                } = obj;

                return (
                  <>
                    {id !== user?.id ? (
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
                    ) : (
                      <div key={i} className={`flex items-end gap-1 w-max `}>
                        <div className="p-2 px-4 border border-color_3 rounded-2xl max-w-96">
                          <p className="font-extrabold tracking-wide text-color_3 ">
                            {name.split(" ")[0]}
                          </p>
                          <p className="font-thin break-all">{message}</p>
                        </div>
                        <p className="text-xs mb-1">{changeDate(updatedAt)}</p>
                      </div>
                    )}
                  </>
                );
              })
            ) : (
              <p>No chat available</p>
            )}
          </div>

          {/* WORK: INPUT CHAT BOX */}
          <div className="absolute z-10 w-full bottom-0 border-t border-color_2 py-2 px-4 pr-10 h-14 flex justify-between gap-4 items-center">
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
      )}
    </div>
  );
};

export default ChatRoom;
