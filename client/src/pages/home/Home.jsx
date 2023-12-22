import { useMutation } from "@tanstack/react-query";
import UseAllUser from "../../hooks/UseAllUser";
import UseOAuthLogin from "../../hooks/UseOAuthLogin";
import UseUserRooms from "../../hooks/UseUserRooms";
import UseCacheData from "../../hooks/useCacheData";
import { postReq } from "../../utils/api/api";
import { useEffect, useRef, useState } from "react";
import UseContinuousCheck from "../../hooks/UseContinuousCheck";
import io from "socket.io-client";
import environment from "../../utils/environment";
import { useForm } from "react-hook-form";

let socket;

const Home = () => {
  const divRef = useRef(null);
  const signupData = UseCacheData(["signup"]);
  const loginData = UseCacheData(["login"]);
  const { data } = UseOAuthLogin(false);
  const { data: roomsData, refetch } = UseUserRooms(true);
  const { data: users } = UseAllUser(true);
  const { data: userData } = UseContinuousCheck(true);

  const user = loginData || signupData || data || userData;

  const [searchUsers, setSearchUsers] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  const rooms = roomsData?.rooms || [];

  const {
    register,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchName: "",
      inputChat: "",
    },
  });

  const { mutate, isError, isPending, error, isSuccess } = useMutation({
    mutationKey: ["createSingleRoom"],
    mutationFn: (id) => postReq("/room", { id }),
    retry: 3,
  });

  useEffect(() => {
    socket = io(environment.SERVER_URL, {
      withCredentials: true,
    });

    const roomList = roomsData?.roomList || [];

    const joinConnectionArg = (arg) => {
      if (arg === "ok") {
        if (roomList.length > 0) {
          socket.emit("joinRoom", { rooms: roomList }, (err, response) => {
            if (err) {
              console.log("error", err);
              console.log("response", response);
            }
          });
        }
      }
    };

    socket.on("joinConnection", joinConnectionArg);

    return () => {
      // Cleanup: Remove the listeners when the component unmounts
      socket.off("joinConnection", joinConnectionArg);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        // Clicked outside the div, hide the div

        reset({ searchName: "" });

        setSearchUsers([]);
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [reset]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    const chatArg = (arg) => {
      if (arg) {
        setMessageList((prev) => [...prev, arg]);
        console.log("message", arg);
      }
    };

    socket.on("chatMsg", chatArg);

    return () => {
      // Cleanup: Remove the listener when the component unmounts
      socket.off("chatMsg", chatArg);
    };
  }, [socket]);

  const handleSearch = (e) => {
    const { value } = e.target;
    if (!value) {
      setSearchUsers([]);
      return;
    }

    const findUsers = users?.data.filter((user) => {
      return user.name.toLowerCase().startsWith(value.toLowerCase());
    });

    setSearchUsers(findUsers);
  };

  const handleCreateSingleRoom = (id) => {
    setSearchUsers([]);
    mutate(id);
  };

  const sendChat = (roomId) => {
    const { inputChat } = getValues();

    const res = {
      message: inputChat,
      room: roomId,
    };

    socket.emit("chat", res, (err, response) => {
      if (err) {
        console.log(err);
      }
    });

    reset({ inputChat: "" });
  };

  const sendChatFromInput = (e, roomId) => {
    if (e.key === "Enter") {
      sendChat(roomId);
    }
  };

  return (
    <section className="w-full h-full flex flex-col">
      <header className="w-full basis-14 border-b border-slate-400 flex justify-between items-center">
        {/* WORK: SEARCH DIV */}
        <div className="relative w-72  flex justify-center items-center px-4">
          <input
            type="text"
            {...register("searchName", {
              pattern: /^[A-Za-z]+$/i,
            })}
            spellCheck="false"
            autoCorrect="off"
            autoComplete="off"
            onChange={handleSearch}
            placeholder="Search User"
            className="border border-slate-300 rounded-3xl p-1 pl-4 w-full"
          />

          {/* WORK: SEARCHED USERS */}
          <div className="absolute top-full mt-1 left-0 w-full z-50 px-4">
            <div className="bg-slate-100 rounded-lg" ref={divRef}>
              {searchUsers.length > 0 &&
                searchUsers.map((user, i) => {
                  const { id, name, email, photo } = user;

                  return (
                    <div
                      key={i}
                      className={`w-full p-3 px-4 flex gap-6 items-center cursor-pointer hover:bg-gray-200 first:hover:rounded-t-lg last:hover:rounded-b-lg`}
                      onClick={() => handleCreateSingleRoom(id)}
                    >
                      <div className="w-9">
                        <img
                          src={photo}
                          alt="profile"
                          className="w-full rounded-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div>{name}</div>
                        <div className="text-xs">{email}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* WORK: LOGO DIV */}
        <div>onClick</div>

        {/* WORK: PROFILE DIV */}
        <div className="flex">
          <img
            src={user?.photo}
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <p>{user?.name}</p>
        </div>
      </header>
      <main className="h-full w-full flex-1 flex">
        {/* WORK: SIDEBAR MENU */}
        <div className="w-72 h-full border-r border-slate-300">
          {rooms.length > 0 ? (
            rooms.map((room, i) => {
              const { id, name, members, admin } = room;

              return (
                <div
                  key={i}
                  className={`w-full cursor-pointer hover:bg-gray-50 pl-6 border-b border-gray-300 p-3 flex items-center gap-4 ${
                    id === activeRoom && "bg-gray-50"
                  }`}
                  onClick={() => setActiveRoom(id)}
                >
                  <img
                    src={members[0].photo}
                    alt="profile"
                    className="w-10 h-10 rounded-full bg-gray-100"
                  />
                  <div>
                    <div>{name || members[0].name}</div>
                    <div className="text-xs">{!name && members[0].email}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>Sorry, no chat available</div>
          )}
        </div>

        {/* WORK: CHAT MESSAGES */}
        <div className="relative flex-1 h-full">
          {activeRoom ? (
            <>
              <div>
                <div
                  className=" overflow-y-scroll max-h-96 p-6 flex flex-col gap-3"
                  // style={{ height: "calc(100% - 60px)" }}
                >
                  {messageList.length > 0 ? (
                    messageList.map((obj, i) => {
                      const { name, message, sender } = obj;

                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-4 w-max p-2 border border-black rounded-xl ${
                            sender !== user?.id && "self-end bg-gray-100"
                          }`}
                        >
                          <p className="text-sm">{name}</p>
                          <p>{message}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p>No chat available</p>
                  )}
                </div>
              </div>
              <div className="absolute z-10 bg-gray-50 w-full bottom-0 border-t border-slate-400 py-2 px-6 pr-10 h-14 flex justify-between gap-8 items-center">
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
                    className="border border-slate-300 rounded-3xl p-1 pl-4 w-full"
                  />
                </div>
                <div
                  onClick={() => sendChat(activeRoom)}
                  className="cursor-pointer"
                >
                  Send
                </div>
              </div>
            </>
          ) : (
            <p>Please Select a chat to see CHat Message</p>
          )}
        </div>
      </main>
    </section>
  );
};

export default Home;
