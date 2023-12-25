import { useEffect, useState } from "react";
import Header from "./components/Header";
import SidebarMenu from "./components/SidebarMenu";
import ChatRoom from "./components/ChatRoom";
import { ErrorBoundary } from "react-error-boundary";
import UseUserRooms from "../../hooks/query/UseUserRooms";
import UseSocket from "../../hooks/socket/UseSocket";

const Home = () => {
  const [activeRoom, setActiveRoom] = useState(null);
  const { data } = UseUserRooms(true);
  const { socket, on, off } = UseSocket();
  const [rooms, setRooms] = useState(data?.rooms || []);
  const [list, setList] = useState(null);

  useEffect(() => {
    const chatArg = (arg) => {
      const { room } = arg;

      console.log("message", arg);

      setRooms((prev) => {
        prev = prev.map((rum) => {
          if (rum.id === room) {
            rum.chats = [...rum.chats, arg];
          }
          return rum;
        });

        return prev;
      });
    };

    if (socket) {
      on("chatMsg", chatArg);
    }

    return () => {
      // Cleanup: Remove the listener when the component unmounts
      off("chatMsg", chatArg);
    };
  }, [socket, on, off]);

  const showRoomChats = (roomId) => {
    setActiveRoom(roomId);
    const findRooms = rooms?.find((id) => id === roomId);
    setList(findRooms?.chats);
  };

  return (
    <section className="w-full h-full ">
      <Header />
      <main className="w-full flex" style={{ height: "calc(100% - 56px)" }}>
        {/* WORK: SIDEBAR MENU */}
        <SidebarMenu activeRoom={activeRoom} showRoomChats={showRoomChats} />

        {/* WORK: CHAT MESSAGES */}
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <ChatRoom activeRoom={activeRoom} list={list} />
        </ErrorBoundary>
      </main>
    </section>
  );
};

export default Home;
